export interface Block {
    _id: string;
    name: string;
    description: string;
    eventType?: string;
    type: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BlockPosition {
    top: number;
    left: number;
}
