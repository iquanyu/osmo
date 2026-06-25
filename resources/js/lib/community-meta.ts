import type { CommunitySort } from '@/types';

export const defaultAdminCommunitySort: CommunitySort = 'date';

export const adminCommunitySortOptions: Array<{
    value: CommunitySort;
    label: string;
}> = [
    { value: 'date', label: '最新发布' },
    { value: 'views', label: '浏览量' },
    { value: 'likes', label: '点赞数' },
    { value: 'replies', label: '回复数' },
];
