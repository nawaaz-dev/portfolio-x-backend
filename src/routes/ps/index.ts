import { Router, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { createPsData } from "./ps-utils";
import { generateShopifyCSV, prepareShopifyData } from "../handlers/shopify";
import workspaceRouter from "./workspace/workspace";

const router = Router();

/* GET home page. */
router.get("/data", (req: Request, res: Response) => {
  const dataDirPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "data",
    "1-ce71d5"
  );
  const rawFilePath = path.join(dataDirPath, "raw.json");
  const psFilePath = path.join(dataDirPath, "ps.json");

  try {
    if (!fs.existsSync(rawFilePath)) {
      return res.json({ data: [] });
    }

    const rawData = JSON.parse(
      fs.readFileSync(rawFilePath, { encoding: "utf-8" })
    );

    let psData: any = [];

    if (!fs.existsSync(psFilePath)) {
      psData = createPsData(
        rawData.data,
        "http://localhost:3000/assets/images"
      );
    } else {
      psData = JSON.parse(fs.readFileSync(psFilePath, { encoding: "utf-8" }));
    }

    fs.writeFileSync(psFilePath, JSON.stringify(psData, null, 2), {
      encoding: "utf-8",
    });

    return res.json({ data: psData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/data/update-product", (req: Request, res: Response) => {
  const dataDirPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "data",
    "1-ce71d5"
  );
  const psFilePath = path.join(dataDirPath, "ps.json");
  const psData = JSON.parse(fs.readFileSync(psFilePath, { encoding: "utf-8" }));

  try {
    const data = req.body;
    const productIndex = psData.findIndex((item: any) => item.id === data.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    psData[productIndex] = data;
    fs.writeFileSync(psFilePath, JSON.stringify(psData, null, 2), {
      encoding: "utf-8",
    });
    return res.json({ data: "Product updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/data/download-csv", async (req: Request, res: Response) => {
  const dataDirPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "data",
    "1-ce71d5"
  );
  const psFilePath = path.join(dataDirPath, "ps.json");
  const psData = JSON.parse(fs.readFileSync(psFilePath, { encoding: "utf-8" }));
  const selectedData = psData
    .reduce((acc: any, item: any) => {
      const selectedVariants = item.variants;

      if (selectedVariants.length) {
        acc.push({
          ...item,
          variants: selectedVariants,
        });
      }

      return acc;
    }, [] as any[])
    .splice(0, 5);

  console.log("selectedData", selectedData);

  const { error: shopifyPrepareError, data: shopifyData } =
    await prepareShopifyData(selectedData);
  if (shopifyPrepareError) {
    return res.status(500).json({ message: "Error preparing data" });
  }

  const tempStoreDirPath = path.join(__dirname, "..", "..", "..", "temp");
  if (!fs.existsSync(tempStoreDirPath)) {
    fs.mkdirSync(tempStoreDirPath, { recursive: true });
  }
  const tempStorePath = path.join(tempStoreDirPath, "shopify.csv");
  const { error: generateCSVError } = await generateShopifyCSV(
    shopifyData,
    tempStorePath
  );

  if (generateCSVError) {
    return res.status(500).json({ message: "Error generating CSV" });
  }

  res.download(tempStorePath, "shopify.csv", (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error downloading the file" });
    }
  });

  // fs.unlinkSync(tempStorePath);
});

router.use("/workspace", workspaceRouter);

// fetch("http://localhost:3000/ps/data/download-csv")
//   // .then((res) => res.json())
//   // .then((res) => console.log(res.data[0].variants[0].images))
//   .catch(console.error);

export default router;
