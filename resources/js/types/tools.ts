export interface ToolRecordingProfile {
    platform: string;
    resolution: string;
    fps: string;
    color: string;
    gimbal: string;
    audio: string;
    lightingCondition: string;
    extraTips: string;
}

export interface ToolAccessory {
    name: string;
    category: string;
    recommendation: string;
    reason: string;
}

export interface ToolCommunityPostPreview {
    title: string;
    tag: string;
    summary: string;
}

export interface ToolsSpecsPageProps {
    profiles: ToolRecordingProfile[];
}

export interface ToolsAccessoriesPageProps {
    accessories: ToolAccessory[];
    communityPosts: ToolCommunityPostPreview[];
}
