export interface VoteOption {
    id: number;
    caption: string;
    presentationOrder: number;
}

export interface Poll {
    id: number;
    question: string;
    options: VoteOption[];
}