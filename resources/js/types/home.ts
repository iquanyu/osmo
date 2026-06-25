import type { CommunityListItem } from './community';
import type { TutorialListItem } from './tutorial';

export interface HomePageProps {
    featuredTutorials: TutorialListItem[];
    latestTutorials: TutorialListItem[];
    recentCommunityPosts: CommunityListItem[];
}
