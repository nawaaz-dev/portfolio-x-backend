import { RawDataItem, ShopifyDatItem } from "../../types/data";
import { createObjectCsvWriter } from "csv-writer";
import { ShopifyCSVKeyValue } from "../product-selector/product-selector.config";

export async function prepareShopifyData(data: RawDataItem[]) {
  // Utility function to create handles
  const createHandle = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const createSku = (name: string, quantity: string) =>
    `${createHandle(name)}-${quantity}`;

  const { validData, invalidData } = data.reduce(
    (acc, item) => {
      if (!item.variants.length) {
        acc.invalidData.push(item as any);
      } else {
        acc.validData.push(item as any);
      }
      return acc;
    },
    {
      validData: [] as RawDataItem[],
      invalidData: [] as RawDataItem[],
    }
  );

  let currentItemIndex = 0;
  try {
    const newData = validData.reduce((acc, item, index) => {
      currentItemIndex = index;
      const commonInfo = {
        Handle: createHandle(item.name),
        Vendor: item.brand,
        Type: item.category,
        Collection: item.category,
        Tags: `${item.category}, ${item.subCategory}, ${item.subSubCategory}`,
        GiftCard: "FALSE",
      };

      const records = item.variants.map<any>((variant) => {
        return {
          ...commonInfo,
          Title: (item as RawDataItem).name,
          BodyHTML: variant.descriptionHTML || variant.description || "",
          Option1Name: (() => {
            const value = variant.quantity?.replace(/\d+/g, "").trim() || "";
            if (!value) return "";
            switch (value.toLocaleLowerCase()) {
              // case "kg":
              // case "g":
              // case "mg":
              // case "gram":
              // case "gm":
              //   return "Weight";
              // case "l":
              // case "ml":
              //   return "Volume";
              // case "unit":
              //   return "Unit";
              default:
                return "Variant";
            }
          })(),
          Option1Value: variant.quantity || "",
          VariantSKU: createSku(
            (item as RawDataItem).name,
            variant.quantity || ""
          ),
          VariantPrice: variant.sp!,
          VariantCompareAtPrice: variant.mrp!,
          VariantInventoryQty: 0, // Set default quantity, can be dynamic
          VariantInventoryPolicy: "deny",
          VariantFulfillmentService: "manual",
          VariantRequiresShipping: "TRUE",
          VariantTaxable: "TRUE",
          ImageSrc: variant.images[0],
          GiftCard: "FALSE",
          SEODescription: variant.description
            ? variant.description.slice(0, 160)
            : "",
          Status: "active",
        };
      });

      acc = [...acc, ...records];
      return acc;
    }, [] as ShopifyDatItem[]);

    console.log("Invalid data:", invalidData);
    console.log(`CSV prepared for ${newData.length} items`);
    return { data: newData };
  } catch (error) {
    console.error(`Error preparing data at index ${currentItemIndex}`, error);
    return { error: true, data: [] };
  }
}

export async function generateShopifyCSV(
  data: ShopifyDatItem[],
  storePath: string
) {
  // Set up the CSV writer
  const csvWriter = createObjectCsvWriter({
    path: storePath,
    header: Object.entries(ShopifyCSVKeyValue).map(([key, value]) => ({
      id: key,
      title: value,
    })),
  });

  try {
    await csvWriter.writeRecords(data);
    console.log("CSV file successfully created: ", storePath);
    return { error: false };
  } catch (error) {
    console.error("Error writing CSV:", error);
    return { error: true };
  }
}

// Write to CSV
