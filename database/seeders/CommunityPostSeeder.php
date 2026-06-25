<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\CommunityPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CommunityPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'author' => '航拍调色板',
                'avatar_color' => 'bg-red-500',
                'title' => '在 F2.0 大光圈直射下套 D-Log M LUT 感觉高光泛白的终极解决诀窍',
                'content' => '大家好！我在正午沙滩用 D-Log M 拍摄了 10-bit 4K 24fps 视频，后期导入 DaVinci 套用大疆官方 LUT \'DJI_Pocket_3_DLogM_to_Rec709\'，总感觉高光沙子一截一片死白、天空中有一层灰蒙蒙的雾，这是为什么呢？有什么好的直出参数微调方法？',
                'likes' => 42,
                'views' => 310,
                'tags' => ['色彩模式', '减光镜', '进阶级'],
                'pinned' => true,
                'created_at' => Carbon::now()->subDays(5),
                'answers' => [
                    [
                        'author' => '老刘的折腾录像机',
                        'content' => '这是最典型的\'快门打架\'和\'进光溢出\'。大疆 Pocket 3 光圈是固定的 F2.0（极大），日照下为了维持 1/50s 电影快门，必须在外面磁吸套上 ND16 甚至 ND64 物理偏振镜，把过度照度过滤下来。如果你不带防光镜、纯靠拉高快门到 1/1600s 甚至 1/4000s 来压暗，就会丢失 D-Log M 应有的动态柔和，导致高光截断。带上磁吸 ND64 再测一次，成片高光一瞬间就极其圆融！',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subDays(4),
                    ],
                    [
                        'author' => 'Vlog单兵后期',
                        'content' => '如果已经拍完回来了：可以在剪辑软件（如 Premiere/DaVinci）的色轮面板中，将高光(Gain)微降 4%，暗部(Lift)微降 1.5%，色温向蓝绿微调 150K。这样大疆的 1-英寸大底的 10-bit 阴影阶层就会被舒展拉低，天空的死白处就会变成极其好看、温润的电影天蓝色！',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subDays(3),
                    ],
                ],
            ],
            [
                'author' => 'Vlogger小白兔',
                'avatar_color' => 'bg-emerald-600',
                'title' => '关于 DJI Mic 2 无线麦克风直接蓝牙连 Pocket 3 还是用适配器的纠结',
                'content' => '新入了 Pocket 3 全能套，送了一个极漂亮的透明粉 Mic 2。我平时喜欢拍吃播和逛街日常，请问是直接把 Mic 2 开蓝牙配对 Pocket 3 机身（没外挂），还是要把大疆的接收器（RX）插在机身底部 C 口？听说可以省掉插尾，但音效、连接距离和 32-bit 浮点内录有折扣吗？',
                'likes' => 28,
                'views' => 195,
                'tags' => ['DJI麦', '单兵音频', '音质调节'],
                'pinned' => false,
                'created_at' => Carbon::now()->subDays(2),
                'answers' => [
                    [
                        'author' => '自媒体避坑指南',
                        'content' => '绝对推荐直接【机身蓝牙互联】！蓝牙直连的声音已经经过了高规格 3.0 音频压缩还原，人声频带非常清脆饱满。直接连最大的优势就是：机身底部超级清爽、不增加重量配重，你可以装卸各种快装板与三脚支架，并且不遮挡机身发热口。蓝牙唯一的局限性是传输距离大约为 50 米，但单兵 Vlog 极少会离相机超过 5 米开外！',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subDays(1),
                    ],
                    [
                        'author' => '户外声音监察员',
                        'content' => '补充一点：用蓝牙直连时，如果您依然想触发 32-bit 浮点备用轨道，只需要短按发射端 (Mic 2) 的侧边物理红点 REC 按钮。此时发射端绿灯常亮并有一个微弱红脉冲，就会在内置的 8GB 空间进行单独的高保真录音备份。后期声音破音、大笑也可以一键复原！户外拍摄强烈推荐蓝牙直连 + 外套防风黑色毛帽，滤除风暴杂音效果拔群。',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subHours(18),
                    ],
                ],
            ],
            [
                'author' => '露营老友记',
                'avatar_color' => 'bg-amber-600',
                'title' => '夜间篝火聚众，想拍高画质慢动作和人脸表情，云台和ISO应该怎么配置合适？',
                'content' => '今晚在川西露营，篝火亮起来的时候会和大家坐着唱歌弹古筝。光线非常硬，属于强逆光篝火配合黑漆漆的帐篷背景。如果要清晰记录大家聊天表情、火星飞上的动作：应该用 120 帧慢动作，还是开「低光视频」？云台模式该卡在 FPV 上吗？',
                'likes' => 35,
                'views' => 240,
                'tags' => ['夜间暗光', '云台增稳', '创意运动'],
                'pinned' => false,
                'created_at' => Carbon::now()->subDays(3),
                'answers' => [
                    [
                        'author' => '逆光风暴',
                        'content' => '千万别开 120 帧！因为 120 帧慢动作会强行把快门最低卡在实实在在的 1/240s。在没有强光灯辅助下，画面里只会显示篝火的火焰，人脸会是完全漆黑死翘翘的，底噪声也爆满。正确策略：使用普通录像模式，4K 30fps，D-Log 模式关掉，开启自动对焦。然后用摇杆限死 ISO 最大在 1600 档，对人脸双击锁定。或者直接选择\'低光视频\'模式，人像面部自带阴影提亮效果，火花升腾用后期 40% 的速度减慢一点点即可！',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subDays(2),
                    ],
                ],
            ],
            [
                'author' => '帧帧废片',
                'avatar_color' => 'bg-violet-600',
                'title' => '夜景直出选 Normal 10-bit 还是 D-Log M？实测对比来了',
                'content' => '最近在小红书和抖音上看到两种截然不同的夜景参数流派：一派说"普通10-bit直出就超美"，另一派坚持"D-Log M容错率拉满"。我昨晚在南京路步行街同时用两种模式拍了一组对比，发现结论比想象中复杂。光线均匀的霓虹街景，Normal 10-bit直出确实色彩饱满省事；但遇到强逆光灯牌+暗巷并存的场景，D-Log M后期拉暗部的空间明显更大。大家平时夜景用哪种？',
                'likes' => 56,
                'views' => 420,
                'tags' => ['色彩模式', '夜景拍摄', '参数对比'],
                'pinned' => false,
                'created_at' => Carbon::now()->subDays(1),
                'answers' => [
                    [
                        'author' => '鱼总好多宝',
                        'content' => '我的经验是看场景：阴雨天或弱光环境果断D-Log M，容错率拉满，高光不炸、暗部不死黑，留给后期超大调整空间。光线好的城市夜景用Normal 10-bit就行，省得后期调色。关键是：夜景开D-Log M千万别强行提亮，会引入红绿噪点！如果不确定，就用"低光视频模式"配合ISO上限1600保底子纯净。',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subHours(20),
                    ],
                    [
                        'author' => '西瓜玩摄影',
                        'content' => '不用D-Log M，普通10-bit直出就超美！关键是白平衡要手动锁好，我一般设5000K，曝光压-0.7到-1.0EV保留灯光轮廓，锐度+7去雾感。后期最多微调对比度+5、高光-10就完事了。D-Log M那个灰片调不好反而更丑，新手不建议碰。',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subHours(14),
                    ],
                ],
            ],
            [
                'author' => '强哥的数码笔记',
                'avatar_color' => 'bg-blue-600',
                'title' => '希区柯克变焦到底怎么拍？我试了十几次终于搞明白了',
                'content' => '看了好多教程说Pocket 3能拍希区柯克变焦，但自己试了十几次要么后退速度不匀、要么变焦太突兀。后来发现关键在于：摇杆变焦速度必须调到最慢（设置里调1），然后后退步伐要像走钢丝一样匀速。另外4K 60fps后期放慢到24fps，画面会丝滑很多。分享我的完整参数设置和操作步骤，希望帮到同样在练这个手法的朋友。',
                'likes' => 73,
                'views' => 580,
                'tags' => ['创意运镜', '希区柯克', '参数设置'],
                'pinned' => false,
                'created_at' => Carbon::now()->subHours(18),
                'answers' => [
                    [
                        'author' => '幻想故事大全',
                        'content' => '补充一个技巧：开启俯仰锁定后再开始后退，这样镜头上下角度固定不会飘。后退时身体重心微微前倾，脚步小而密，就像慢动作走路。变焦用右手拇指缓慢推摇杆，从1.0x到2.0x大约花3-4秒。后期在剪辑软件里对两侧画幅作10%裁剪，能模拟物理级镜头的拉伸残影效果更真实。',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subHours(12),
                    ],
                ],
            ],
            [
                'author' => '冷白皮研究所',
                'avatar_color' => 'bg-pink-500',
                'title' => 'Pocket 3拍人像白平衡到底设多少K？4700K实测对比AWB',
                'content' => '网上很多人说拍人像白平衡手动设4700K皮肤最白皙，但我实测发现4700K在暖光室内会偏蓝发灰，在自然光下确实通透。我的结论是：室外自然光4700K没问题，室内暖光环境建议5000K-5300K，或者干脆用AWB然后后期微调色温-15。另外曝光+0.3EV提亮面部效果比单纯降色温更自然。大家有什么更好的白平衡设置心得吗？',
                'likes' => 45,
                'views' => 340,
                'tags' => ['人像拍摄', '白平衡', '参数调优'],
                'pinned' => false,
                'created_at' => Carbon::now()->subHours(8),
                'answers' => [
                    [
                        'author' => '暖阳',
                        'content' => '建议避免使用自动白平衡拍摄人像，手动调整至4300K左右皮肤表现更白皙气色更好。但你说得对，暖光环境4700K确实偏冷，我一般室内用5000K手动+0.3EV，关闭美颜保留皮肤纹理，后期再微调。关键是白平衡一定要锁定，不然画面会随光线变化出现色温漂移。',
                        'is_official' => false,
                        'created_at' => Carbon::now()->subHours(5),
                    ],
                ],
            ],
        ];

        foreach ($posts as $postData) {
            $answers = $postData['answers'] ?? [];
            unset($postData['answers']);

            $post = CommunityPost::create($postData);

            foreach ($answers as $answer) {
                Answer::create([
                    'community_post_id' => $post->id,
                    'author' => $answer['author'],
                    'content' => $answer['content'],
                    'is_official' => $answer['is_official'],
                    'created_at' => $answer['created_at'],
                ]);
            }
        }
    }
}
