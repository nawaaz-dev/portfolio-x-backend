import mongoose, { Document, Schema } from "mongoose";
import { ScrapperItem } from "yourders-types";

export interface IScrapperRawItemModel extends Document, ScrapperItem {}

const ScrapperSchema = new Schema<IScrapperRawItemModel>({
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  subSubCategory: { type: String, required: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  productUrl: { type: String, required: true },
  variants: [
    {
      description: { type: String, required: true },
      descriptionHTML: { type: String, required: true },
      quantity: { type: String, required: true },
      images: { type: [String], required: true },
      mrp: { type: String, required: true },
      sp: { type: String, required: true },
      spPerUnit: { type: String, required: true },
      variantUrl: { type: String, required: true },
    },
  ],
});

const ScrapperModel = mongoose.model<IScrapperRawItemModel>(
  "Raw",
  ScrapperSchema
);

export default ScrapperModel;
