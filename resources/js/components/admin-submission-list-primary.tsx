import { Mail, User } from 'lucide-react';
import { AdminListPrimary } from '@/components/admin-list-primary';
import { AdminSubmissionStatusBadge } from '@/components/admin-submission-status-badge';
import { getTutorialCategoryLabel } from '@/lib/tutorial-meta';
import type { AdminSubmissionListItem } from '@/types';

export function AdminSubmissionListPrimary({
    submission,
}: {
    submission: AdminSubmissionListItem;
}) {
    return (
        <AdminListPrimary
            title={
                <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold">
                        {submission.title}
                    </span>
                    <AdminSubmissionStatusBadge status={submission.status} />
                </div>
            }
            description={submission.summary}
            descriptionClassName="line-clamp-2 text-sm text-muted-foreground"
            meta={
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {submission.user?.name || '未知用户'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {submission.user?.email || '暂无邮箱'}
                    </span>
                    {submission.details ? (
                        <>
                            <span>
                                {getTutorialCategoryLabel(
                                    submission.details.category,
                                )}
                            </span>
                            <span>{submission.details.difficulty}</span>
                            <span>{submission.details.duration}</span>
                        </>
                    ) : null}
                </div>
            }
        />
    );
}
