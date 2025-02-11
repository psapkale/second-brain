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
   creatorId: string;
   createdAt: string;
}
