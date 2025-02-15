import * as path from "path";
import * as fs from "fs";
import request from "request";

export async function downloadAndStoreImages(
  dirPath: string,
  filePath: string
) {
  /**
   * Once the export is done, the client will send a request to this endpoint.
   * This will trigger the preprocessing of the data.
   * Pre-processing includes:
   * - Downloading images for each variant of the product.
   * - Updating the products to include the image file paths.
   * - Creating a CSV file containing the product data.
   */

  if (!fs.existsSync(filePath)) {
    throw new Error("Data not found");
  }

  console.log("************", filePath);

  const data = JSON.parse(
    fs.readFileSync(filePath, { encoding: "utf-8" })
  ).data;

  for (const product of data) {
    for (const variant of product.variants) {
      const urls = variant.images || [];
      variant.imagePath = {};

      for (const url of urls) {
        const assetDirPath = path.join(dirPath, "assets/images");
        const fileName = url.split("/").pop();
        const filePath = path.join(assetDirPath, fileName);

        if (!fs.existsSync(assetDirPath)) {
          fs.mkdirSync(assetDirPath, { recursive: true });
        }

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        try {
          console.log("Downloading image", url);
          await downloadImages(url, filePath);
          variant.imagePath[url] = filePath;
        } catch (error) {
          console.error(error);
          throw new Error("Download failed");
        }
      }
    }
  }

  fs.writeFileSync(
    path.join(dirPath, "stage-1.json"),
    JSON.stringify(data, null, 2),
    {
      encoding: "utf-8",
    }
  );
}

function downloadImages(url: string, filePath: string) {
  /**
   * This function will download images for each variant of the product.
   */
  return new Promise<void>((resolve, reject) => {
    request(url)
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
