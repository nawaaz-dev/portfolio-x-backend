import * as path from "path";
import { DirectoryFilePaths } from "src/routes/product-selector/product-selector.types";

console.log(__dirname);

export const getPaths = (...upLevels: string[]) => {
  const dataDirPath = path.join(__dirname, ...upLevels, "data");

  const paths: DirectoryFilePaths = {
    dir: {
      data: dataDirPath,
      raw: path.join(dataDirPath, "raw", "sessions"),
      consolidated: path.join(dataDirPath, "raw", "consolidated"),
      products: path.join(dataDirPath, "products"),
      custom: path.join(dataDirPath, "products", "custom"),
      workspaces: path.join(dataDirPath, "workspaces"),
      workspaceList: path.join(dataDirPath, "workspaces", "list"),
      exports: path.join(dataDirPath, "temp"),
      shopify: path.join(dataDirPath, "shopify"),
    },
    file: {
      raw: (sessionId: string) =>
        path.join(paths.dir.raw, sessionId, "raw.json"),
      rawConsolidated: (filenamePartial: string) =>
        path.join(paths.dir.consolidated, `${filenamePartial}.json`),
      custom: path.join(dataDirPath, "products", "custom", "custom.json"),
      allProductsData: path.join(dataDirPath, "products", "all.json"),
      productDeletedData: path.join(dataDirPath, "products", "deleted.json"),
      workspaceData: (workspaceId: string) =>
        path.join(paths.dir.workspaceList, `${workspaceId}.json`),
      workspaceDeletedData: path.join(
        dataDirPath,
        "workspaces",
        "deleted.json"
      ),
      shopifyCollectionSet: path.join(
        dataDirPath,
        "shopify",
        "collections.json"
      ),
      shopifyCsvExport: path.join(
        dataDirPath,
        "shopify",
        "exports",
        "shopify.csv"
      ),
    },
  };

  return paths;
};
