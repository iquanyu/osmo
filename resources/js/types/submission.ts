import type { TutorialSettings } from './tutorial';

export type SubmissionStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type ContributorSubmissionStatusFilter = 'all' | SubmissionStatus;
export type AdminSubmissionStatusFilter = Exclude<SubmissionStatus, 'draft'>;
export type SubmissionType = 'tutorial' | 'preset' | 'video';

export interface SubmissionDetails {
    category: string;
    difficulty: string;
    duration: string;
    steps: string[];
    tips: string[];
    settings: TutorialSettings;
}

export interface Submission {
    id: number;
    user_id: number;
    type: SubmissionType;
    status: SubmissionStatus;
    title: string;
    summary: string | null;
    cover_image: string | null;
    details: SubmissionDetails | null;
    review_note: string | null;
    reviewed_by: number | null;
    reviewed_at: string | null;
    submitted_at: string | null;
    published_tutorial_id: number | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    reviewer?: {
        id: number;
        name: string;
        email: string;
    } | null;
}
