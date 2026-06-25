<?php

namespace Database\Seeders;

use App\Models\Submission;
use App\Models\Tutorial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class SubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        $player2 = User::where('email', 'player2@example.com')->first();
        $flyer = User::where('email', 'flyer@example.com')->first();
        $admin = User::where('email', 'admin@osmo.local')->first();

        if (! $user) {
            return;
        }

        // 草稿投稿
        Submission::factory()->create([
            'user_id' => $user->id,
            'title' => '雨中拍摄防雨防水保护方案实操指南',
            'summary' => '详细讲解如何在雨天保护 Pocket 3 的同时拍出别具一格的雨中画面，包括防水配件推荐、机内参数调整技巧、以及后期雨丝增强手法。',
            'created_at' => Carbon::now()->subDays(3),
            'details' => [
                'category' => 'creative',
                'difficulty' => '进阶',
                'duration' => '12 分钟',
                'steps' => [
                    '为 Pocket 3 安装硅胶防水保护套，确保云台旋转轴处密封完好',
                    '进入机内设置，手动模式锁定 ISO 200-400，快门 1/120s 防止雨丝过度拉丝',
                    '选择 D-Log M 色彩模式，保留雨天天空云层的渐变细节',
                    '找一面有水滴汇聚的玻璃窗或树叶做前景，营造雨中朦胧纵深',
                ],
                'tips' => [
                    '雨中拍摄建议搭配磁吸 ND8，防止雨水反光导致的局部高光溢出',
                    '收音方面不要用 DJI Mic 2，雨水会损坏发射端。直接用机身麦克风录制雨声白噪音即可',
                ],
                'settings' => [
                    'resolution' => '4K 30fps',
                    'colorProfile' => 'D-Log M (10-bit)',
                    'gimbalMode' => '锁定 (Tilt Locked)',
                    'ndFilter' => 'ND8',
                ],
            ],
        ]);

        Submission::factory()->create([
            'user_id' => $flyer?->id ?? $user->id,
            'title' => '室内产品静物拍摄：桌面布光与微距参数',
            'summary' => '分享用 Pocket 3 拍摄小物件/手办/咖啡杯的静物布光思路，包含机位高度、反光板替代方案和参数组合。',
            'created_at' => Carbon::now()->subDays(2),
            'details' => [
                'category' => 'creative',
                'difficulty' => '新手',
                'duration' => '9 分钟',
                'steps' => [
                    '机位高度与主体平齐，避免俯拍变形',
                    '窗侧光 + 白纸反光补阴影',
                    '白平衡 5200K，曝光 +0.3EV',
                ],
                'tips' => ['可用黑色卡纸做暗角背景增强质感'],
                'settings' => [
                    'resolution' => '4K 30fps',
                    'colorProfile' => 'Normal 10-bit',
                    'gimbalMode' => '锁定 (Tilt Locked)',
                    'ndFilter' => '无',
                ],
            ],
        ]);

        // 待审核投稿
        Submission::factory()->pending()->create([
            'user_id' => $user->id,
            'title' => '宠物跟拍全流程：Pocket 3 追踪猫咪实战经验',
            'summary' => '从 AI 追踪灵敏度调整到低机位视角选择，分享使用 Pocket 3 拍摄猫咪日常的完整工作流。包含室内自然光参数和户外草地场景两套配置。',
            'submitted_at' => Carbon::now()->subHours(8),
            'created_at' => Carbon::now()->subDays(1),
            'details' => [
                'category' => 'vlog',
                'difficulty' => '新手',
                'duration' => '8 分钟',
                'steps' => [
                    '开机后双击屏幕开启 ActiveTrack 6.0 主角追踪模式',
                    '切换到极低机位（离地约 15cm），让 1 英寸大底的浅景深虚化地面',
                    '室内光线下用 Auto 模式即可，色彩设为 Normal 8-bit 让猫咪毛色更鲜艳',
                    '户外草地场景切换 HLG 10-bit，防止绿色过饱和',
                ],
                'tips' => [
                    '猫咪毛发的细节是 1 英寸 CMOS 的杀手锏，4K 30fps 足够捕捉舔毛的慢节奏',
                    '不要用跟随云台模式，猫咪路线不可预测，FPV 模式更灵活',
                ],
                'settings' => [
                    'resolution' => '4K 30fps',
                    'colorProfile' => 'Normal 8-bit',
                    'gimbalMode' => 'FPV 模式',
                    'ndFilter' => '无',
                ],
            ],
        ]);

        Submission::factory()->pending()->create([
            'user_id' => $player2?->id ?? $user->id,
            'title' => '地铁通勤 Vlog：嘈杂环境收音与稳定握持',
            'summary' => '早晚高峰地铁内拍摄通勤 Vlog 的实操方案，重点解决人声清晰度、画面稳定与隐私构图。',
            'submitted_at' => Carbon::now()->subHours(3),
            'created_at' => Carbon::now()->subHours(5),
            'details' => [
                'category' => 'vlog',
                'difficulty' => '进阶',
                'duration' => '7 分钟',
                'steps' => [
                    'Mic 2 开启智能降噪并靠近领口',
                    '云台跟随模式 + 肘部贴紧身体',
                    '避开乘客面部，采用过肩构图',
                ],
                'tips' => ['高峰期尽量在站台空档补拍 B-roll'],
                'settings' => [
                    'resolution' => '4K 30fps',
                    'colorProfile' => 'Normal 10-bit',
                    'gimbalMode' => '跟随 (Follow)',
                    'ndFilter' => '无',
                ],
            ],
        ]);

        Submission::factory()->pending()->create([
            'user_id' => $flyer?->id ?? $user->id,
            'title' => '海边日落延时：从黄金时刻到蓝调时刻参数切换',
            'summary' => '同一机位拍摄日落延时的完整流程，包含黄金时刻与蓝调时刻的曝光、白平衡切换策略。',
            'submitted_at' => Carbon::now()->subDay(),
            'created_at' => Carbon::now()->subDays(2),
            'details' => [
                'category' => 'cinematic',
                'difficulty' => '进阶',
                'duration' => '10 分钟',
                'steps' => [
                    '黄金时刻 ND8 + 1/50s 保留海浪丝绸感',
                    '日落后切换 4600K 白平衡',
                    '蓝调时刻启用低光视频模式',
                ],
                'tips' => ['提前锁定构图，延时期间不要碰云台'],
                'settings' => [
                    'resolution' => '4K 30fps',
                    'colorProfile' => 'D-Log M (10-bit)',
                    'gimbalMode' => '锁定 (Tilt Locked)',
                    'ndFilter' => 'ND8',
                ],
            ],
        ]);

        // 已驳回投稿
        Submission::factory()->rejected()->create([
            'user_id' => $user->id,
            'title' => '极限运动高速跟拍：FPV 穿越机对比评测',
            'summary' => '（初稿，内容待补充）用 Pocket 3 拍摄极限运动的参数方案。',
            'review_note' => '标题中提到「FPV 穿越机对比评测」，但 Pocket 3 并非穿越机产品线，定位偏差。建议重新聚焦于手持稳定器在实际运动场景中的表现。摘要过于简略，请补充至少 200 字的详细操作说明。',
            'reviewed_by' => $admin?->id,
            'submitted_at' => Carbon::now()->subDays(5),
            'reviewed_at' => Carbon::now()->subDays(4),
            'created_at' => Carbon::now()->subDays(6),
            'details' => [
                'category' => 'creative',
                'difficulty' => '大师',
                'duration' => '5 分钟',
                'steps' => ['（待补充）'],
                'tips' => [],
                'settings' => [
                    'resolution' => '4K 60fps',
                    'colorProfile' => 'D-Log M (10-bit)',
                    'gimbalMode' => 'FPV 模式',
                    'ndFilter' => 'ND16',
                ],
            ],
        ]);

        Submission::factory()->rejected()->create([
            'user_id' => $player2?->id ?? $user->id,
            'title' => 'Pocket 3 与手机夜景对比：谁更强？',
            'summary' => '简短对比稿，缺少具体场景与参数记录。',
            'review_note' => '对比类内容需要给出相同场景下的参数、截图或样片链接，并说明测试方法。请补充至少 3 组对照场景后再提交。',
            'reviewed_by' => $admin?->id,
            'submitted_at' => Carbon::now()->subDays(3),
            'reviewed_at' => Carbon::now()->subDays(2),
            'created_at' => Carbon::now()->subDays(4),
            'details' => [
                'category' => 'night',
                'difficulty' => '新手',
                'duration' => '4 分钟',
                'steps' => ['（待补充）'],
                'tips' => [],
                'settings' => [
                    'resolution' => '4K 30fps',
                    'colorProfile' => 'Normal 10-bit',
                    'gimbalMode' => '跟随 (Follow)',
                    'ndFilter' => '无',
                ],
            ],
        ]);

        // 已通过投稿（关联已发布教程）
        $publishedTutorial = Tutorial::query()
            ->where('title', 'LIKE', '%D-Log M%')
            ->first() ?? Tutorial::query()->first();

        if ($publishedTutorial && $admin) {
            Submission::factory()->approved()->create([
                'user_id' => $user->id,
                'reviewed_by' => $admin->id,
                'published_tutorial_id' => $publishedTutorial->id,
                'title' => '城市夜景手持拍摄：Pocket 3 纯净暗光实战',
                'summary' => '分享在无需三脚架的情况下，利用 Pocket 3 大底传感器和云台增稳拍摄城市夜景的完整参数方案，包含 ND 镜选择、快门速度和 ISO 控制技巧。',
                'submitted_at' => Carbon::now()->subDays(6),
                'reviewed_at' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(7),
                'details' => [
                    'category' => 'night',
                    'difficulty' => '进阶',
                    'duration' => '10 分钟',
                    'steps' => [
                        '选择 D-Log M 10-bit 色彩模式，保留夜景高光细节',
                        '手动模式锁定 ISO 100-400，快门 1/30s 配合 ND16',
                        '云台切换锁定模式，避免长曝光时画面漂移',
                        '后期在 DaVinci Resolve 中应用 DJI 官方 LUT 还原色彩',
                    ],
                    'tips' => [
                        '夜景拍摄务必关闭机内锐化，避免噪点被过度强化',
                        '如果画面有行人，可以用 0.5x 慢动作增加电影感',
                    ],
                    'settings' => [
                        'resolution' => '4K 24fps',
                        'colorProfile' => 'D-Log M (10-bit)',
                        'gimbalMode' => '锁定 (Tilt Locked)',
                        'ndFilter' => 'ND16',
                    ],
                ],
            ]);

            Submission::factory()->approved()->create([
                'user_id' => $player2?->id ?? $user->id,
                'reviewed_by' => $admin->id,
                'published_tutorial_id' => Tutorial::query()
                    ->where('category', 'vlog')
                    ->where('status', 'published')
                    ->first()?->id ?? $publishedTutorial->id,
                'title' => '探店 Vlog 口播：30 秒快速布光与收音',
                'summary' => '在餐厅/咖啡馆快速完成口播录制的流程，包含机位、曝光补偿、Mic 2 防风与一段完整示例。',
                'submitted_at' => Carbon::now()->subDays(2),
                'reviewed_at' => Carbon::now()->subDay(),
                'created_at' => Carbon::now()->subDays(3),
                'details' => [
                    'category' => 'vlog',
                    'difficulty' => '新手',
                    'duration' => '6 分钟',
                    'steps' => [
                        '选择靠窗座位，利用侧光塑造面部轮廓',
                        '白平衡 5400K，曝光 +0.3EV',
                        'Mic 2 蓝牙直连并开启防风毛套',
                    ],
                    'tips' => ['口播前先录 10 秒环境声，后期降噪更自然'],
                    'settings' => [
                        'resolution' => '4K 30fps',
                        'colorProfile' => 'Normal 10-bit',
                        'gimbalMode' => '跟随 (Follow)',
                        'ndFilter' => '无',
                    ],
                ],
            ]);
        }
    }
}
