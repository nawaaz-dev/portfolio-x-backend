import { Router } from "express";
import productRouter from "./product";
import workspaceRouter from "./workspace";

const productSelectorRouter = Router();

/**
 * Product routes
 */
productSelectorRouter.use("/product", productRouter);

/**
 * Workspace product routes
 */
productSelectorRouter.use("/workspace", workspaceRouter);

export default productSelectorRouter;
