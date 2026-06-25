export type NdCalculatorReference = {
    label: string;
    description: string;
    href: string;
    source: string;
};

/** 计算器公式与设备假设所依据的公开资料（非本站原创标定）。 */
export const ND_CALCULATOR_REFERENCES: NdCalculatorReference[] = [
    {
        label: 'DJI Osmo Pocket 3 技术参数',
        description: '光圈 f/2.0、ISO 范围、帧率与录像规格',
        href: 'https://www.dji.com/cn/osmo-pocket-3/specs',
        source: 'DJI 官方',
    },
    {
        label: 'DJI Osmo Pocket 3 支持中心',
        description: '用户手册、固件说明与官方拍摄指引',
        href: 'https://www.dji.com/cn/support/product/osmo-pocket-3',
        source: 'DJI 官方',
    },
    {
        label: '曝光值（EV）',
        description: '场景亮度与光圈、快门、ISO 组合的通用定义',
        href: 'https://zh.wikipedia.org/wiki/%E6%9B%9D%E5%85%89%E5%80%BC',
        source: '摄影通用标准',
    },
    {
        label: '阳光 16 法则',
        description: '晴天户外曝光的经验参考，对应本工具「烈日」等场景预设',
        href: 'https://zh.wikipedia.org/wiki/%E9%98%B3%E5%85%8916%E6%B3%95%E5%88%99',
        source: '摄影经验法则',
    },
    {
        label: '减光镜（ND）',
        description: 'ND8 / ND16 等档位与减光档数的行业命名习惯',
        href: 'https://zh.wikipedia.org/wiki/%E5%87%8F%E5%85%89%E9%95%9C',
        source: '光学通用标准',
    },
    {
        label: '快门角与帧率',
        description: '180° 快门法则：快门时间 = 快门角 ÷ (360 × 帧率)',
        href: 'https://en.wikipedia.org/wiki/Shutter_speed#Shutter_angle',
        source: '影视制作通用标准',
    },
];
