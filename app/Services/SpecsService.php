<?php

namespace App\Services;

class SpecsService
{
    /**
     * @return list<array<string, mixed>>
     */
    public function getRecordingProfiles(): array
    {
        return $this->getCreatorPresets();
    }

    public function getCreatorPresets(): array
    {
        return [
            [
                'platform' => 'Bilibili/YouTube',
                'resolution' => '4K (16:9)',
                'fps' => '24fps 或 30fps',
                'color' => 'D-Log M (10-bit)',
                'gimbal' => '智能跟随 / 俯仰锁定',
                'audio' => 'DJI Mic 2 单声道 24kHz',
                'lightingCondition' => '影棚/日间室外',
                'extraTips' => '后期导入大疆官方 Rec.709 LUT，高光处微微下拉 5% 曲线可恢复极高通透度。',
                'simulatorSettings' => [
                    'resolution' => '4K 24fps',
                    'colorProfile' => 'D-Log M',
                    'applyLut' => true,
                    'shutterSpeed' => '1/50',
                    'iso' => 100,
                    'ndFilter' => 'ND16',
                    'gimbalMode' => 'Follow',
                ],
            ],
            [
                'platform' => '小红书/抖音',
                'resolution' => '3K (9:16) 竖屏直出',
                'fps' => '30fps 或 60fps',
                'color' => 'Normal 8-bit (机内美颜开至 30%)',
                'gimbal' => '主角居中 / 增稳模式',
                'audio' => '机身全向麦克风 (风噪抑制低)',
                'lightingCondition' => '街头探店/室内人像',
                'extraTips' => '直接物理旋转屏幕到竖拍状态，机内内置的美颜算法能自动追踪面部提供润色，省去繁琐的前期调试。',
                'simulatorSettings' => [
                    'resolution' => '4K 60fps',
                    'colorProfile' => 'Normal 8-bit',
                    'applyLut' => false,
                    'shutterSpeed' => 'Auto',
                    'iso' => 400,
                    'ndFilter' => 'None',
                    'gimbalMode' => 'Follow',
                ],
            ],
            [
                'platform' => '日常Vlog纪录',
                'resolution' => '1085p (16:9)',
                'fps' => '60fps',
                'color' => 'Normal 或 HLG (10-bit)',
                'gimbal' => '智能跟随 + 自动对焦 (AF-C)',
                'audio' => 'DJI Mic 2 开启一键机身内置降噪',
                'lightingCondition' => '光线急剧变化室外',
                'extraTips' => '60fps 能够极度顺滑地捕捉行走的颠簸，后期如果需要对精彩镜头打补丁，还可以进行 2 倍无损慢动作剪辑。',
                'simulatorSettings' => [
                    'resolution' => '4K 60fps',
                    'colorProfile' => 'HLG',
                    'applyLut' => false,
                    'shutterSpeed' => '1/120',
                    'iso' => 400,
                    'ndFilter' => 'None',
                    'gimbalMode' => 'Follow',
                ],
            ],
            [
                'platform' => '极致电影短片',
                'resolution' => '4K (16:9) 裁切 2.4:1',
                'fps' => '24fps 电影帧',
                'color' => 'D-Log M 并锁死 ISO 100/200',
                'gimbal' => '俯仰锁定 + 手动十字方向摇杆',
                'audio' => '外接双声道立体声麦克风组',
                'lightingCondition' => '落日余晖/电影剧组制灯',
                'extraTips' => '强光下配合磁吸 ND64 减光镜，牢卡1/50秒快门速度。后期在达芬奇软件中对暗部进行青蓝色调偏置，高光微微泛暖，即可直出2.0大片感。',
                'simulatorSettings' => [
                    'resolution' => '4K 24fps',
                    'colorProfile' => 'D-Log M',
                    'applyLut' => true,
                    'shutterSpeed' => '1/50',
                    'iso' => 100,
                    'ndFilter' => 'ND64',
                    'gimbalMode' => 'Locked',
                ],
            ],
        ];
    }

    public function getGeneralSpecs(): array
    {
        return [
            [
                'feature' => '传感器规格',
                'value' => '1 英寸 CMOS 极其强悍',
                'tip' => '感光面积大约是 Pocket 2 的四倍！夜景纯度与背景自然浅景深（光学虚化）秒杀普通手机。',
            ],
            [
                'feature' => '镜头焦距 & 光圈',
                'value' => '20mm 等效焦距 / F2.0 大光圈',
                'tip' => '视角极宽，超适合手持单人自拍，容纳背景广阔；大光圈进光量十足，保证暗光纯净度。',
            ],
            [
                'feature' => '色彩深度',
                'value' => 'D-Log M & HLG 10-bit 色彩',
                'tip' => '涵盖 10.7 亿种色彩，是大自然色彩平滑渐变的物理基石；高宽容度支持极为极端的色彩后期重塑。',
            ],
            [
                'feature' => '无线麦收音',
                'value' => '支持直接蓝牙直连 DJI Mic 2 发射器',
                'tip' => '无需再插尾部适配器接收器！完美支持 32-bit 浮点安全轨内录，防止突然大叫发生破音。',
            ],
            [
                'feature' => '屏幕转轴',
                'value' => '2.0 英寸 OLED 炫彩可旋转全面屏',
                'tip' => '支持\'转屏开机\'、\'转屏关机\'。横置对应 16:9 画幅，横竖拍无缝瞬切。',
            ],
        ];
    }

    /**
     * @return list<array<string, string>>
     */
    public function getCuratedAccessories(): array
    {
        return [
            [
                'name' => '磁吸 ND 套装',
                'category' => '滤镜',
                'recommendation' => '推荐',
                'reason' => '覆盖 ND16 / ND32 / ND64，最适合白天 24/30fps 外拍。',
            ],
            [
                'name' => 'DJI Mic 2',
                'category' => '收音',
                'recommendation' => '推荐',
                'reason' => '和 Pocket 3 直连顺手，Vlog 与采访场景收益非常高。',
            ],
            [
                'name' => '迷你三脚架',
                'category' => '支撑',
                'recommendation' => '推荐',
                'reason' => '桌拍、定机位口播、延时都实用，性价比高。',
            ],
            [
                'name' => '超重手机夹拓展',
                'category' => '拓展',
                'recommendation' => '谨慎',
                'reason' => '过重配件会影响手持平衡与稳定性，不适合长时间使用。',
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function getAccessoryCommunityPosts(): array
    {
        return [
            [
                'title' => '白天海边拍摄，ND16 还是 ND32 更稳？',
                'tag' => '滤镜',
                'summary' => '围绕 24fps 与 1/50 快门的实战讨论，适合先做参考。',
            ],
            [
                'title' => 'Mic 2 直连 Pocket 3 的增益怎么设？',
                'tag' => '收音',
                'summary' => '社区里关于爆音、底噪和防风毛套的经验比较集中。',
            ],
            [
                'title' => '轻便 Vlog 套装有哪些必带配件？',
                'tag' => '外拍',
                'summary' => '适合通勤、旅行、探店拍摄的低负担搭配思路。',
            ],
        ];
    }
}
