import * as fs from "fs";
import * as path from "path";
import { createObjectCsvWriter } from "csv-writer";
import {
  PSProduct,
  ShopifyCommon,
  ShopifyRequired,
  ShopifyVariantSpecific,
} from "yourders-types";
import { ShopifyCSVKeyValue } from "src/routes/product-selector/product-selector.config";
import { AppRequest, AppResponse } from "src/types/routes";
import { getPaths } from "src/config/path";

const paths = getPaths("..", "..");

export function prepareShopifyData(data: PSProduct[]) {
  let currentItemIndex = 0;
  try {
    const newData = data.reduce((acc, item, index) => {
      currentItemIndex = index;
      const commonInfo: ShopifyCommon = {
        Title: item.title,
        Vendor: item.vendor,
        BodyHTML: item.description,
        ProductCategory: item.productCategoryBreadcrumb.join(" > "),
        Collection: "",
        Type: item.productType,
        Tags: item.tags.join(","),
        Published: "true",
        GiftCard: "false",
        Option1Name: item.variants[0].optionUnit,
        SEOTitle: item.title,
        SEODescription: item.description,
        IncludedIndia: "true",
        Status: "draft",
      };

      const records = item.variants.map((variant, index) => {
        const variantSpecificData: ShopifyVariantSpecific = {
          Handle: item.handle,
          Option1Value: variant.optionValue,
          VariantSKU: variant.sku,
          VariantPrice: variant.sp.toString(),
          VariantCompareAtPrice: variant.mrp.toString(),
          CostPerItem: variant.originalSp.toString(),
          VariantInventoryQty: "0", // Set default quantity, can be dynamic
          VariantInventoryTracker: "shopify",
          VariantInventoryPolicy: "continue",
          VariantFulfillmentService: "manual",
          VariantRequiresShipping: "true",
          VariantTaxable: "false",
          VariantGrams: "0", // Set default weight, can be dynamic
          VariantWeightUnit: "g",
          ImageSrc: variant.imageSrc,
          ImagePosition: `${index + 1}`,
          ImageAltText: item.title,
          VariantImage: variant.imageSrc,
        };
        if (index === 0) {
          return { ...commonInfo, ...variantSpecificData } as ShopifyRequired;
        }

        // For all other variants, only include the variant specific data
        return {
          ...(Object.keys(commonInfo) as (keyof ShopifyCommon)[]).reduce(
            (acc, key) => {
              acc[key] = "";
              return acc;
            },
            {} as ShopifyCommon
          ),
          ...variantSpecificData,
        };
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

export async function generateShopifyCSV(data: PSProduct[]) {
  const { error, data: shopifyData } = prepareShopifyData(data);

  if (error) {
    return { error };
  }

  if (!fs.existsSync(paths.dir.exports)) {
    fs.mkdirSync(paths.dir.exports);
  }

  const storePath = path.join(paths.dir.exports, "shopify.csv");

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

export const exportShopify = async (
  req: AppRequest<{
    body: { productIds: string[] };
  }>,
  res: AppResponse
) => {
  const { productIds } = req.body;

  if (!productIds?.length) {
    return res.status(400).json({
      error: true,
      data: null,
      message: "No product IDs provided",
    });
  }

  const dataset: PSProduct[] = JSON.parse(
    fs.readFileSync(paths.file.allProductsData, "utf-8")
  );

  console.log("Dataset length: ", dataset.length);

  const storePath = path.join(paths.dir.exports, "shopify.csv");

  const { error } = await generateShopifyCSV(
    dataset.filter((item) => productIds.includes(item.id))
  );

  if (error) {
    return res.status(500).json({
      error: true,
      data: null,
      message: "Error generating CSV",
    });
  }

  return res.download(storePath, "shopify.csv", (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: true,
        data: null,
        message: "Error downloading the file",
      });
    }
  });

  // return res.download(paths.dir.temp, "shopify.csv", (err) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).json({
  //       error: true,
  //       data: null,
  //       message: "Error downloading the file",
  //     });
  //   }
  // });
};

const downloadCsv = async () => {
  const dataset: PSProduct[] = JSON.parse(
    fs.readFileSync(paths.file.allProductsData, "utf-8")
  );

  // const onlyOneProductFromEachCategorySubCategorySubSubCategory =
  //   dataset.reduce(
  //     (acc, item) => {
  //       const { category, subCategory, subSubCategory } = item;
  //       const key = `${category} > ${subCategory} > ${subSubCategory}`;
  //       if (!acc[key]) {
  //         acc[key] = item;
  //       }
  //       return acc;
  //     },
  //     {} as Record<string, PSProduct>
  //   );

  // const productIds = Object.values(
  //   onlyOneProductFromEachCategorySubCategorySubSubCategory
  // ).map((item) => item.id);

  const productIds = dataset.map((item) => item.id);

  console.log("Product IDs: ", productIds);

  try {
    await fetch("http://localhost:3000/api/ps/product/export/shopify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productIds }),
    });
  } catch (error) {
    console.error(error);
  }
};

// downloadCsv();
