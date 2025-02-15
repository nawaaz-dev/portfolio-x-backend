import { Router, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { prepareShopifyData, generateShopifyCSV } from "./handlers/shopify";
import { RawDataItem } from "../types/data";
import { downloadAndStoreImages } from "./handlers/other";

const router = Router();
const dataDirPath = path.join(__dirname, "..", "..", "data");
const rawDirPath = path.join(dataDirPath, "raw");

/* GET home page. */
router.get("/", (req: Request, res: Response) => {
  res.json({ title: "Extractor!" });
});

type Data = {
  sessionId: string;
  payload: any;
};

router.get("/create-session", (req: Request, res: Response) => {
  const sessionIdHash = Math.random().toString(16).slice(2, 8);
  // count the number of directories in the data folder, use this for sequencing
  const count = fs.readdirSync(dataDirPath).length;
  // const sessionId = `${count}-${sessionIdHash}`;
  const sessionId = sessionIdHash;
  res.json({ sessionId });
});

router.post("/export", (req: Request, res: Response) => {
  try {
    const data = req.body as Data;
    const dirPath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "raw",
      data.sessionId
    );
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
});

router.get("/shopify/:sessionId", async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const currentDirPath = path.join(rawDirPath, sessionId);
  const filePath = path.join(currentDirPath, "raw.json");

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Data not found" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }))
    .data as RawDataItem[];

  const { error: shopifyPrepareError, data: shopifyData } =
    await prepareShopifyData(data.slice(0, 10));
  if (shopifyPrepareError) {
    return res.status(500).json({ message: "Error preparing data" });
  }

  const storePath = path.join(currentDirPath, "shopify.csv");
  const { error: generateCSVError } = await generateShopifyCSV(
    shopifyData,
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
});

router.post("/end-export", async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const currentDirPath = path.join(rawDirPath, sessionId);
  const filePath = path.join(currentDirPath, "raw.json");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Data not found" });
  }

  // const data = JSON.parse(
  //   fs.readFileSync(filePath, { encoding: "utf-8" })
  // ).data;

  await downloadAndStoreImages(currentDirPath, filePath);

  res.json({ message: "Export completed" });
});

// fetch("http://localhost:3000/end-export", {
//   method: "POST",
//   body: JSON.stringify({ sessionId: "ce71d5" }),
//   headers: {
//     "content-type": "application/json",
//   },
// })
//   .then((res) => res.json(), console.log)
//   .catch(console.error);

export default router;
