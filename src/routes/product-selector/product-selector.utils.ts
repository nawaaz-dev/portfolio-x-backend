import * as fs from "fs";
import { DeletedDataItem, DirectoryFilePaths } from "./product-selector.types";
import { PSProduct } from "yourders-types";

export const productFactory = {
  createTitle: (title: string) => {
    return title.split(":")[0].trim().split("-")[0].trim();
  },
  createHandle: (title: string) => {
    return title.split(" ").join("-").toLocaleLowerCase();
  },
  createId() {
    return Math.random().toString(16).slice(2, 10);
  },
  /**
   * Format:
   * The SKU has 3 parts:
   * - The first part consists of the letters derived from the title.
   * - The second part is the quantity.
   * - The third part is the vendor or batch number. For now, us RALL for all.
   *   RALL is the short for Retail All.
   * Example:
   * - Title: "Toor Dal"
   * - Quantity: "1kg"
   * - SKU: "TOORDAL-1KG-RALL"
   * How to derive the first part of the SKU:
   * - Break the title down by spaces.
   * - Take the first 4 letters of each word and join them. The maximum length of the first part is 8.
   * - Convert to uppercase.
   * - Add quantity prefix with a hyphen.
   * - Add the vendor or batch number with a hyphen.
   *
   */
  createSKU(title: string, quantity: string) {
    const titleParts = title.split(" ");
    const sku = titleParts
      .map((part) => part.slice(0, 2).toUpperCase())
      .join("")
      .slice(0, 8);
    return `${sku}-${quantity}-RALL`.split(" ").join("").toUpperCase();
  },
  createLocalImageSrc(assetPath: string, img: string) {
    return `${assetPath}/${img.split("/").pop()}`;
  },
};

export function getConsolidatedData(paths: DirectoryFilePaths): PSProduct[] {
  if (!fs.existsSync(paths.dir.products)) {
    fs.mkdirSync(paths.dir.products, { recursive: true });
  }
  // Check if consolidated.json exists
  // If yes, return the data
  // if (fs.existsSync(consolidatedFilePath)) {
  //   return JSON.parse(
  //     fs.readFileSync(consolidatedFilePath, { encoding: "utf-8" })
  //   ) as PSProduct[];
  // }

  // List all dirs in dataDirPath
  const dataDirs = fs
    .readdirSync(paths.dir.raw)
    /**
     * This is a temporary filter to get only a specific directory.
     * Once the feature of selecting dataset is implemented, this will be removed
     */
    .filter((dir) => dir === "1-ce71d5");

  console.log("dataDirs", dataDirs);

  if (!dataDirs.length) {
    return [];
  }

  // Iterate over each dir and read the raw.json file
  const consolidatedData: PSProduct[] = dataDirs.reduce((acc, dir) => {
    const filePath = `${paths.dir.raw}/${dir}/ps.json`;
    console.log("filePath", filePath);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(
          fs.readFileSync(filePath, { encoding: "utf-8" })
        );
        // const assetPath = "http://localhost:3000/assets/images";
        // console.log(assetPath);
        // acc.push(
        //   ...mapRawDataToPSProduct(data.data as RawDataItem[], assetPath)
        // );
        acc.push(...(data as PSProduct[]));
        return acc;
      } catch (error) {
        console.error("Error reading file", error);
      }
    }
    return acc;
  }, [] as PSProduct[]);

  try {
    fs.writeFileSync(
      paths.file.rawConsolidated("consolidated"),
      JSON.stringify(consolidatedData, null, 2),
      {
        encoding: "utf-8",
      }
    );

    return consolidatedData;
  } catch (error) {
    console.error("Error writing consolidated data", error);
    return [];
  }
}

export function getCustomData(paths: DirectoryFilePaths): PSProduct[] {
  if (!fs.existsSync(paths.dir.custom)) {
    fs.mkdirSync(paths.dir.custom, { recursive: true });
  }

  // Check if custom.json exists
  // If yes, return the data
  if (fs.existsSync(paths.file.custom)) {
    return JSON.parse(
      fs.readFileSync(paths.file.custom, { encoding: "utf-8" })
    ) as PSProduct[];
  }

  // Create the file if it doesn't exist
  try {
    fs.writeFileSync(paths.file.custom, "[]", {
      encoding: "utf-8",
    });

    return [];
  } catch (error) {
    console.error("Error writing custom data", error);
    return [];
  }
}

export function getDeletedData(paths: DirectoryFilePaths): DeletedDataItem[] {
  // Check if deleted.json exists
  // If yes, return the data
  if (fs.existsSync(paths.file.productDeletedData)) {
    return JSON.parse(
      fs.readFileSync(paths.file.productDeletedData, { encoding: "utf-8" })
    ) as DeletedDataItem[];
  }

  // Create the file if it doesn't exist
  try {
    fs.writeFileSync(paths.file.productDeletedData, "[]", {
      encoding: "utf-8",
    });

    return [];
  } catch (error) {
    console.error("Error writing deleted data", error);
    return [];
  }
}

export function getFinalProductData(paths: DirectoryFilePaths): PSProduct[] {
  const consolidatedData = getConsolidatedData(paths);
  console.log("consolidatedData", consolidatedData);
  const customData = getCustomData(paths);
  const deletedData = getDeletedData(paths);

  // Merge consolidated and custom data
  // Priroritize custom data for entries with same IDs in both
  const preFinalData = [...consolidatedData, ...customData].reduce(
    (acc, item) => {
      const similarItemIndex = acc.findIndex((i) => i.id === item.id);
      if (similarItemIndex > -1) {
        acc[similarItemIndex] = item;
      } else {
        acc.push(item);
      }

      return acc;
    },
    [] as PSProduct[]
  );

  return preFinalData.filter((item) => !deletedData.includes(item.id));
}

export function createProduct(paths: DirectoryFilePaths, product: PSProduct) {
  const customData = getCustomData(paths);
  const finalData = getFinalProductData(paths);
  const similarItemIndex = customData.findIndex((i) => i.id === product.id);

  if (similarItemIndex > -1) {
    return { error: "Product already exists" };
  }

  if (!product.title) {
    return { error: "Product title is required" };
  }

  if (product.variants.length && product.variants.some((v) => !v.optionValue)) {
    return { error: "Variant option value is required for all variants" };
  }

  let productId = productFactory.createId();

  // Ensure the ID is unique
  while (finalData.some((item) => item.id === productId)) {
    productId = productFactory.createId();
  }

  const processProduct = {
    ...product,
    id: productId,
    handle: productFactory.createHandle(product.title),
    variants: product.variants.map((variant) => ({
      ...variant,
      id: productFactory.createId(),
      sku: productFactory.createSKU(product.title, variant.optionValue),
      localImageSrc: variant.imageSrc?.length
        ? productFactory.createLocalImageSrc(
            product.localImages[0],
            variant.imageSrc
          )
        : "",
    })),
  };

  customData.push(processProduct);

  try {
    fs.writeFileSync(paths.file.custom, JSON.stringify(customData, null, 2), {
      encoding: "utf-8",
    });

    return { data: processProduct };
  } catch (error) {
    console.error("Error writing custom data", error);
    return { error: "Error writing custom data" };
  }
}

export function updateProduct(paths: DirectoryFilePaths, product: PSProduct) {
  const customData = getCustomData(paths);
  const similarItemIndex = customData.findIndex((i) => i.id === product.id);

  if (similarItemIndex > -1) {
    customData[similarItemIndex] = product;
  } else {
    customData.push({
      ...product,
      localImages: product.images.map((img) =>
        productFactory.createLocalImageSrc(product.localImages[0], img)
      ),
      variants: product.variants.map((variant) => ({
        ...variant,
        id: productFactory.createId(),
        sku: productFactory.createSKU(product.title, variant.optionValue),
        localImageSrc: variant.imageSrc.length
          ? productFactory.createLocalImageSrc(
              product.localImages[0],
              variant.imageSrc
            )
          : "",
      })),
    });
  }

  try {
    fs.writeFileSync(paths.file.custom, JSON.stringify(customData, null, 2), {
      encoding: "utf-8",
    });

    return { data: product };
  } catch (error) {
    console.error("Error writing custom data", error);
    return { error: "Error writing custom data" };
  }
}

export function deleteProduct(paths: DirectoryFilePaths, productId: string) {
  const deletedData = getDeletedData(paths);

  if (!deletedData.includes(productId)) {
    deletedData.push(productId);
  }

  try {
    fs.writeFileSync(
      paths.file.productDeletedData,
      JSON.stringify(deletedData, null, 2),
      {
        encoding: "utf-8",
      }
    );

    return { data: productId };
  } catch (error) {
    console.error("Error writing deleted data", error);
    return { error: "Error writing deleted data" };
  }
}
