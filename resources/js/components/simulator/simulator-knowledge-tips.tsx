import { Award, CheckCircle2, Smartphone } from 'lucide-react';

export function SimulatorKnowledgeTips() {
    return (
        <section className="mt-12 grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-3">
            <div>
                <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Award className="h-4 w-4 text-red-500" />
                    关于 D-Log M (10-bit)
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    大疆 Pocket 3 能通过 10-bit 全宽色彩记录，提供宽大后期宽容量，避免大色差天空产生难看的色阶"台阶"断层。本站内置大疆官方
                    LUT，您可以使用上方模拟器测试。
                </p>
            </div>
            <div>
                <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-red-500" />
                    什么是 180度快门法则
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    若电影采用 24fps 摄制，最流畅的快门时间即为 1/50s。若正午曝光溢出，切忌拉快快门，正确的做法是安装大疆磁吸
                    ND16/ND64 滤镜让曝光回正常区域。
                </p>
            </div>
            <div>
                <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Smartphone className="h-4 w-4 text-red-500" />
                    横竖触控操作
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    2.0" 旋转屏向右偏转即自开手机宽画幅；滑动机身屏幕，左扫媒体库、右扫曝光锁定、上扫云台校准、下扫系统总参控制。一键尽在掌握。
                </p>
            </div>
        </section>
    );
}
