import { Router } from "express";
import productCrudHandlers from "./crud";
import { exportShopify } from "./shopify";
import productRoughRouter from "./rough";

const productRouter = Router();

/**
 * Get global product list
 */
productRouter.get("/list", productCrudHandlers.listProducts);

/**
 * Create global product
 */
productRouter.post("/create", productCrudHandlers.createProduct);

/**
 * Update global product
 */
productRouter.put("/:productId", productCrudHandlers.updateProduct);

/**
 * Delete global product
 */
productRouter.delete("/:productId", productCrudHandlers.deleteProduct);

/**
 * Get global product
 */
productRouter.get("/:productId", productCrudHandlers.getProduct);

/**
 * Export Shopify CSV
 */
productRouter.post("/export/shopify", exportShopify);

/**
 * Rough
 */
productRouter.use("/rough", productRoughRouter);

export default productRouter;
