<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\TutorialMetaRequest;
use App\Http\Requests\Admin\TutorialRequest;
use App\Models\Tutorial;
use App\Queries\PublicTutorialQuery;
use App\Services\ActivityLogService;
use App\Services\CoverImageStorage;
use App\Services\TutorialPageData;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TutorialController extends Controller
{
    private const PER_PAGE = 9;

    public function __construct(
        private PublicTutorialQuery $publicTutorialQuery,
        private ActivityLogService $activityLogService,
    ) {}

    public function index(): Response
    {
        $tutorials = ($this->publicTutorialQuery)(request())
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (Tutorial $tutorial): array => TutorialPageData::listItem($tutorial));

        return Inertia::render('tutorials/index', [
            'tutorials' => Inertia::scroll($tutorials),
            'filters' => $this->publicTutorialQuery->filters(request()),
        ]);
    }

    public function show(Tutorial $tutorial): Response
    {
        if ($tutorial->status !== 'published') {
            abort(404);
        }

        return Inertia::render('tutorials/show', [
            'tutorial' => TutorialPageData::detail($tutorial),
        ]);
    }

    public function store(TutorialRequest $request): RedirectResponse
    {
        $this->authorize('create', Tutorial::class);

        $tutorial = Tutorial::create($this->prepareTutorialPayload($request));

        if ($request->routeIs('admin.*')) {
            $this->activityLogService->record(
                'tutorial_created',
                sprintf('创建教程「%s」', $tutorial->title),
                $request->user(),
                $tutorial,
                ['tutorial_id' => $tutorial->id],
                $request,
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => '教程创建成功']);

        return redirect()->route('admin.tutorials')->with('success', '教程创建成功');
    }

    public function update(TutorialRequest $request, Tutorial $tutorial): RedirectResponse
    {
        $this->authorize('update', $tutorial);

        $tutorial->update($this->prepareTutorialPayload($request, $tutorial));

        if ($request->routeIs('admin.*')) {
            $this->activityLogService->record(
                'tutorial_updated',
                sprintf('更新教程「%s」', $tutorial->title),
                $request->user(),
                $tutorial,
                ['tutorial_id' => $tutorial->id],
                $request,
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => '教程更新成功']);

        return redirect()->route('admin.tutorials')->with('success', '教程更新成功');
    }

    public function updateMeta(TutorialMetaRequest $request, Tutorial $tutorial): RedirectResponse
    {
        $this->authorize('update', $tutorial);

        $validated = $request->validated();

        $nextStatus = $validated['status'] ?? $tutorial->status;

        $tutorial->update([
            'status' => $nextStatus,
            'sort_order' => $validated['sort_order'] ?? $tutorial->sort_order,
            'is_featured' => (bool) ($validated['is_featured'] ?? $tutorial->is_featured),
            'published_at' => $nextStatus === 'published'
                ? ($tutorial->published_at ?? now())
                : null,
        ]);

        if ($request->routeIs('admin.*')) {
            $this->activityLogService->record(
                'tutorial_meta_updated',
                sprintf('更新教程运营信息「%s」', $tutorial->title),
                $request->user(),
                $tutorial,
                ['tutorial_id' => $tutorial->id],
                $request,
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => '教程运营信息已更新']);

        return redirect()->back()->with('success', '教程运营信息已更新');
    }

    public function destroy(Tutorial $tutorial): RedirectResponse
    {
        $this->authorize('delete', $tutorial);

        app(CoverImageStorage::class)->deleteIfStored($tutorial->image);

        $tutorial->delete();

        if (request()->routeIs('admin.*')) {
            $this->activityLogService->record(
                'tutorial_deleted',
                sprintf('删除教程「%s」', $tutorial->title),
                request()->user(),
                $tutorial,
                ['tutorial_id' => $tutorial->id],
                request(),
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => '教程已删除']);

        return redirect()->back()->with('success', '教程已删除');
    }

    /**
     * @return array<string, mixed>
     */
    private function prepareTutorialPayload(TutorialRequest $request, ?Tutorial $tutorial = null): array
    {
        $validated = $request->validated();
        unset($validated['cover_image']);

        $storage = app(CoverImageStorage::class);
        $previousImage = $tutorial?->image;

        if ($request->hasFile('cover_image')) {
            $validated['image'] = $storage->store($request->file('cover_image'), 'tutorials');
            $storage->deleteIfStored($previousImage);
        } else {
            $imageUrl = trim((string) ($validated['image'] ?? ''));

            if ($imageUrl !== '') {
                $validated['image'] = $imageUrl;

                if ($previousImage !== null && $previousImage !== $imageUrl) {
                    $storage->deleteIfStored($previousImage);
                }
            } elseif ($tutorial !== null) {
                $validated['image'] = $tutorial->image;
            }
        }

        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_featured'] = (bool) ($validated['is_featured'] ?? false);
        $validated['published_at'] = $validated['status'] === 'published'
            ? ($tutorial?->published_at ?? now())
            : null;

        return $validated;
    }
}
