import fs from "fs";
import { RawDataItem, SessionData } from "src/types/data";
import { DirectoryFilePaths } from "../../product-selector/product-selector.types";

export const getConsolidatedData = (
  paths: DirectoryFilePaths,
  sessionIds: string[]
) => {
  let rawDatas: RawDataItem[][] = [];
  const consolidateFilename = paths.file.rawConsolidated(sessionIds.join("_"));

  if (fs.existsSync(consolidateFilename)) {
    try {
      return {
        error: null,
        data: JSON.parse(
          fs.readFileSync(consolidateFilename, "utf-8")
        ) as RawDataItem[],
      };
    } catch (error) {
      return {
        error: `Error reading consolidated data: ${(error as Error).message}`,
        data: null,
      };
    }
  }

  for (const element of sessionIds) {
    const sessionId = element;
    const rawFilePath = paths.file.raw(sessionId);
    console.log("rawFilePath", rawFilePath);

    if (!fs.existsSync(rawFilePath)) {
      return {
        error: `Raw data not found for session ${sessionId}`,
        data: null,
      };
    }

    try {
      const rawData = fs.readFileSync(rawFilePath, "utf-8");
      rawDatas.push((JSON.parse(rawData) as SessionData).data);
    } catch (error) {
      return {
        error: `Error reading raw data for session ${sessionId}: ${(error as Error).message}`,
        data: null,
      };
    }
  }

  const consolidatedData = rawDatas.reduce<RawDataItem[]>((acc, rawData) => {
    if (!rawData) return acc;
    return [...acc, ...rawData];
  }, []);

  const uniqueConsolidatedData = consolidatedData.reduce<RawDataItem[]>(
    (acc, data) => {
      if (!acc.find((d) => d.name === data.name)) {
        return [...acc, data];
      }
      return acc;
    },
    []
  );

  fs.writeFileSync(
    consolidateFilename,
    JSON.stringify(uniqueConsolidatedData, null, 2)
  );

  return {
    error: "",
    data: uniqueConsolidatedData,
  };
};
