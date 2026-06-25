import type { CommunityPost, CommunitySort } from './community';
import type { AdminSubmissionStatusFilter, Submission } from './submission';
import type {
    TutorialArticle,
    TutorialCategoryFilter,
    TutorialDifficultyFilter,
    TutorialFeaturedFilter,
    TutorialStatusFilter,
} from './tutorial';
import type { PaginatedData } from './ui';

export interface AdminWeeklyTrendPoint {
    day: string;
    date: string;
    tutorials: number;
    submissions: number;
    communityPosts: number;
    reviews: number;
}

export interface AdminOverviewStats {
    tutorialCount: number;
    featuredTutorialCount: number;
    postCount: number;
    totalLikes: number;
    totalAnswers: number;
    pendingSubmissionCount: number;
}

export interface AdminOverviewPageProps {
    stats: AdminOverviewStats;
    recentTutorials: TutorialArticle[];
    recentPosts: Array<CommunityPost & { answers_count?: number }>;
    weeklyTrend: AdminWeeklyTrendPoint[];
    canResetDemoData: boolean;
}

export interface AdminTutorialFilters {
    search: string;
    category: TutorialCategoryFilter;
    difficulty: TutorialDifficultyFilter;
    status: TutorialStatusFilter;
    featured: TutorialFeaturedFilter;
}

export interface AdminTutorialStats {
    tutorialCount: number;
    publishedTutorialCount: number;
    draftTutorialCount: number;
    featuredTutorialCount: number;
    pendingSubmissionCount: number;
}

export interface AdminTutorialsPageProps {
    stats: AdminTutorialStats;
    tutorials: PaginatedData<TutorialArticle>;
    filters: AdminTutorialFilters;
}

export interface AdminCommunityFilters {
    search: string;
    tag: string;
    sort: CommunitySort;
}

export interface AdminCommunityStats {
    postCount: number;
    totalLikes: number;
    totalAnswers: number;
    pinnedCount: number;
}

export interface AdminCommunityListItem extends CommunityPost {
    answers_count?: number;
    has_official_answer?: boolean;
}

export interface AdminCommunityPageProps {
    stats: AdminCommunityStats;
    posts: PaginatedData<AdminCommunityListItem>;
    availableTags: string[];
    filters: AdminCommunityFilters;
}

export interface AdminSubmissionListItem extends Submission {
    published_tutorial?: { id: number; title: string } | null;
}

export interface AdminSubmissionsPageProps {
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    submissions: PaginatedData<AdminSubmissionListItem>;
    filters: {
        search: string;
        status: AdminSubmissionStatusFilter;
    };
}

export interface AdminCommunityDetailPageProps {
    post: CommunityPost & { answers_count?: number };
    stats: AdminCommunityStats;
}

export interface AdminSubmissionQueueMeta {
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
}

export interface AdminSubmissionDetailPageProps {
    submission: Submission & {
        reviewer?: {
            id: number;
            name: string;
            email: string;
        } | null;
        published_tutorial?: {
            id: number;
            title: string;
        } | null;
    };
    queueMeta: AdminSubmissionQueueMeta;
}

export interface AdminTutorialCreatePageProps {
    tutorial: null;
}

export interface AdminTutorialEditPageProps {
    tutorial: TutorialArticle;
}
