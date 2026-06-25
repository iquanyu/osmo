<?php

namespace App\Http\Controllers;

use App\Http\Requests\Submission\StoreSubmissionRequest;
use App\Http\Requests\Submission\SubmitSubmissionRequest;
use App\Http\Requests\Submission\UpdateSubmissionRequest;
use App\Models\Submission;
use App\Services\CoverImageStorage;
use App\Services\SubmissionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContributeController extends Controller
{
    /**
     * 我的投稿列表
     */
    public function index(Request $request): Response
    {
        $status = (string) $request->string('status', 'all');

        $submissions = Submission::query()
            ->forUser((int) auth()->id())
            ->with(['publishedTutorial:id,title'])
            ->when(
                in_array($status, ['draft', 'pending', 'approved', 'rejected'], true),
                fn (Builder $query) => $query->where('status', $status),
            )
            ->orderByRaw("case when status = 'draft' then 0 when status = 'rejected' then 1 when status = 'pending' then 2 when status = 'approved' then 3 else 4 end")
            ->orderByDesc('updated_at')
            ->get();

        $baseQuery = Submission::query()->forUser((int) auth()->id());

        return Inertia::render('contribute/index', [
            'submissions' => $submissions,
            'stats' => [
                'draft' => (clone $baseQuery)->where('status', 'draft')->count(),
                'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
                'approved' => (clone $baseQuery)->where('status', 'approved')->count(),
                'rejected' => (clone $baseQuery)->where('status', 'rejected')->count(),
            ],
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    /**
     * 新建投稿（存为草稿）
     */
    public function store(StoreSubmissionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $payload = $this->prepareSubmissionPayload($request, $validated);

        Submission::create([
            'user_id' => auth()->id(),
            'type' => 'tutorial',
            'status' => 'draft',
            ...$payload,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => '投稿已保存为草稿']);

        return redirect()->back()->with('success', '投稿已保存为草稿');
    }

    /**
     * 编辑草稿
     */
    public function update(UpdateSubmissionRequest $request, Submission $submission): RedirectResponse
    {
        $validated = $request->validated();

        $submission->update($this->prepareSubmissionPayload($request, $validated, $submission));

        Inertia::flash('toast', ['type' => 'success', 'message' => '草稿已更新']);

        return redirect()->back()->with('success', '草稿已更新');
    }

    /**
     * 提交审核：draft/rejected → pending
     */
    public function submit(SubmitSubmissionRequest $request, Submission $submission): RedirectResponse
    {
        if (! $submission->isEditable()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => '当前状态不可提交审核']);

            return redirect()->back();
        }

        $service = app(SubmissionService::class);
        $service->submit($submission);

        Inertia::flash('toast', ['type' => 'success', 'message' => '投稿已提交审核']);

        return redirect()->back()->with('success', '投稿已提交审核');
    }

    /**
     * 删除投稿（仅 draft/rejected 可删）
     */
    public function destroy(Submission $submission): RedirectResponse
    {
        $this->authorize('delete', $submission);

        app(CoverImageStorage::class)->deleteIfStored($submission->cover_image);

        $submission->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => '投稿已删除']);

        return redirect()->back()->with('success', '投稿已删除');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function prepareSubmissionPayload(
        StoreSubmissionRequest|UpdateSubmissionRequest $request,
        array $validated,
        ?Submission $submission = null,
    ): array {
        return [
            'title' => $validated['title'],
            'summary' => $validated['summary'],
            'cover_image' => app(CoverImageStorage::class)->resolveFromRequest(
                $request,
                $submission?->cover_image,
                directory: 'submissions',
            ),
            'details' => [
                'category' => $validated['category'],
                'difficulty' => $validated['difficulty'],
                'duration' => $validated['duration'],
                'steps' => $validated['steps'],
                'tips' => $validated['tips'] ?? [],
                'settings' => $validated['settings'],
            ],
        ];
    }
}
