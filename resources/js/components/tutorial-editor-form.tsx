import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CoverImageField } from '@/components/cover-image-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminTutorialActions } from '@/hooks/use-admin-tutorial-actions';
import {
    tutorialCategoryOptions,
    tutorialDifficultyOptions,
} from '@/lib/tutorial-meta';
import type { TutorialArticle } from '@/types';

type TutorialFormData = {
    category: TutorialArticle['category'];
    title: string;
    summary: string;
    difficulty: TutorialArticle['difficulty'];
    duration: string;
    steps: string[];
    tips: string[];
    settings: TutorialArticle['settings'];
    image: string;
    status: TutorialArticle['status'];
    sort_order: number;
    is_featured: boolean;
};

type TutorialFormErrors = Partial<
    Record<
        | keyof TutorialFormData
        | 'steps.0'
        | 'tips.0'
        | 'settings.resolution'
        | 'settings.colorProfile'
        | 'settings.gimbalMode'
        | 'settings.ndFilter'
        | 'cover_image',
        string
    >
>;

const defaultImage =
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';

const defaultFormData: TutorialFormData = {
    category: 'beginner',
    title: '',
    summary: '',
    difficulty: '新手',
    duration: '5 分钟',
    steps: [''],
    tips: [''],
    settings: {
        resolution: '4K 30fps',
        colorProfile: 'Normal 8-bit',
        gimbalMode: '跟随 (Follow)',
        ndFilter: '无',
    },
    image: defaultImage,
    status: 'published',
    sort_order: 0,
    is_featured: false,
};

export function TutorialEditorForm({
    tutorial,
}: {
    tutorial?: TutorialArticle | null;
}) {
    const tutorialActions = useAdminTutorialActions();
    const initialData = useMemo<TutorialFormData>(
        () =>
            tutorial
                ? {
                      category: tutorial.category,
                      title: tutorial.title,
                      summary: tutorial.summary,
                      difficulty: tutorial.difficulty,
                      duration: tutorial.duration,
                      steps:
                          tutorial.steps.length > 0 ? tutorial.steps : [''],
                      tips: tutorial.tips.length > 0 ? tutorial.tips : [''],
                      settings: tutorial.settings,
                      image: tutorial.image,
                      status: tutorial.status,
                      sort_order: tutorial.sort_order,
                      is_featured: tutorial.is_featured,
                  }
                : defaultFormData,
        [tutorial],
    );

    const [data, setData] = useState<TutorialFormData>(initialData);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<TutorialFormErrors>({});
    const [processing, setProcessing] = useState(false);

    const isEditing = Boolean(tutorial);

    const updateField = <K extends keyof TutorialFormData>(
        key: K,
        value: TutorialFormData[K],
    ) => {
        setData((current) => ({ ...current, [key]: value }));
    };

    const updateSettingsField = (
        key: keyof TutorialFormData['settings'],
        value: string,
    ) => {
        setData((current) => ({
            ...current,
            settings: {
                ...current.settings,
                [key]: value,
            },
        }));
    };

    const updateArrayField = (
        key: 'steps' | 'tips',
        index: number,
        value: string,
    ) => {
        setData((current) => ({
            ...current,
            [key]: current[key].map((item, itemIndex) =>
                itemIndex === index ? value : item,
            ),
        }));
    };

    const addArrayField = (key: 'steps' | 'tips') => {
        setData((current) => ({
            ...current,
            [key]: [...current[key], ''],
        }));
    };

    const removeArrayField = (key: 'steps' | 'tips', index: number) => {
        setData((current) => {
            const next = current[key].filter((_, itemIndex) => itemIndex !== index);

            return {
                ...current,
                [key]: next.length > 0 ? next : [''],
            };
        });
    };

    const handleSubmit = () => {
        setProcessing(true);
        setErrors({});

        const payload = {
            ...data,
            title: data.title.trim(),
            summary: data.summary.trim(),
            duration: data.duration.trim(),
            image: coverFile ? '' : data.image.trim(),
            cover_image: coverFile,
            status: data.status,
            sort_order: data.sort_order,
            is_featured: data.is_featured,
            steps: data.steps.map((step) => step.trim()).filter(Boolean),
            tips: data.tips.map((tip) => tip.trim()).filter(Boolean),
            settings: {
                resolution: data.settings.resolution.trim(),
                colorProfile: data.settings.colorProfile.trim(),
                gimbalMode: data.settings.gimbalMode.trim(),
                ndFilter: data.settings.ndFilter.trim(),
            },
        };

        const requestOptions = {
            preserveScroll: true,
            forceFormData: Boolean(coverFile),
            onError: (formErrors: TutorialFormErrors) => setErrors(formErrors),
            onFinish: () => setProcessing(false),
            onSuccess: () => setCoverFile(null),
        };

        if (isEditing && tutorial) {
            tutorialActions.saveTutorial(
                tutorial.id,
                payload,
                requestOptions,
            );

            return;
        }

        tutorialActions.createTutorial(payload, requestOptions);
    };

    return (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-base">基础信息</CardTitle>
                        <CardDescription>
                            设置教程分类、标题、摘要和封面
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="category">分类</Label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) =>
                                        updateField(
                                            'category',
                                            e.target.value as TutorialArticle['category'],
                                        )
                                    }
                                    className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                                >
                                    {tutorialCategoryOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="difficulty">难度</Label>
                                <select
                                    id="difficulty"
                                    value={data.difficulty}
                                    onChange={(e) =>
                                        updateField(
                                            'difficulty',
                                            e.target.value as TutorialArticle['difficulty'],
                                        )
                                    }
                                    className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                                >
                                    {tutorialDifficultyOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.difficulty} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">标题</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    updateField('title', e.target.value)
                                }
                                placeholder="例如：Pocket 3 夜景纯净画面设置"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="summary">摘要</Label>
                            <textarea
                                id="summary"
                                value={data.summary}
                                onChange={(e) =>
                                    updateField('summary', e.target.value)
                                }
                                rows={5}
                                placeholder="简要说明这篇教程适合谁、解决什么问题"
                                className="w-full rounded-md border border-border bg-background p-3 text-sm"
                            />
                            <InputError message={errors.summary} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="status">发布状态</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        updateField(
                                            'status',
                                            e.target.value as TutorialArticle['status'],
                                        )
                                    }
                                    className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                                >
                                    <option value="published">已发布</option>
                                    <option value="draft">草稿</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sort_order">排序值</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        updateField(
                                            'sort_order',
                                            Number(e.target.value || 0),
                                        )
                                    }
                                    placeholder="越大越靠前"
                                />
                                <InputError message={errors.sort_order} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="duration">推荐时长</Label>
                                <Input
                                    id="duration"
                                    value={data.duration}
                                    onChange={(e) =>
                                        updateField('duration', e.target.value)
                                    }
                                    placeholder="例如：5 分钟"
                                />
                                <InputError message={errors.duration} />
                            </div>
                        </div>

                        <CoverImageField
                            url={data.image}
                            file={coverFile}
                            onUrlChange={(url) => updateField('image', url)}
                            onFileChange={setCoverFile}
                            urlError={errors.image}
                            fileError={errors.cover_image}
                            previewAlt={data.title || '教程封面预览'}
                        />
                        <label className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) =>
                                    updateField('is_featured', e.target.checked)
                                }
                            />
                            设为推荐教程
                        </label>
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-base">参数设置</CardTitle>
                        <CardDescription>
                            对应教程内展示的关键推荐参数
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="resolution">分辨率</Label>
                            <Input
                                id="resolution"
                                value={data.settings.resolution}
                                onChange={(e) =>
                                    updateSettingsField('resolution', e.target.value)
                                }
                            />
                            <InputError message={errors['settings.resolution']} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="colorProfile">色彩配置</Label>
                            <Input
                                id="colorProfile"
                                value={data.settings.colorProfile}
                                onChange={(e) =>
                                    updateSettingsField('colorProfile', e.target.value)
                                }
                            />
                            <InputError message={errors['settings.colorProfile']} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gimbalMode">云台模式</Label>
                            <Input
                                id="gimbalMode"
                                value={data.settings.gimbalMode}
                                onChange={(e) =>
                                    updateSettingsField('gimbalMode', e.target.value)
                                }
                            />
                            <InputError message={errors['settings.gimbalMode']} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ndFilter">ND/滤镜</Label>
                            <Input
                                id="ndFilter"
                                value={data.settings.ndFilter}
                                onChange={(e) =>
                                    updateSettingsField('ndFilter', e.target.value)
                                }
                            />
                            <InputError message={errors['settings.ndFilter']} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-base">拍摄步骤</CardTitle>
                        <CardDescription>
                            至少保留一条有效步骤，展示实际操作流程
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.steps.map((step, index) => (
                            <div key={`step-${index}`} className="flex gap-2">
                                <Input
                                    value={step}
                                    onChange={(e) =>
                                        updateArrayField('steps', index, e.target.value)
                                    }
                                    placeholder={`步骤 ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeArrayField('steps', index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <InputError message={errors.steps || errors['steps.0']} />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayField('steps')}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            添加步骤
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-base">补充技巧</CardTitle>
                        <CardDescription>
                            可填写调色建议、避坑提示或补充说明
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.tips.map((tip, index) => (
                            <div key={`tip-${index}`} className="flex gap-2">
                                <Input
                                    value={tip}
                                    onChange={(e) =>
                                        updateArrayField('tips', index, e.target.value)
                                    }
                                    placeholder={`技巧 ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeArrayField('tips', index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <InputError message={errors.tips || errors['tips.0']} />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayField('tips')}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            添加技巧
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <Card className="sticky top-20 border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-base">操作</CardTitle>
                        <CardDescription>
                            保存后将返回教程管理列表
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            {processing
                                ? '保存中...'
                                : isEditing
                                  ? '保存修改'
                                  : '创建教程'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => tutorialActions.visitList()}
                        >
                            返回列表
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-base">预览</CardTitle>
                        <CardDescription>实时查看列表卡片样式</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="overflow-hidden rounded-xl border">
                            <div className="relative h-40">
                                <img
                                    src={data.image || defaultImage}
                                    alt={data.title || '教程封面'}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-3 right-3 rounded-full bg-red-600 px-2 py-1 text-[10px] font-medium text-white">
                                    {data.difficulty}
                                </div>
                            </div>
                            <div className="space-y-2 p-4">
                                <div className="text-xs text-muted-foreground">
                                    {data.category} · {data.duration} ·{' '}
                                    {data.status === 'published'
                                        ? '已发布'
                                        : '草稿'}
                                </div>
                                <div className="text-sm font-semibold">
                                    {data.title || '未填写教程标题'}
                                </div>
                                <p className="line-clamp-3 text-xs text-muted-foreground">
                                    {data.summary || '这里会显示教程摘要预览。'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
