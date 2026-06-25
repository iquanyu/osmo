export type CommunitySort = 'date' | 'views' | 'likes' | 'replies';

export interface Answer {
    id: number;
    author: string;
    content: string;
    is_official: boolean;
    created_at: string;
}

export interface CommunityPost {
    id: number;
    author: string;
    avatar_color: string;
    title: string;
    content: string;
    answers: Answer[];
    tags: string[];
    likes: number;
    views: number;
    pinned: boolean;
    created_at: string;
    updated_at: string;
}

export interface CommunityListItem {
    id: number;
    author: string;
    avatar_color: string;
    title: string;
    content: string;
    tags: string[];
    likes: number;
    views: number;
    pinned: boolean;
    answers_count: number;
    created_at: string;
}

export interface CommunityIndexFilters {
    q: string;
}

export interface CommunityIndexPageProps {
    posts: CommunityListItem[];
    hotCommunityPosts: CommunityListItem[];
    filters: CommunityIndexFilters;
}

export interface CommunityShowPageProps {
    post: CommunityPost;
}
