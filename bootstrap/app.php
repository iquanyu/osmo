<?php

use App\Http\Middleware\EnsureUserHasAdminRole;
use App\Http\Middleware\EnsureUserIsNotDisabled;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => EnsureUserHasAdminRole::class,
            'user.active' => EnsureUserIsNotDisabled::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if (! $request->header('X-Inertia')) {
                return null;
            }

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->getMessage() ?: '无权执行此操作',
            ]);

            return redirect()->back();
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->header('X-Inertia')) {
                return null;
            }

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $e->validator->errors()->first() ?: '表单校验失败，请检查输入',
            ]);

            return redirect($e->redirectTo ?? url()->previous())
                ->withInput(Arr::except($request->input(), $e->errorBag))
                ->withErrors($e->errors(), $e->errorBag);
        });
    })->create();
