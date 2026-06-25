import { Badge } from '@/components/ui/badge';
import {
    getSubmissionStatusLabel,
    getSubmissionStatusTone,
} from '@/lib/submission-status';
import type { SubmissionStatus } from '@/types';

export function SubmissionStatusBadge({
    status,
    mode = 'admin',
}: {
    status: SubmissionStatus;
    mode?: 'admin' | 'contribute';
}) {
    return (
        <Badge
            variant="outline"
            className={getSubmissionStatusTone(status, mode)}
        >
            {getSubmissionStatusLabel(status, mode)}
        </Badge>
    );
}
