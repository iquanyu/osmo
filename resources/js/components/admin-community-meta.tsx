import { User } from 'lucide-react';

export function AdminCommunityMeta({
    author,
    createdAt,
    views,
    likes,
    replies,
}: {
    author: string;
    createdAt: string;
    views?: number | null;
    likes?: number | null;
    replies: number;
}) {
    return (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {author}
            </span>
            <span>{new Date(createdAt).toLocaleDateString('zh-CN')}</span>
            <span>围观 {views || 0}</span>
            <span>👍 {likes || 0}</span>
            <span>回复 {replies}</span>
        </div>
    );
}
