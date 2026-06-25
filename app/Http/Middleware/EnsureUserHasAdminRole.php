<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasAdminRole
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->hasAdminRole()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => '无权访问，仅管理员可操作'], 403);
            }

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => '无权访问，仅管理员可操作',
            ]);

            return redirect()->route('home')->with('error', '无权访问，仅管理员可操作');
        }

        return $next($request);
    }
}
