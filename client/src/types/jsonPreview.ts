export interface JsonPreview {
    name: string | null;
    triggers: string[];
    conditions: string[];
    actions: string[];
    onFailure: string[];
    config: string[];
}
