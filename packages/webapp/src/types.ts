export type UserID = string;

export interface List {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  owner: UserID;
  items: ListItem[];
  sharedWith: string[];
  shareLinks: string[];
}

export interface ListItem {
  checked: boolean;
  name: string;
  quantity?: number;
}

export type ListShareStatus = {};
