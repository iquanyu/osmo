<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsNotDisabled
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->login_disabled_at !== null) {
            auth()->logout();

            if ($request->expectsJson()) {
                return response()->json(['error' => '账号已被禁用'], 403);
            }

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => '账号已被禁用',
            ]);

            return redirect()->route('login')->with('error', '账号已被禁用');
        }

        return $next($request);
    }
}
