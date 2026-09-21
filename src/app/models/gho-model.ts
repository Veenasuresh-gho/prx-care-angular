export interface tags {
  T: string;
  V: string;
}

export interface ghoiin {
  Token: string;
  Action: string;
  Lts: string;
  BrowseInfo: string;
  Mode: string;
  Tags: tags[];
}

export interface ghoresult {
  Status: number;
  Message?: string;
  Data?: any;
}