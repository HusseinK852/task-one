export interface Trigger {
    _id: string;
    name: string;
    description?: string;
    eventType: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Condition {
    _id: string;
    description?: string;
    expression: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Action {
    _id: string;
    name: string;
    description?: string;
    command: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Config {
    _id: string;
    key: string;
    value: any;
}

export interface Rule {
    _id: string;
    name: string;
    triggers: Trigger[];
    conditions: Condition[];
    actions: Action[];
    onFailure: Action[];
    config: Config[];
    enabled: boolean;
}

export interface JsonPreview {
    name: string | null;
    triggers: Trigger[];
    conditions: Condition[];
    actions: Action[];
    onFailure: Action[];
    config: Config[];
  }
