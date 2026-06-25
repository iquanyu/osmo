import { Badge } from '@/components/ui/badge';
import type { TutorialSettings } from '@/types';

export function AdminTutorialSettingsMeta({
    settings,
}: {
    settings: Pick<TutorialSettings, 'colorProfile' | 'resolution'>;
}) {
    return (
        <>
            <Badge variant="secondary" className="text-xs">
                {settings.colorProfile}
            </Badge>
            <p className="mt-0.5 text-xs text-muted-foreground">
                {settings.resolution}
            </p>
        </>
    );
}
