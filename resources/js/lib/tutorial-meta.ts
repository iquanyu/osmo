import type {
    TutorialCategory,
    TutorialCategoryFilter,
    TutorialDifficulty,
    TutorialDifficultyFilter,
    TutorialFeaturedFilter,
    TutorialStatusFilter,
} from '@/types';

export interface TutorialMetaOption<T extends string = string> {
    value: T;
    label: string;
}

const tutorialCategoryLabels: Record<TutorialCategory, string> = {
    beginner: '新手指南',
    cinematic: '电影感色彩',
    night: '纯净夜景',
    vlog: '单兵音频Vlog',
    creative: '创意运镜',
};

const tutorialDifficultyLabels: Record<TutorialDifficulty, string> = {
    新手: '新手',
    进阶: '进阶',
    大师: '大师',
};

export const tutorialCategoryOptions: TutorialMetaOption<TutorialCategory>[] = (
    Object.entries(tutorialCategoryLabels) as Array<[TutorialCategory, string]>
).map(([value, label]) => ({ value, label }));

export const tutorialCategoryFilterOptions: TutorialMetaOption<TutorialCategoryFilter>[] = [
    { value: 'all', label: '全部教程' },
    ...tutorialCategoryOptions,
];

export const tutorialDifficultyOptions: TutorialMetaOption<TutorialDifficulty>[] = (
    Object.entries(tutorialDifficultyLabels) as Array<[TutorialDifficulty, string]>
).map(([value, label]) => ({ value, label }));

export const tutorialDifficultyFilterOptions: TutorialMetaOption<TutorialDifficultyFilter>[] = [
    { value: 'all', label: '全部级别' },
    ...tutorialDifficultyOptions,
];

export const tutorialStatusFilterOptions: TutorialMetaOption<TutorialStatusFilter>[] = [
    { value: 'all', label: '全部状态' },
    { value: 'published', label: '已发布' },
    { value: 'draft', label: '草稿' },
];

export const tutorialFeaturedFilterOptions: TutorialMetaOption<TutorialFeaturedFilter>[] = [
    { value: 'all', label: '全部推荐状态' },
    { value: 'yes', label: '仅推荐' },
    { value: 'no', label: '仅普通' },
];

export const defaultAdminTutorialFilters = {
    category: 'all',
    difficulty: 'all',
    status: 'all',
    featured: 'all',
} satisfies {
    category: TutorialCategoryFilter;
    difficulty: TutorialDifficultyFilter;
    status: TutorialStatusFilter;
    featured: TutorialFeaturedFilter;
};

export const adminTutorialQuickFilters: Array<{
    key: string;
    label: string;
    status?: TutorialStatusFilter;
    featured?: TutorialFeaturedFilter;
}> = [
    {
        key: 'all',
        label: '全部',
        status: 'all',
        featured: 'all',
    },
    {
        key: 'published',
        label: '已发布',
        status: 'published',
    },
    {
        key: 'draft',
        label: '草稿',
        status: 'draft',
    },
    {
        key: 'featured',
        label: '推荐',
        featured: 'yes',
    },
];

export function getTutorialCategoryLabel(
    category: TutorialCategory | string,
): string {
    return tutorialCategoryLabels[category as TutorialCategory] ?? category;
}

export function getTutorialDifficultyLabel(
    difficulty: TutorialDifficulty | string,
): string {
    return tutorialDifficultyLabels[difficulty as TutorialDifficulty] ?? difficulty;
}
