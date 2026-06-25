<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OfficialAnswerRequest;
use App\Http\Requests\Admin\RejectSubmissionRequest;
use App\Models\CommunityPost;
use App\Models\Submission;
use App\Models\Tutorial;
use App\Queries\AdminCommunityQuery;
use App\Queries\AdminSubmissionQuery;
use App\Queries\AdminTutorialQuery;
use App\Services\ActivityLogService;
use App\Services\AdminOverviewService;
use App\Services\SubmissionService;
use Database\Seeders\CommunityPostSeeder;
use Database\Seeders\TutorialSeeder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function __construct(
        private AdminOverviewService $overviewService,
        private AdminTutorialQuery $tutorialQuery,
        private AdminCommunityQuery $communityQuery,
        private AdminSubmissionQuery $submissionQuery,
        private ActivityLogService $activityLogService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/index', [
            'stats' => $this->overviewService->getStats(),
            'recentTutorials' => $this->overviewService->getRecentTutorials(),
            'recentPosts' => $this->overviewService->getRecentPosts(),
            'weeklyTrend' => $this->overviewService->getWeeklyTrend(),
            'canResetDemoData' => app()->environment('local'),
        ]);
    }

    public function tutorials(Request $request): Response
    {
        return Inertia::render('admin/tutorials', [
            'stats' => $this->overviewService->getStats(),
            'tutorials' => ($this->tutorialQuery)($request)
                ->paginate(8)
                ->withQueryString(),
            'filters' => $this->tutorialQuery->filters($request),
        ]);
    }

    public function createTutorial(): Response
    {
        return Inertia::render('admin/tutorial-create', [
            'tutorial' => null,
        ]);
    }

    public function editTutorial(Tutorial $tutorial): Response
    {
        return Inertia::render('admin/tutorial-edit', [
            'tutorial' => $tutorial,
        ]);
    }

    public function community(Request $request): Response
    {
        return Inertia::render('admin/community', [
            'stats' => $this->overviewService->getStats(),
            'posts' => ($this->communityQuery)($request)
                ->paginate(8)
                ->withQueryString(),
            'availableTags' => $this->overviewService->getAvailableTags(),
            'filters' => $this->communityQuery->filters($request),
        ]);
    }

    public function showCommunityPost(CommunityPost $post): Response
    {
        $this->authorize('view', $post);

        $post->load('answers');
        $post->loadCount('answers');

        $stats = $this->overviewService->getStats();

        return Inertia::render('admin/community-detail', [
            'post' => $post,
            'stats' => [
                'postCount' => $stats['postCount'],
                'totalLikes' => $stats['totalLikes'],
                'totalAnswers' => $stats['totalAnswers'],
                'pinnedCount' => $stats['pinnedCount'],
            ],
        ]);
    }

    public function officialAnswer(OfficialAnswerRequest $request, CommunityPost $post): RedirectResponse
    {
        $this->authorize('officialAnswer', $post);

        $validated = $request->validated();

        $post->answers()->create([
            'author' => $request->user()->name,
            'content' => trim($validated['content']),
            'is_official' => true,
        ]);

        $this->activityLogService->record(
            'community_official_answer_created',
            sprintf('为帖子「%s」发布官方回复', $post->title),
            $request->user(),
            $post,
            ['post_id' => $post->id],
            $request,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => '官方回复已发布']);

        return redirect()->back()->with('success', '官方回复已发布');
    }

    public function reset(Request $request): RedirectResponse
    {
        abort_unless(app()->environment('local'), 403);

        CommunityPost::query()->delete();
        Tutorial::query()->delete();

        $seeder = new TutorialSeeder;
        $seeder->run();

        $communitySeeder = new CommunityPostSeeder;
        $communitySeeder->run();

        $this->activityLogService->record(
            'demo_data_reset',
            '恢复了演示数据',
            $request->user(),
            null,
            [],
            $request,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => '系统已恢复演示数据']);

        return redirect()->route('admin.index')->with('success', '系统已恢复演示数据');
    }

    /**
     * 投稿审核队列
     */
    public function submissions(Request $request): Response
    {
        $this->authorize('viewAny', Submission::class);

        $counts = $this->submissionQuery->queueCounts();

        return Inertia::render('admin/submissions', [
            ...$counts,
            'submissions' => ($this->submissionQuery)($request)
                ->paginate(10)
                ->withQueryString(),
            'filters' => $this->submissionQuery->filters($request),
        ]);
    }

    public function showSubmission(Submission $submission): Response
    {
        $this->authorize('viewAny', Submission::class);

        $submission->load(['user', 'reviewer', 'publishedTutorial']);

        return Inertia::render('admin/submission-detail', [
            'submission' => $submission,
            'queueMeta' => $this->submissionQuery->queueCounts(),
        ]);
    }

    /**
     * 通过审核
     */
    public function approveSubmission(Request $request, Submission $submission): RedirectResponse
    {
        $this->authorize('approve', $submission);

        try {
            app(SubmissionService::class)->approve($submission, $request->user());
        } catch (\InvalidArgumentException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => '该投稿已处理，无法重复审核']);

            return redirect()->back();
        }

        $this->activityLogService->record(
            'submission_approved',
            sprintf('审核通过投稿「%s」', $submission->title),
            $request->user(),
            $submission,
            ['submission_id' => $submission->id],
            $request,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => '投稿已通过审核，教程已入库']);

        return redirect()->back()->with('success', '投稿已通过审核，教程已入库');
    }

    /**
     * 驳回审核
     */
    public function rejectSubmission(RejectSubmissionRequest $request, Submission $submission): RedirectResponse
    {
        $this->authorize('reject', $submission);

        try {
            app(SubmissionService::class)->reject(
                $submission,
                $request->user(),
                $request->validated()['review_note'],
            );
        } catch (\InvalidArgumentException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => '该投稿已处理，无法重复审核']);

            return redirect()->back();
        }

        $this->activityLogService->record(
            'submission_rejected',
            sprintf('驳回投稿「%s」', $submission->title),
            $request->user(),
            $submission,
            ['submission_id' => $submission->id],
            $request,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => '投稿已驳回']);

        return redirect()->back()->with('success', '投稿已驳回');
    }
}
