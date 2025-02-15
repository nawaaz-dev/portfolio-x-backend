import { ScrapperItem } from "yourders-types";

export type RawDataItem = ScrapperItem;

export type SessionData = {
  data: RawDataItem[];
};

export type ShopifyDatItem = {
  Handle: string;
  Title: string;
  BodyHTML: string;
  Vendor: string;
  Type: string;
  Tags: string;
  Option1Name: string;
  Option1Value: string;
  Option2Name?: string;
  Option2Value?: string;
  Option3Name?: string;
  Option3Value?: string;
  VariantSKU: string;
  VariantPrice: number;
  VariantCompareAtPrice: number;
  VariantInventoryQty: number;
  VariantInventoryPolicy: string;
  VariantFulfillmentService: string;
  VariantRequiresShipping: string;
  VariantTaxable: string;
  ImageSrc: string;
  GiftCard: string;
  SEODescription: string;
};
