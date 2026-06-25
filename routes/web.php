<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\ContributeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SimulatorController;
use App\Http\Controllers\ToolsController;
use App\Http\Controllers\TutorialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/tutorials', [TutorialController::class, 'index'])->name('tutorials.index');
Route::get('/tutorials/{tutorial}', [TutorialController::class, 'show'])->name('tutorials.show');

Route::get('/simulator', [SimulatorController::class, 'index'])->name('simulator');

Route::get('/tools', [ToolsController::class, 'index'])->name('tools.index');
Route::get('/tools/nd-calculator', [ToolsController::class, 'ndCalculator'])->name('tools.nd-calculator');
Route::get('/tools/specs', [ToolsController::class, 'specs'])->name('tools.specs');
Route::get('/tools/accessories', [ToolsController::class, 'accessories'])->name('tools.accessories');

Route::get('/assistant', [AssistantController::class, 'index'])->name('assistant');
Route::post('/assistant/suggest', [AssistantController::class, 'suggest'])->name('assistant.suggest');

Route::get('/community', [CommunityController::class, 'index'])->name('community');
Route::get('/community/{post}', [CommunityController::class, 'show'])->name('community.show');
Route::post('/community', [CommunityController::class, 'store'])->name('community.store');
Route::post('/community/{post}/like', [CommunityController::class, 'like'])->name('community.like');
Route::post('/community/{post}/answer', [CommunityController::class, 'answer'])->name('community.answer');

Route::middleware(['auth', 'user.active', 'verified'])->prefix('contribute')->group(function () {
    Route::get('/', [ContributeController::class, 'index'])->name('contribute.index');
    Route::post('/', [ContributeController::class, 'store'])->name('contribute.store');
    Route::put('/{submission}', [ContributeController::class, 'update'])->name('contribute.update');
    Route::post('/{submission}/submit', [ContributeController::class, 'submit'])->name('contribute.submit');
    Route::delete('/{submission}', [ContributeController::class, 'destroy'])->name('contribute.destroy');
});

Route::middleware(['auth', 'user.active', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users');
    Route::get('/users/export', [\App\Http\Controllers\Admin\UserController::class, 'export'])->name('admin.users.export');
    Route::patch('/users/{user}/role', [\App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('admin.users.role');
    Route::get('/logs', [\App\Http\Controllers\Admin\LogController::class, 'index'])->name('admin.logs');
    Route::get('/logs/export', [\App\Http\Controllers\Admin\LogController::class, 'export'])->name('admin.logs.export');
    Route::get('/tutorials', [AdminController::class, 'tutorials'])->name('admin.tutorials');
    Route::get('/tutorials/create', [AdminController::class, 'createTutorial'])->name('admin.tutorials.create');
    Route::get('/tutorials/{tutorial}/edit', [AdminController::class, 'editTutorial'])->name('admin.tutorials.edit');
    Route::get('/community', [AdminController::class, 'community'])->name('admin.community');
    Route::get('/community/{post}', [AdminController::class, 'showCommunityPost'])->name('admin.community.show');
    Route::post('/tutorials', [TutorialController::class, 'store'])->name('admin.tutorials.store');
    Route::patch('/tutorials/{tutorial}/meta', [TutorialController::class, 'updateMeta'])->name('admin.tutorials.meta');
    Route::put('/tutorials/{tutorial}', [TutorialController::class, 'update'])->name('admin.tutorials.update');
    Route::delete('/tutorials/{tutorial}', [TutorialController::class, 'destroy'])->name('admin.tutorials.destroy');
    Route::delete('/community/{post}', [CommunityController::class, 'destroy'])->name('admin.community.destroy');
    Route::post('/community/{post}/pin', [CommunityController::class, 'togglePin'])->name('admin.community.pin');
    Route::post('/community/{post}/official-answer', [AdminController::class, 'officialAnswer'])->name('admin.community.official-answer');
    Route::post('/reset', [AdminController::class, 'reset'])->name('admin.reset');
    Route::get('/submissions', [AdminController::class, 'submissions'])->name('admin.submissions');
    Route::get('/submissions/{submission}', [AdminController::class, 'showSubmission'])->name('admin.submissions.show');
    Route::post('/submissions/{submission}/approve', [AdminController::class, 'approveSubmission'])->name('admin.submissions.approve');
    Route::post('/submissions/{submission}/reject', [AdminController::class, 'rejectSubmission'])->name('admin.submissions.reject');
});

Route::middleware(['auth', 'user.active', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        return redirect()->route(
            $request->user()?->hasAdminRole() ? 'admin.index' : 'contribute.index',
        );
    })->name('dashboard');
});

require __DIR__.'/settings.php';
