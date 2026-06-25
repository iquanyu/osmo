<?php

namespace App\Services;

class AssistantService
{
    public function getSuggestion(string $scenario): array
    {
        $sc = mb_strtolower($scenario);

        if ($this->matchAny($sc, ['海边', '沙滩', '风大', '浪'])) {
            return $this->beachPreset();
        }

        if ($this->matchAny($sc, ['落日', '车轨', '延时', '傍晚', '时间'])) {
            return $this->sunsetPreset();
        }

        if ($this->matchAny($sc, ['夜景', '暗光', '昏暗', '晚上', '霓虹'])) {
            return $this->nightPreset();
        }

        if ($this->matchAny($sc, ['咖啡', '室内', '特写', '微距'])) {
            return $this->indoorPreset();
        }

        return $this->defaultPreset();
    }

    private function matchAny(string $scenario, array $keywords): bool
    {
        foreach ($keywords as $keyword) {
            if (mb_strpos($scenario, mb_strtolower($keyword)) !== false) {
                return true;
            }
        }

        return false;
    }

    private function beachPreset(): array
    {
        return [
            'objective' => '大风强光海滨 Vlog 降噪抗过曝方案',
            'settings' => [
                'resolution' => '4K 30fps / 16:9',
                'colorProfile' => 'D-Log M (10-bit)',
                'exposureMode' => 'Manual (M档)',
                'shutterSpeed' => '1/60 或 1/50 锁焦',
                'isoRange' => 'ISO 100 - 200 (压紧颗粒感)',
                'gimbalMode' => '跟随 (Follow) + 开启人脸贴合追踪 ActiveTrack 6.0',
            ],
            'ndFilter' => '强力推荐磁吸物理【ND16】或【ND64】偏振镜。在烈日下防止白沙和海水高亮反光溢出，守住 10-bit 高动态质感。',
            'audioSetup' => 'DJI Mic 2 领夹麦发射端蓝牙直连，务必顺时针卡死「防风毛罩」。同时在 Pocket 3 机内设置中将\'音频增益\'拉低至 -3dB，智能降噪声门(Active Noise Reduction)设为全开，彻底隔绝呼啸风声。',
            'creativeTips' => [
                '双击屏幕开启主角追踪居中。拉远距离，借用海滨植物树叶做前侧的前景，做 30 度侧移推拉镜头，营造通透的海边电影层次感。',
                '海浪拍打沙滩瞬间，利用 4K 60fps 升格，能看到浪花极其舒缓、细腻且剔透的落沙景象。',
            ],
            'explanation' => '【AI - 本地预设】针对海水高亮和强风做的特调。由于正午海面反射极强，如果不装配 ND 镜强行缩快门到 1/2000s 会丧失电影残影并让暗部呈现可怕的红噪；麦克风卡死毛刷防噪和抑制增益则能保证水晶般清亮人声。',
        ];
    }

    private function sunsetPreset(): array
    {
        return [
            'objective' => '红霞落日与繁忙十字路口车轨慢门延时方案',
            'settings' => [
                'resolution' => '4k UHD (轨道延时 / Motionlapse)',
                'colorProfile' => 'Normal 10-bit HLG (直出通透大亮部)',
                'exposureMode' => 'Auto 配合【曝光补偿 (EV) 调至 -0.7】',
                'shutterSpeed' => '延时快门 1/2 秒以上 (单片延时取样间隔 2 秒)',
                'isoRange' => 'ISO 100 - 400 (锁死低底噪声)',
                'gimbalMode' => '智能轨迹延时云台 (选择左至右逆向 90 度旋转航向)',
            ],
            'ndFilter' => '落日降至楼宇后时建议不加物理滤镜以保留微光照度。日落前霞光四放时，加挂【ND8】或【ND16】可以获得绵密的车辆拉丝光轨。',
            'audioSetup' => '关闭 DJI Mic 2，仅开启机身微型三向全向全景麦克风，录制马路极其低沉温润的隆隆环境声浪即可。',
            'creativeTips' => [
                '使用全能套装内的微型延长三脚架牢固卡在过街天桥栏杆上（或使用软胶绑在雕花上），严禁手持摇晃。',
                '在 DJI Mimo App 中设置 4 个打点路径，轨迹从近端桥墩缓慢横移偏摆至远方橙红色的夕阳焦点，形成极其宏伟、有空气感的时空漂移。',
            ],
            'explanation' => '【AI - 本地预设】这套方案用 HLG 能够很好对付落日火红和车辆白色大灯之间极大的照度反差；手动曝光补偿(EV -0.7)能防止车灯扫过时测光泵频跳，留住壮丽的渐变红霞。',
        ];
    }

    private function nightPreset(): array
    {
        return [
            'objective' => '极夜街坊/赛博霓虹街头漫步夜拍防抖极清优化',
            'settings' => [
                'resolution' => '4K 30fps (低光视频特制算法状态)',
                'colorProfile' => '机内低光降噪特制 Normal (极爽朗暗处调校)',
                'exposureMode' => '快门固定在 1/50s 或 M档自动',
                'shutterSpeed' => '1/50s',
                'isoRange' => 'ISO 最大限锁定在 1600 或 3200 (杜绝 6400 的高底噪彩噪)',
                'gimbalMode' => 'FPV 模式 (适合跟随霓虹转场)',
            ],
            'ndFilter' => '完全不需要挂载任何 ND 镜片，裸装 Pocket f/2.0 物理超大镜头，保证最大受光照度。',
            'audioSetup' => '蓝牙直连 DJI Mic 2，将发射端夹在衣服内衬防止衣物摩擦杂音，获得饱满温暖的夜间漫步私语环境人声。',
            'creativeTips' => [
                '侧面靠近发光的赛博朋克大字广告招牌，将彩色霓虹灯作为人脸修面光的 45 度顺角光源，肤色过渡极其水灵通透。',
                '单手手持，使用经典\'猫步小碎步\'行走，云台能自动完美过滤极暗微震导致的画面马赛克晕影。',
            ],
            'explanation' => '【AI - 本地预设】大疆 Pocket 3 的特有「低光视频」模式采用机内多帧硬件降噪算法。此模式限制了最高帧率为 30fps 并强行锁定在暗处强化的 Normal 色彩。配合限制 ISO 1600 档位，可以拍出媲美大型画幅电影机一般深邃的极黑纯净街区。',
        ];
    }

    private function indoorPreset(): array
    {
        return [
            'objective' => '室内暖光咖啡屋拉花/餐盘细腻微虚化特写',
            'settings' => [
                'resolution' => '4K 60fps (大底动作润化升格)',
                'colorProfile' => 'Normal 8-bit (让糕点呈现极致油润食欲)',
                'exposureMode' => '自动档 锁住中间对焦点',
                'shutterSpeed' => '1/120s 极度动作顺滑限制',
                'isoRange' => 'ISO 100 - 800 (平流画幅控制)',
                'gimbalMode' => '俯仰锁定 (Tilt Locked) 模式',
            ],
            'ndFilter' => '无需加物理滤镜。如果不小心距离咖啡杯太近对不准，建议装配上原厂【磁吸10倍微距附加镜】放大杯面拉花拉丝。',
            'audioSetup' => '将无线麦克风 Mic 2 直接放置在陶瓷杯盘子旁边 10 厘米处。每一次杯子砸在碟子上的轻轻卡啦敲击声、磨豆机倾倒声、咖啡液体划过的沙沙高频声都能获得满分的解压ASMR保真度！',
            'creativeTips' => [
                '起跑点先从极近处 10 厘米焦平面外开始，按下录制后，云台机身极平稳地拉离咖啡杯并向上微摇，让焦距慢慢回最清晰，拍出惊艳的艺术解密镜头。',
                '利用 60 帧对牛奶慢慢倒入黑卡布奇诺的一刻做后期 2.5 倍慢速，能极为舒适地捕捉香气白雾扩散的美轮美奂动作。',
            ],
            'explanation' => '【AI - 本地预设】大底 1 英寸在微距下有天然、物理性质的光学背景虚化(Bokeh)，不需要任何手机算法修补。60fps 慢动作是让一切烟雾、水滴具有舒缓\'静谧流淌感\'最实在的良方。',
        ];
    }

    private function defaultPreset(): array
    {
        return [
            'objective' => '全适配高敏捷创作者百搭视频通解方案',
            'settings' => [
                'resolution' => '4K 30fps (高精细度影视剪切标准)',
                'colorProfile' => 'D-Log M (10-bit 提供最棒色彩空间度)',
                'exposureMode' => 'Auto 档 (EV 曝光微压 -0.3)',
                'shutterSpeed' => 'Auto / 自动',
                'isoRange' => 'ISO 100 - 1600 (动态抗干扰底噪点分流)',
                'gimbalMode' => '智能跟随 ActiveTrack',
            ],
            'ndFilter' => '多云或室内晴朗天气请选【None】不扣镜。阳光灿烂日暴晒时套【ND16】一键降低半档照度。',
            'audioSetup' => 'DJI Mic 2 极速蓝牙直连，声音增益建议在机身总览菜单里面校配到 -3dB，保留极致自然的声音泛音细节。',
            'creativeTips' => [
                '善用 Pocket 3 可旋转2.0寸的屏幕。大拇指从屏幕顶部往下滑，进入设置打开高级对焦点，设定主角追踪，不管左右怎么摇摆都是高规格巨作。',
                '走路时尽量减少胳膊肘的剧烈摇晃，利用膝盖微弯配合物理惯性走平衡路线，能将 3 轴微型力矩电机平滑效果推向 100% 极限物理效果。',
            ],
            'explanation' => '【AI - 本地预设】当前题材方案根据 Pocket 3 经典的 1 英寸底配置而成。30帧可以在绝大部分软件顺滑渲染：D-Log M 保护了高光天空不爆白、暗色森林包含暗影细节；配合 -0.3EV 抑制直晒，是单兵创作者最稳定的常青白金设置。',
        ];
    }
}
