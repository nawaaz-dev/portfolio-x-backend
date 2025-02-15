import { AppRequest, AppResponse } from "src/types/routes";
import { PSProduct } from "yourders-types";
import {
  createProduct as createProductUtil,
  updateProduct as updateProductUtil,
  deleteProduct as deleteProductUtil,
  getFinalProductData,
} from "../product-selector.utils";
import { getPaths } from "src/config/path";
import {
  getAllWorkspaceData,
  updateWorkspace,
} from "../workspace/workspace.util";

const paths = getPaths("..", "..", "..", "..");

const listProducts = (_: AppRequest, res: AppResponse<PSProduct[]>) => {
  const data = getFinalProductData(paths);
  return res.json({ error: false, data, message: "Success" });
};

const createProduct = (
  req: AppRequest<{ body: { product: PSProduct; workspaceId: string } }>,
  res: AppResponse<PSProduct>
) => {
  const { product, workspaceId } = req.body;

  if (!product) {
    return res
      .status(400)
      .json({ error: true, data: null, message: "Product is required" });
  }

  const { error: productCreateError, data } = createProductUtil(paths, product);

  if (productCreateError) {
    return res
      .status(500)
      .json({ error: true, data: null, message: productCreateError });
  }

  // Add product to workspace only if workspaceId is provided
  if (workspaceId) {
    const { error, data: allworkspaceData } = getAllWorkspaceData(paths);

    if (error) {
      return res.status(500).json({ error: true, data: null, message: error });
    }

    if (!allworkspaceData) {
      return res
        .status(404)
        .json({ error: true, data: null, message: "Workspace not found" });
    }

    const workspace = allworkspaceData.find(
      (workspace) => workspace.id === workspaceId
    );

    if (!workspace) {
      return res
        .status(404)
        .json({ error: true, data: null, message: "Workspace not found" });
    }
    workspace.productIds.push(data!.id);

    const { error: workspaceUpdateError } = updateWorkspace(paths, workspace);

    if (workspaceUpdateError) {
      return res
        .status(500)
        .json({ error: true, message: workspaceUpdateError, data: null });
    }
  }

  return res.json({
    error: false,
    data: null,
    message: "Product created successfully",
  });
};

const updateProduct = (
  req: AppRequest<{
    params: { productId: string };
    body: { product: PSProduct };
  }>,
  res: AppResponse
) => {
  const { productId } = req.params;
  const { product } = req.body;

  if (!productId) {
    return res
      .status(400)
      .json({ error: true, data: null, message: "Product id is required" });
  }

  const { error, data } = updateProductUtil(paths, product);

  if (error) {
    return res.status(500).json({ error: true, data: null, message: error });
  }

  return res.json({
    error: false,
    data,
    message: "Product updated successfully",
  });
};

const deleteProduct = (
  req: AppRequest<{ params: { productId: string } }>,
  res: AppResponse
) => {
  const { productId } = req.params;

  const { error } = deleteProductUtil(paths, productId);

  if (error) {
    return res.status(500).json({ error: true, data: null, message: error });
  }

  return res.json({
    error: false,
    data: null,
    message: "Product deleted successfully",
  });
};

const getProduct = (
  req: AppRequest<{ params: { productId: string } }>,
  res: AppResponse<PSProduct>
) => {
  const { productId } = req.params;
  const products = getFinalProductData(paths);
  const product = products.find((product) => product.id === productId);

  if (!product) {
    return res
      .status(404)
      .json({ error: true, message: "Product not found", data: null });
  }

  return res.json({ error: false, data: product, message: "Success" });
};

const productCrudHandlers = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
};

export default productCrudHandlers;
