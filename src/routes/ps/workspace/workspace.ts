import { Router, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { createWorkspaceId, getWorkspaceDirStats } from "./workspace.util";
import { TWorkspace } from "./workspace.types";

const workspaceouter = Router();

const datasetId = "1-ce71d5";

// Get workspace list
workspaceouter.get("/list", (req: Request, res: Response) => {
  const { withData } = req.query;
  const dataDirPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "data",
    datasetId
  );

  const workspaceDirPath = path.join(dataDirPath, "workspaces");

  try {
    if (!fs.existsSync(workspaceDirPath)) {
      return fs.mkdirSync(workspaceDirPath);
    }

    const workspaces = fs.readdirSync(workspaceDirPath);
    const data = workspaces.map((workspace) => {
      try {
        const workspacePath = path.join(workspaceDirPath, workspace);
        const data = JSON.parse(
          fs.readFileSync(workspacePath, { encoding: "utf-8" })
        ) as TWorkspace;

        return {
          ...data,
          data: withData ? data.data : [],
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

workspaceouter.get("/:workspaceId", (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const dataDirPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "data",
    datasetId
  );

  const workspaceDirPath = path.join(dataDirPath, "workspaces");

  try {
    const workspacePath = path.join(workspaceDirPath, `${workspaceId}.json`);
    const data = fs.readFileSync(workspacePath, { encoding: "utf-8" });

    console.log(workspaceId);

    return res.json({
      data: JSON.parse(data),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to load workspace. Invalid workspace ID: " + workspaceId,
    });
  }
});

// Create a new workspace
workspaceouter.post("/create", (req: Request, res: Response) => {
  const { workspaceName, data } = req.body;
  console.log(workspaceName);

  if (!workspaceName) {
    return res.status(400).json({ error: "workspaceName is required" });
  }

  if (!data) {
    return res.status(400).json({ error: "data is required" });
  }

  const dataDirPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "data",
    datasetId
  );

  const workspaceDirPath = path.join(dataDirPath, "workspaces");

  try {
    if (!fs.existsSync(workspaceDirPath)) {
      fs.mkdirSync(workspaceDirPath, { recursive: true });
    }

    const workspaceDirStats = getWorkspaceDirStats(workspaceDirPath);
    console.log(workspaceDirStats);
    const workspaceId = createWorkspaceId(
      workspaceDirStats.nextWorkspaceSequnce,
      workspaceName
    );
    console.log(workspaceId, workspaceDirStats);
    const workspace = {
      workspaceId,
      workspaceName,
      data,
      dateCreated: new Date().toISOString(),
      dateModified: new Date(),
    };
    const workspacePath = path.join(workspaceDirPath, `${workspaceId}.json`);

    fs.writeFileSync(workspacePath, JSON.stringify(workspace, null, 2), {
      encoding: "utf-8",
    });

    return res.json({ message: "workspace created", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default workspaceouter;

// fetch("http://localhost:3000/ps/workspace/list")
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// fetch("http://localhost:3000/ps/workspace/create", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     workspaceName: "test-workspace",
//     data: {},
//   }),
// }).catch((error) => {
//   console.error(error);
// });

// fetch("http://localhost:3000/ps/workspace/v1_first-data")
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   });
