import { Router } from "express";
import * as fs from "fs";
import * as path from "path";
import { AppRequest, AppResponse } from "src/types/routes";
import { getPaths } from "src/config/path";
import { getConsolidatedData, transformRawData } from "./utils";

const datasetRouter = Router();
const paths = getPaths("..", "..");

datasetRouter.post(
  "/create",
  async (
    req: AppRequest<{ body: { sessionIds: string[] } }>,
    res: AppResponse
  ) => {
    const { sessionIds } = req.body;
    const { error: consolidatedDataError, data: consolidateData } =
      getConsolidatedData(paths, sessionIds);

    if (consolidatedDataError || !consolidateData) {
      return res.status(500).json({
        error: true,
        data: null,
        message: consolidatedDataError,
      });
    }

    const transformedData = transformRawData(consolidateData);

    fs.writeFileSync(
      paths.file.allProductsData,
      JSON.stringify(transformedData, null, 2)
    );

    return res.json({
      error: false,
      data: consolidateData,
      message: "Dataset data created",
    });
  }
);

const createDataset = async () => {
  fetch("http://localhost:3000/api/dataset/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionIds: ["10-f4dbad", "11-5ef79d", "12-b51633"],
    }),
  })
    .then((res) => res.json())
    .then(console.log)
    .catch(console.error);
};

// createDataset();

export default datasetRouter;
