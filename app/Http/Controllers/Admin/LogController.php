<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogController extends Controller
{
    public function index(Request $request): Response
    {
        $action = $request->string('action')->toString();
        $search = $request->string('search')->toString();
        $userId = $request->integer('user_id');
        $subjectType = $request->string('subject_type')->toString();
        $from = $request->string('from')->toString();
        $to = $request->string('to')->toString();

        $logs = ActivityLog::query()
            ->with('user')
            ->when($action !== '', fn ($query) => $query->where('action', $action))
            ->when($userId > 0, fn ($query) => $query->where('user_id', $userId))
            ->when($subjectType !== '' && $subjectType !== 'all', fn ($query) => $query->where('subject_type', $subjectType))
            ->when($search !== '', fn ($query) => $query->where(function ($subQuery) use ($search): void {
                $subQuery->where('message', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($userQuery) => $userQuery->where('name', 'like', "%{$search}%"));
            }))
            ->when($from !== '', fn ($query) => $query->whereDate('created_at', '>=', $from))
            ->when($to !== '', fn ($query) => $query->whereDate('created_at', '<=', $to))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/logs', [
            'logs' => $logs,
            'stats' => [
                'currentPageLogs' => $logs->count(),
                'uniqueActions' => $logs->pluck('action')->unique()->count(),
                'uniqueUsers' => $logs->pluck('user_id')->filter()->unique()->count(),
            ],
            'filters' => [
                'action' => $action !== '' ? $action : 'all',
                'search' => $search,
                'user_id' => $userId > 0 ? $userId : null,
                'subject_type' => $subjectType !== '' ? $subjectType : 'all',
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }

    public function export(Request $request): HttpResponse
    {
        $action = $request->string('action')->toString();
        $search = $request->string('search')->toString();
        $userId = $request->integer('user_id');
        $subjectType = $request->string('subject_type')->toString();
        $from = $request->string('from')->toString();
        $to = $request->string('to')->toString();

        $logs = ActivityLog::query()
            ->with('user')
            ->when($action !== '', fn ($query) => $query->where('action', $action))
            ->when($userId > 0, fn ($query) => $query->where('user_id', $userId))
            ->when($subjectType !== '' && $subjectType !== 'all', fn ($query) => $query->where('subject_type', $subjectType))
            ->when($search !== '', fn ($query) => $query->where(function ($subQuery) use ($search): void {
                $subQuery->where('message', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($userQuery) => $userQuery->where('name', 'like', "%{$search}%"));
            }))
            ->when($from !== '', fn ($query) => $query->whereDate('created_at', '>=', $from))
            ->when($to !== '', fn ($query) => $query->whereDate('created_at', '<=', $to))
            ->latest()
            ->get();

        $csv = collect([
            ['ID', '操作', '消息', '操作人', '时间', 'IP'],
            ...$logs->map(fn (ActivityLog $log) => [
                $log->id,
                $log->action,
                $log->message,
                $log->user?->name ?? '系统',
                (string) $log->created_at,
                $log->ip_address ?? '',
            ])->all(),
        ])->map(fn (array $row) => implode(',', array_map(
            fn ($value) => '"'.str_replace('"', '""', (string) $value).'"',
            $row,
        )))->implode("\n");

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=activity-logs.csv',
        ]);
    }
}
