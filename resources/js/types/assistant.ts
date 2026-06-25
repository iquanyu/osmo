export interface AISettings {
    resolution: string;
    colorProfile: string;
    exposureMode: string;
    shutterSpeed: string;
    isoRange: string;
    gimbalMode: string;
}

export interface AISuggestion {
    objective: string;
    settings: AISettings;
    ndFilter: string;
    audioSetup: string;
    creativeTips: string[];
    explanation: string;
}
