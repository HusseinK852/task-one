import type { Block } from './block'

export interface JsonPreview {
    name: string | null;
    triggers: Block[];
    conditions: Block[];
    actions: Block[];
    onFailure: Block[];
    config: Block[];
}
