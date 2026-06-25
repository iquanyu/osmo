<?php

namespace App\Http\Controllers;

use App\Models\CommunityPost;
use App\Queries\PublicCommunityQuery;
use App\Services\ActivityLogService;
use App\Services\CommunityPageData;
use App\Services\HomeOverviewService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    public function __construct(
        private PublicCommunityQuery $publicCommunityQuery,
        private ActivityLogService $activityLogService,
    ) {}

    public function index(HomeOverviewService $homeOverview): Response
    {
        $filters = $this->publicCommunityQuery->filters(request());
        $showHotPosts = $filters['q'] === '';

        return Inertia::render('community/index', [
            'posts' => CommunityPageData::listCollection((($this->publicCommunityQuery)(request()))->get()),
            'filters' => $filters,
            'hotCommunityPosts' => $showHotPosts
                ? CommunityPageData::listCollection($homeOverview->getRecentCommunityPosts())
                : [],
        ]);
    }

    public function show(CommunityPost $post): Response
    {
        $post->load('answers');
        $post->increment('views');
        $post->refresh();
        $post->load('answers');

        return Inertia::render('community/show', [
            'post' => CommunityPageData::detail($post),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'author' => 'nullable|string|max:50',
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'tags' => 'nullable|string',
        ]);

        $avatarColors = ['bg-red-500', 'bg-amber-600', 'bg-emerald-600', 'bg-blue-600', 'bg-purple-600'];

        $tags = array_filter(array_map('trim', explode(' ', $validated['tags'] ?? '')));
        if (empty($tags)) {
            $tags = ['新手探路'];
        }

        $authorName = isset($validated['author']) && trim($validated['author']) !== ''
            ? trim($validated['author'])
            : ($request->user()?->name ?? '热心飞友');

        CommunityPost::create([
            'author' => $authorName,
            'avatar_color' => $avatarColors[array_rand($avatarColors)],
            'title' => trim($validated['title']),
            'content' => trim($validated['content']),
            'tags' => $tags,
            'likes' => 0,
            'views' => 0,
            'pinned' => false,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => '发帖成功']);

        return redirect()->back()->with('success', '发帖成功');
    }

    public function like(CommunityPost $post): RedirectResponse
    {
        $post->increment('likes');

        return redirect()->back();
    }

    public function answer(Request $request, CommunityPost $post): RedirectResponse
    {
        $validated = $request->validate([
            'author' => 'nullable|string|max:50',
            'content' => 'required|string',
        ]);

        $authorName = isset($validated['author']) && trim($validated['author']) !== ''
            ? trim($validated['author'])
            : ($request->user()?->name ?? '热心飞友');

        $post->answers()->create([
            'author' => $authorName,
            'content' => trim($validated['content']),
            'is_official' => false,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => '回答已发布']);

        return redirect()->back()->with('success', '回答已发布');
    }

    public function destroy(Request $request, CommunityPost $post): RedirectResponse
    {
        $this->authorize('delete', $post);

        $post->delete();

        if ($request->routeIs('admin.*')) {
            $this->activityLogService->record(
                'community_post_deleted',
                sprintf('删除帖子「%s」', $post->title),
                $request->user(),
                $post,
                ['post_id' => $post->id],
                $request,
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => '帖子已删除']);

        if ($request->routeIs('admin.*')) {
            return redirect()->route('admin.community')->with('success', '帖子已删除');
        }

        return redirect()->back()->with('success', '帖子已删除');
    }

    public function togglePin(CommunityPost $post): RedirectResponse
    {
        $this->authorize('pin', $post);

        $post->update(['pinned' => ! $post->pinned]);

        if (request()->routeIs('admin.*')) {
            $this->activityLogService->record(
                'community_post_pinned',
                sprintf('%s帖子「%s」', $post->pinned ? '置顶' : '取消置顶', $post->title),
                request()->user(),
                $post,
                ['post_id' => $post->id, 'pinned' => $post->pinned],
                request(),
            );
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $post->pinned ? '已置顶' : '已取消置顶',
        ]);

        return redirect()->back()->with('success', $post->pinned ? '已置顶' : '已取消置顶');
    }
}
