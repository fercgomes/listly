export type UserID = string;

export interface List {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  owner: UserID;
}
