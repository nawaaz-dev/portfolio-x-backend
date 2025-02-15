import { Router, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { RawDataItem } from "../../types/data";
import { generateShopifyCSV, prepareShopifyData } from "src/utils/shopify";
import ScrapperModel from "src/db/schemas/scrapper/raw/raw";
import { getPaths } from "src/config/path";

const scrapperRouter = Router();
const paths = getPaths("..", "..");

type Data = {
  payload: RawDataItem[];
};

type CreateSessionRequest = Request<{}, {}, {}>;
type CreateSessionResponse = Response<{
  data: {
    sessionId: string;
  };
}>;

scrapperRouter.get(
  "/create-session",
  (req: CreateSessionRequest, res: CreateSessionResponse) => {
    const sessionIdHash = Math.random().toString(16).slice(2, 8);
    // count the number of directories in the data folder, use this for sequencing
    const count = fs.readdirSync(paths.dir.raw).length;
    const sessionId = `${count + 1}-${sessionIdHash}`;
    res.json({ data: { sessionId } });
  }
);

type ExportRequest = Request<{ sessionId: string }, {}, Data>;
type ExportResponse = Response<{ message: string }>;

scrapperRouter.post(
  "/export/:sessionId",
  (req: ExportRequest, res: ExportResponse) => {
    const { sessionId } = req.params;
    try {
      const data = req.body as Data;
      const dirPath = path.join(paths.dir.raw, sessionId);
      const filePath = path.join(dirPath, "raw.json");
      let existingData: any = [];

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        existingData = [];
      } else {
        existingData = JSON.parse(
          fs.readFileSync(filePath, { encoding: "utf-8" })
        ).data;
      }

      const newData = {
        data: [...existingData, ...data.payload],
        lastUpdated: new Date().toISOString(),
      };

      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), {
        encoding: "utf-8",
      });

      res.json({ message: "Data received" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error" + (error as Error).message });
    }
  }
);

scrapperRouter.get(
  "/shopify/:sessionId",
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const currentDirPath = path.join(paths.dir.raw, sessionId);
    const filePath = path.join(currentDirPath, "raw.json");

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Data not found" });
    }

    const data = JSON.parse(
      fs.readFileSync(filePath, { encoding: "utf-8" })
    ).data;

    const { error: shopifyPrepareError, data: shopifyData } =
      await prepareShopifyData(data.slice(0, 10));
    if (shopifyPrepareError) {
      return res.status(500).json({ message: "Error preparing data" });
    }

    const storePath = path.join(currentDirPath, "shopify.csv");
    const { error: generateCSVError } = await generateShopifyCSV(
      shopifyData as any,
      storePath
    );
    if (generateCSVError) {
      return res.status(500).json({ message: "Error generating CSV" });
    }

    res.download(storePath, "shopify.csv", (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error downloading the file" });
      }
    });
  }
);

type ExportEndRequest = Request<{ sessionId: string }>;
type ExportEndResponse = Response<{ message: string }>;

scrapperRouter.get(
  "/export-end/:sessionId",
  async (req: ExportEndRequest, res: ExportEndResponse) => {
    const { sessionId } = req.params;
    const currentDirPath = path.join(paths.dir.raw, sessionId);
    const filePath = path.join(currentDirPath, "raw.json");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Data not found" });
    }

    // await downloadAndStoreImages(currentDirPath, filePath);

    res.json({ message: "Export completed" });
  }
);

scrapperRouter.get("/db-test", async (req: Request, res: Response) => {
  // Create a new scrapper item
  try {
    const items = await ScrapperModel.find({});
    console.log(ScrapperModel.db.collections);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching items" });
  }
});

export default scrapperRouter;
