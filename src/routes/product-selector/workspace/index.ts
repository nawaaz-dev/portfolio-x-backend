import { Router, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import {
  createWorkspaceId,
  getWorkspaceData,
  getWorkspaceDeletedData,
  getWorkspaceDirStats,
  saveWorkspaceDeletedData,
} from "./workspace.util";
import { getFinalProductData } from "../product-selector.utils";
import { PSProduct, PSWorkspace } from "yourders-types";
import { getPaths } from "src/config/path";

const workspaceRouter = Router();
const paths = getPaths("..", "..", "..", "..");

/**
 * Get workspace list
 */
workspaceRouter.get("/list", (req: Request, res: Response) => {
  const { withData } = req.query;

  try {
    if (!fs.existsSync(paths.dir.workspaceList)) {
      return fs.mkdirSync(paths.dir.workspaceList, { recursive: true });
    }

    const workspaces = fs.readdirSync(paths.dir.workspaceList);

    console.log("workspaces", workspaces, paths.dir.workspaceList);
    const deletedWrkspaces = getWorkspaceDeletedData(paths);
    const filteredWorkspaces = workspaces.filter(
      (workspace) => !deletedWrkspaces.data.includes(workspace.split(".")[0])
    );
    const data = filteredWorkspaces.map((workspace) => {
      try {
        const workspacePath = path.join(paths.dir.workspaceList, workspace);
        const data = JSON.parse(
          fs.readFileSync(workspacePath, { encoding: "utf-8" })
        ) as PSWorkspace;

        return {
          ...data,
          data: withData ? data.productIds : [],
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    console.log(data);

    return res.json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * Create workspace
 */
type CreateWorkspaceRequest = Request<
  {},
  {},
  {
    workspaceName: string;
    productIds: PSProduct["id"][];
  }
>;
type CreateWorkspaceResponse = Response<{
  error?: string;
  message?: string;
  data?: Partial<PSWorkspace>;
}>;

workspaceRouter.post(
  "/create",
  (req: CreateWorkspaceRequest, res: CreateWorkspaceResponse) => {
    const { workspaceName, productIds } = req.body;
    console.log(workspaceName);

    if (!workspaceName) {
      return res.status(400).json({ error: "workspaceName is required" });
    }

    if (!productIds?.length) {
      return res.status(400).json({ error: "data is required" });
    }

    try {
      if (!fs.existsSync(paths.dir.workspaceList)) {
        fs.mkdirSync(paths.dir.workspaceList, { recursive: true });
      }

      const workspaceDirStats = getWorkspaceDirStats(paths);
      const workspaceId = createWorkspaceId(
        workspaceDirStats.nextWorkspaceSequnce,
        workspaceName
      );
      const workspace: PSWorkspace = {
        id: workspaceId,
        name: workspaceName,
        productIds,
        products: [],
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toDateString(),
      };

      fs.writeFileSync(
        paths.file.workspaceData(workspaceId),
        JSON.stringify(workspace, null, 2),
        {
          encoding: "utf-8",
        }
      );

      return res.json({ message: "workspace created", data: workspace });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * Get workspace
 */
type GetWorkspaceRequest = Request<{ workspaceId: string }>;
type GetWorkspaceResponse = Response<{
  error?: string;
  data?: PSWorkspace;
}>;
workspaceRouter.get(
  "/:workspaceId",
  (req: GetWorkspaceRequest, res: GetWorkspaceResponse) => {
    const { workspaceId } = req.params;
    const workspacePath = path.join(
      paths.dir.workspaceList,
      `${workspaceId}.json`
    );
    const deletedWorkspaceData = getWorkspaceDeletedData(paths);

    console.log("deletedWorkspaceData", deletedWorkspaceData);

    if (deletedWorkspaceData.data.includes(workspaceId)) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    try {
      const workspaceData = JSON.parse(
        fs.readFileSync(workspacePath, { encoding: "utf-8" })
      ) as PSWorkspace;
      const consolidatedData = getFinalProductData(paths);
      console.log("consolidatedData", consolidatedData);

      const products = consolidatedData.filter((product) =>
        workspaceData.productIds.includes(product.id)
      );

      delete (workspaceData as any).productIds;

      return res.json({
        data: { ...workspaceData, products },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Failed to load workspace. Invalid workspace ID: " + workspaceId,
      });
    }
  }
);

/**
 * Update workspace
 */
workspaceRouter.put("/:workspaceId", (req: Request, res: Response) => {
  res.json({ title: "Extractor!" });
});

/**
 * Delete workspace
 */
workspaceRouter.delete("/:workspaceId", (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const deletedWorkspaceData = saveWorkspaceDeletedData(paths, workspaceId);

  if (deletedWorkspaceData.error) {
    return res.status(500).json({ error: deletedWorkspaceData.error });
  }

  const workspace = getWorkspaceData(paths, workspaceId);

  return res.json({
    message: `Workspace ${workspace.data?.name} deleted successfully`,
  });
});

export default workspaceRouter;
