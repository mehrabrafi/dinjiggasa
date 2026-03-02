export declare const Role: {
    readonly USER: "USER";
    readonly SCHOLAR: "SCHOLAR";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const VoteType: {
    readonly UPVOTE: "UPVOTE";
    readonly DOWNVOTE: "DOWNVOTE";
};
export type VoteType = (typeof VoteType)[keyof typeof VoteType];
