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

export class ghoresult 
{
  Status: number =0;
  Error: string ="";
  Info: string ="";
  Data: any[] =[];
}
