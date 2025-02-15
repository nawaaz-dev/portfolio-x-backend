import { ShopifyDatItem } from "../../../types/data";

export type TWorkspace = {
  workspaceId: string;
  workspaceName: string;
  data: ShopifyDatItem[];
  dateCreated: string;
  dateModified: Date;
};
