<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRoleRequest;
use App\Models\ActivityLog;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private ActivityLogService $activityLogService) {}

    public function index(Request $request): Response
    {
        $role = $request->string('role')->toString();
        $search = $request->string('search')->toString();

        $users = User::query()
            ->when($role === 'admin', fn ($query) => $query->where('role', 'admin'))
            ->when($role === 'player', fn ($query) => $query->where('role', 'player'))
            ->when($search !== '', fn ($query) => $query->where(function ($subQuery) use ($search): void {
                $subQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $recentLogsByUser = ActivityLog::query()
            ->with('user')
            ->whereIn('user_id', $users->getCollection()->pluck('id')->all())
            ->latest()
            ->get()
            ->groupBy('user_id')
            ->map(fn ($logs) => $logs->take(3)->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'message' => $log->message,
                'created_at' => (string) $log->created_at,
            ])->values());

        return Inertia::render('admin/users', [
            'users' => $users,
            'recentLogsByUser' => $recentLogsByUser,
            'filters' => [
                'role' => $role !== '' ? $role : 'all',
                'search' => $search,
            ],
        ]);
    }

    public function export(Request $request): HttpResponse
    {
        $role = $request->string('role')->toString();
        $search = $request->string('search')->toString();

        $users = User::query()
            ->when($role === 'admin', fn ($query) => $query->where('role', 'admin'))
            ->when($role === 'player', fn ($query) => $query->where('role', 'player'))
            ->when($search !== '', fn ($query) => $query->where(function ($subQuery) use ($search): void {
                $subQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->latest()
            ->get();

        $csv = collect([
            ['ID', '姓名', '邮箱', '角色', '登录禁用', '创建时间'],
            ...$users->map(fn (User $user) => [
                $user->id,
                $user->name,
                $user->email,
                $user->role,
                $user->login_disabled_at ? 'yes' : 'no',
                (string) $user->created_at,
            ])->all(),
        ])->map(fn (array $row) => implode(',', array_map(
            fn ($value) => '"'.str_replace('"', '""', (string) $value).'"',
            $row,
        )))->implode("\n");

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=users.csv',
        ]);
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();
        $previousRole = $user->role;

        if (($validated['mode'] ?? 'role') === 'password') {
            $user->update(['password' => Hash::make('password')]);

            $this->activityLogService->record(
                'user_password_reset',
                sprintf('重置用户 %s 的密码', $user->name),
                $request->user(),
                $user,
                ['user_id' => $user->id],
                $request,
            );

            Inertia::flash('toast', ['type' => 'success', 'message' => '用户密码已重置为默认密码']);

            return back()->with('success', '用户密码已重置为默认密码');
        }

        if (($validated['mode'] ?? 'role') === 'disable') {
            $user->update(['login_disabled_at' => now()]);

            $this->activityLogService->record(
                'user_login_disabled',
                sprintf('禁用用户 %s 登录', $user->name),
                $request->user(),
                $user,
                ['user_id' => $user->id],
                $request,
            );

            Inertia::flash('toast', ['type' => 'success', 'message' => '已禁用该用户登录']);

            return back()->with('success', '已禁用该用户登录');
        }

        if (($validated['mode'] ?? 'role') === 'enable') {
            $user->update(['login_disabled_at' => null]);

            $this->activityLogService->record(
                'user_login_enabled',
                sprintf('恢复用户 %s 登录', $user->name),
                $request->user(),
                $user,
                ['user_id' => $user->id],
                $request,
            );

            Inertia::flash('toast', ['type' => 'success', 'message' => '已恢复该用户登录']);

            return back()->with('success', '已恢复该用户登录');
        }

        $user->update(['role' => $validated['role']]);

        $this->activityLogService->record(
            'user_role_updated',
            sprintf('将用户 %s 角色从 %s 调整为 %s', $user->name, $previousRole, $validated['role']),
            $request->user(),
            $user,
            ['previous_role' => $previousRole, 'next_role' => $validated['role']],
            $request,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => '用户角色已更新']);

        return back()->with('success', '用户角色已更新');
    }
}
