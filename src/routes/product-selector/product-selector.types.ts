import { PSProduct } from "yourders-types";

export type Empty = null | undefined;

export type RawDataItem = {
  category: string | Empty; // grocery, personal care, etc.
  subCategory: string | Empty; // dal, skin care, etc.
  subSubCategory: string | Empty; // toor dal, face care, etc.
  brand: string | Empty; // Tata, Himalaya, etc.
  name: string | Empty; // Tata Toor Dal 1kg, Himalaya Aloe Vera Face Wash, etc.
  variants: {
    description: string | Empty;
    descriptionHTML: string | Empty;
    quantity: string | Empty; // 1kg, 100g, etc.
    images: string[];
    mrp: number | Empty; // 100, 200, etc.
    sp: number | Empty; // 90, 190, etc.
    spPerUnit: string | Empty; // 0.44 per g, 0.5 per g, etc.
  }[];
};

export type ConsolidatedData = PSProduct[];

export type CustomData = PSProduct[];

export type DeletedDataItem = PSProduct["id"];

export type DirectoryFilePaths = {
  dir: {
    data: string;
    raw: string;
    consolidated: string;
    products: string;
    custom: string;
    workspaces: string;
    workspaceList: string;
    exports: string;
    shopify: string;
  };
  file: {
    raw: (sessionId: string) => string;
    rawConsolidated: (filenamePartial: string) => string;
    custom: string;
    allProductsData: string;
    productDeletedData: string;
    workspaceData: (workspaceId: string) => string;
    workspaceDeletedData: string;
    shopifyCsvExport: string;
    shopifyCollectionSet: string;
  };
};
