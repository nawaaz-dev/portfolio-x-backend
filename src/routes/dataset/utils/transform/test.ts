import * as fs from "fs";
import * as path from "path";
import { getPaths } from "src/config/path";
import { RawDataItem, SessionData } from "src/types/data";
import { PSProduct } from "yourders-types";
import { transformRawData } from "./transform";

const paths = getPaths("..", "..", "..", "..", "..");

const tranformedDataFilePath = path.resolve("./transformedData.json");

const tranformedData = JSON.parse(
  fs.readFileSync(tranformedDataFilePath, "utf-8")
) as PSProduct[];

const generateErroneousBreadcrumbData = () => {
  const breadcrumbToGIDMap = tranformedData.reduce<Record<string, string[]>>(
    (acc, data) => {
      const breadcrumbString = data.productCategoryBreadcrumb.join(" > ");
      if (acc[breadcrumbString]) {
        if (!acc[breadcrumbString].includes(data.taxonomyGID))
          acc[breadcrumbString].push(data.taxonomyGID);
      } else {
        acc[breadcrumbString] = [data.taxonomyGID];
      }
      return acc;
    },
    {}
  );

  fs.writeFileSync(
    path.resolve("./breadcrumbToGIDMap.json"),
    JSON.stringify(breadcrumbToGIDMap, null, 2)
  );
};

/**
 * Any product having missing or empty taxonomyGID and productCategoryBreadcrumb fields
 */
const generateErroneousTaxonomyData = () => {
  const taxonomyToGIDMap = tranformedData.reduce<Record<string, string[]>>(
    (acc, data) => {
      if (!data.taxonomyGID || !data.productCategoryBreadcrumb.length) {
        if (acc[data.taxonomyGID]) {
          if (!acc[data.taxonomyGID].includes(data.taxonomyGID))
            acc[data.taxonomyGID].push(data.taxonomyGID);
        } else {
          acc[data.taxonomyGID] = [data.taxonomyGID];
        }
      }
      return acc;
    },
    {}
  );

  fs.writeFileSync(
    path.resolve("./taxonomyToGIDMap.json"),
    JSON.stringify(taxonomyToGIDMap, null, 2)
  );
};

const generateTranformedData = () => {
  const rawData = JSON.parse(
    fs.readFileSync(paths.file.raw("10-f4dbad"), { encoding: "utf-8" })
  ) as SessionData;

  const rawDataItem = rawData.data.find((i) =>
    i.name.match("Twinings Green Tea Lemon & Honey")
  );

  const transformedData = transformRawData([rawDataItem!]);

  transformedData[0].variants.forEach((v) => console.log(v));
};

// generateErroneousTaxonomyData();
// generateTranformedData();
