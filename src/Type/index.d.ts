export interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    bio?: string;
    isFollowing?: boolean;
}
export type Activity = {
    action: ActivityActions
    timeStamp: String

}
export enum ActivityActions {
    FOLLOW = "follow",
    LIKE = "like"
}

export interface Post {
    userId: string;
    content: string;
    media?: string[];
    timeStamp: string;
    likes: number;
    liked?: boolean;
    _id: string
}
export interface Thread extends Post {
    thread?: Thread;
    replies?: [Replies];
}

export interface Replies extends Post {
    threadId: string
}

