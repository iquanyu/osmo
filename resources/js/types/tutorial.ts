import type { PaginatedData } from './ui';

export interface TutorialSettings {
    resolution: string;
    colorProfile: string;
    gimbalMode: string;
    ndFilter: string;
}

export interface TutorialListItem {
    id: number;
    category: TutorialArticle['category'];
    title: string;
    summary: string;
    difficulty: TutorialArticle['difficulty'];
    duration: string;
    image: string;
    is_featured: boolean;
    settings: Pick<TutorialSettings, 'resolution' | 'colorProfile'>;
}

export interface TutorialDetail extends TutorialListItem {
    settings: TutorialSettings;
    steps: string[];
    tips: string[];
}

export interface TutorialArticle {
    id: number;
    category: 'beginner' | 'cinematic' | 'night' | 'vlog' | 'creative';
    title: string;
    summary: string;
    difficulty: '新手' | '进阶' | '大师';
    duration: string;
    steps: string[];
    tips: string[];
    settings: TutorialSettings;
    image: string;
    status: 'draft' | 'published';
    sort_order: number;
    is_featured: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export type TutorialCategory = TutorialArticle['category'];
export type TutorialDifficulty = TutorialArticle['difficulty'];
export type TutorialStatus = TutorialArticle['status'];
export type TutorialCategoryFilter = 'all' | TutorialCategory;
export type TutorialDifficultyFilter = 'all' | TutorialDifficulty;
export type TutorialStatusFilter = 'all' | TutorialStatus;
export type TutorialFeaturedFilter = 'all' | 'yes' | 'no';

export interface CreatorPreset {
    platform: string;
    resolution: string;
    fps: string;
    color: string;
    gimbal: string;
    audio: string;
    lightingCondition: string;
    extraTips: string;
    simulatorSettings?: {
        resolution: string;
        colorProfile: string;
        applyLut: boolean;
        shutterSpeed: string;
        iso: number;
        ndFilter: string;
        gimbalMode: string;
    };
}

export interface PocketSpec {
    feature: string;
    value: string;
    tip: string;
}

export interface TutorialIndexFilters {
    category: string;
    q: string;
}

export interface TutorialIndexPageProps {
    tutorials: PaginatedData<TutorialListItem>;
    filters: TutorialIndexFilters;
}

export interface TutorialShowPageProps {
    tutorial: TutorialDetail;
}
