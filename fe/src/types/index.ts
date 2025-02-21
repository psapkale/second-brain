export interface UserData {
   name: string;
   email: string;
   imgUrl: string;
   token: string;
   createdAt: number;
}

export interface SpaceData {
   id: string;
   title: string;
   isPublic: boolean;
   creator: UserData;
   creatorId: string;
   posts: PostData[];
   createdAt: Date;
}

export type ContentType = "TWITTER" | "YOUTUBE" | "INSTAGRAM";

export interface PostData {
   id: string;
   title: string;
   link: string;
   contentType: ContentType;
   createdAt: Date;
}
