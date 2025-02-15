import { createObjectCsvWriter } from "csv-writer";
import { PSProduct, ShopifyCommon, ShopifyRequired } from "yourders-types";
import { ShopifyCSVKeyValue } from "src/routes/product-selector/product-selector.config";

export function prepareShopifyData(data: PSProduct[]) {
  let currentItemIndex = 0;
  try {
    const newData = data.reduce((acc, item, index) => {
      currentItemIndex = index;
      const commonInfo: ShopifyCommon = {
        Title: item.title,
        Vendor: item.vendor,
        BodyHTML: item.description,
        ProductCategory: item.taxonomyGID,
        Collection: "",
        Type: item.productType,
        Tags: item.tags.join(", "),
        Published: "false",
        GiftCard: "false",
        Option1Name: item.variants[0].optionUnit,
        SEOTitle: item.title,
        SEODescription: item.description,
        IncludedIndia: "true",
        Status: "draft",
      };

      const records = item.variants.map((variant, index) => {
        const product: ShopifyRequired = {
          ...commonInfo,
          Handle: item.handle,
          Option1Value: variant.optionValue,
          VariantSKU: variant.sku,
          VariantPrice: variant.sp.toString(),
          VariantCompareAtPrice: variant.mrp.toString(),
          CostPerItem: variant.originalSp.toString(),
          VariantInventoryQty: "0", // Set default quantity, can be dynamic
          VariantInventoryTracker: "shopify",
          VariantInventoryPolicy: "deny",
          VariantFulfillmentService: "manual",
          VariantRequiresShipping: "TRUE",
          VariantTaxable: "TRUE",
          VariantGrams: "0", // Set default weight, can be dynamic
          VariantWeightUnit: "g",
          ImageSrc: variant.imageSrc,
          ImagePosition: `${index + 1}`,
          ImageAltText: item.title,
          VariantImage: variant.imageSrc,
          SEODescription: variant.description
            ? variant.description.slice(0, 160)
            : "",
          Status: "draft",
        };

        return product;
      });

      acc = [...acc, ...records];
      return acc;
    }, [] as ShopifyRequired[]);

    console.log(`CSV prepared for ${newData.length} items`);
    return { data: newData };
  } catch (error) {
    console.error(`Error preparing data at index ${currentItemIndex}`, error);
    return { error: true, data: [] };
  }
}

export async function generateShopifyCSV(data: PSProduct[], storePath: string) {
  const { error, data: shopifyData } = prepareShopifyData(data);

  if (error) {
    return { error };
  }

  // Set up the CSV writer
  const csvWriter = createObjectCsvWriter({
    path: storePath,
    header: Object.entries(ShopifyCSVKeyValue).map(([key, value]) => ({
      id: key,
      title: value,
    })),
  });

  try {
    await csvWriter.writeRecords(shopifyData);
    console.log("CSV file successfully created: ", storePath);
    return { error: false };
  } catch (error) {
    console.error("Error writing CSV:", error);
    return { error: true };
  }
}
