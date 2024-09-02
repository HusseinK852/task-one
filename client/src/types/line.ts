export interface Line {
    fromBlockId: string;
    toBlockId: string;
    side: 'left' | 'right';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
