import { SubmissionStatusBadge } from '@/components/submission-status-badge';
import type { SubmissionStatus } from '@/types';

export function AdminSubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
    return <SubmissionStatusBadge status={status} mode="admin" />;
}
