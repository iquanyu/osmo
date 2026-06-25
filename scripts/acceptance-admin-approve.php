#!/usr/bin/env php
<?php

/**
 * 本地验收脚本：管理员 → 审核投稿 → 前台教程库可见
 *
 * 用法：php scripts/acceptance-admin-approve.php
 * 可选：php scripts/acceptance-admin-approve.php --dry-run
 */

use App\Enums\SubmissionStatus;
use App\Models\Submission;
use App\Models\Tutorial;
use App\Models\User;
use App\Services\SubmissionService;
use Illuminate\Contracts\Console\Kernel;

$dryRun = in_array('--dry-run', $argv, true);

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

function step(string $label, bool $ok, ?string $detail = null): void
{
    $icon = $ok ? '✓' : '✗';
    $line = "  {$icon} {$label}";
    if ($detail !== null) {
        $line .= " — {$detail}";
    }
    echo $line.PHP_EOL;
}

function fail(string $message): never
{
    echo PHP_EOL."验收失败：{$message}".PHP_EOL;
    exit(1);
}

echo PHP_EOL.'=== Osmo 后台审核 → 前台可见 验收 ==='.PHP_EOL.PHP_EOL;

$admin = User::query()->where('role', 'admin')->orderBy('id')->first();
if ($admin === null) {
    fail('未找到管理员账号，请先运行 php artisan db:seed');
}
step('管理员账号', true, "{$admin->email} (id={$admin->id})");

$marker = '【验收脚本】'.date('Y-m-d H:i:s');
$existing = Submission::query()
    ->where('title', 'like', '【验收脚本】%')
    ->where('status', SubmissionStatus::Pending)
    ->first();

if ($existing !== null) {
    $submission = $existing;
    step('待审投稿', true, "复用 #{$submission->id} «{$submission->title}»");
} else {
    $player = User::query()->where('role', 'player')->orderBy('id')->first();
    if ($player === null) {
        fail('未找到玩家账号');
    }

    $submission = Submission::factory()->pending()->create([
        'user_id' => $player->id,
        'title' => $marker,
        'summary' => 'scripts/acceptance-admin-approve.php 自动创建的验收投稿。',
    ]);
    step('待审投稿', true, "新建 #{$submission->id} «{$submission->title}»");
}

$title = $submission->title;
$tutorialBefore = Tutorial::query()->where('title', $title)->where('status', 'published')->first();
step('审核前前台教程', true, $tutorialBefore ? "已存在 tutorial #{$tutorialBefore->id}" : '尚无同名 published 教程');

if ($submission->status !== SubmissionStatus::Pending) {
    fail("投稿 #{$submission->id} 状态为 {$submission->status->value}，非 pending");
}

if ($dryRun) {
    echo PHP_EOL.'--dry-run：跳过审核与前台校验'.PHP_EOL;
    exit(0);
}

if ($tutorialBefore === null) {
    app(SubmissionService::class)->approve($submission->fresh(), $admin);
    $submission->refresh();
    step('管理员审核通过', true, "reviewed_by={$submission->reviewed_by}, tutorial_id={$submission->published_tutorial_id}");
} else {
    step('管理员审核通过', true, '跳过（教程已存在）');
}

$tutorial = Tutorial::query()->where('title', $title)->where('status', 'published')->first();
if ($tutorial === null) {
    fail("审核后未找到 published 教程 «{$title}»");
}
step('教程入库', true, "tutorial #{$tutorial->id}, status={$tutorial->status}");

// 与 TutorialController::index 相同查询
$onPublicIndex = Tutorial::query()
    ->where('status', 'published')
    ->where('title', $title)
    ->exists();

step('前台 /tutorials 数据源', $onPublicIndex, $onPublicIndex ? "«{$title}» 在 published 列表中" : '未命中');

if (! $onPublicIndex) {
    fail("前台教程库不会展示 «{$title}»");
}

echo PHP_EOL.'验收通过：管理员审核 → 教程 published → 前台可见'.PHP_EOL;
echo "  管理员：{$admin->email} / dji2026（若已 seed）".PHP_EOL;
echo "  教程：{$title}".PHP_EOL.PHP_EOL;
exit(0);
