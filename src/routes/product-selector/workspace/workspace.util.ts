import * as fs from "fs";
import * as path from "path";
import { PSWorkspace } from "yourders-types";
import { DirectoryFilePaths } from "../product-selector.types";

/**
 * 1. Get list of workspaces including the workspace
 *
 */
export const getWorkspaceDirStats = (
  paths: DirectoryFilePaths
): {
  count: number;
  lastWorkspaceSequence: number;
  nextWorkspaceSequnce: number;
  workspaceFilenames: string[];
} => {
  const workspaceFilenames = fs.readdirSync(paths.dir.workspaceList);
  const workspaceSequences = workspaceFilenames.length
    ? workspaceFilenames.map((filename) =>
        parseInt(filename.split("_")[0].split("v")[1])
      )
    : [0];

  return {
    count: workspaceFilenames.length,
    lastWorkspaceSequence: Math.max(...workspaceSequences),
    nextWorkspaceSequnce: Math.max(...workspaceSequences) + 1,
    workspaceFilenames,
  };
};

export const createWorkspaceId = (sequence: number, workspaceName: string) => {
  return `v${sequence}_${workspaceName}`;
};

export const getWorkspaceData = (
  paths: DirectoryFilePaths,
  workspaceId: string
) => {
  try {
    const workspaceData = JSON.parse(
      fs.readFileSync(paths.file.workspaceData(workspaceId), {
        encoding: "utf-8",
      })
    ) as PSWorkspace;

    return { data: workspaceData, error: null };
  } catch (error) {
    return { error: (error as Error).message, data: null };
  }
};

export const getAllWorkspaceData = (paths: DirectoryFilePaths) => {
  try {
    const workspaces = fs.readdirSync(paths.dir.workspaceList);
    const data = workspaces.map((workspace) => {
      try {
        const workspacePath = path.join(paths.dir.workspaceList, workspace);
        const data = JSON.parse(
          fs.readFileSync(workspacePath, { encoding: "utf-8" })
        ) as PSWorkspace;

        return data;
      } catch (error) {
        console.error(error);
        throw new Error((error as Error).message);
      }
    });

    return { data, error: null };
  } catch (error) {
    return { error: (error as Error).message, data: null };
  }
};

export function getWorkspaceDeletedData(paths: DirectoryFilePaths) {
  if (!fs.existsSync(paths.file.workspaceDeletedData)) {
    fs.writeFileSync(paths.file.workspaceDeletedData, JSON.stringify([]));
    return { data: [] as string[], error: null };
  }

  try {
    const deleteWorkspaceData = JSON.parse(
      fs.readFileSync(paths.file.workspaceDeletedData, { encoding: "utf-8" })
    ) as string[];

    return { data: deleteWorkspaceData, error: null };
  } catch (error) {
    return { error: (error as Error).message, data: [] as string[] };
  }
}

export const saveWorkspaceDeletedData = (
  paths: DirectoryFilePaths,
  workspaceId: string
) => {
  try {
    const { error, data } = getWorkspaceDeletedData(paths);
    if (error) {
      return { error, data: null };
    } else if (!data) {
      return { error: "No data found", data: null };
    }

    if (data.includes(workspaceId)) {
      return { error: "Workspace already deleted", data: null };
    }

    const updatedDeleteWorkspaceData = [...data, workspaceId];

    fs.writeFileSync(
      // deletedWorkspaceDataPath,
      paths.file.workspaceDeletedData,
      JSON.stringify(updatedDeleteWorkspaceData, null, 2)
    );

    return { data: updatedDeleteWorkspaceData };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getFinalWorkspaceById = (
  paths: DirectoryFilePaths,
  workspaceId: string
) => {
  const deletedWorkspaceData = getWorkspaceDeletedData(paths);

  if (deletedWorkspaceData.data.includes(workspaceId)) {
    return { error: "Workspace not found", data: null };
  }

  return getWorkspaceData(paths, workspaceId);
};

export const updateWorkspace = (
  paths: DirectoryFilePaths,
  workspace: PSWorkspace
) => {
  try {
    const workspacePath = path.join(
      paths.dir.workspaceList,
      `${workspace.id}.json`
    );

    fs.writeFileSync(workspacePath, JSON.stringify(workspace, null, 2), {
      encoding: "utf-8",
    });

    return { data: workspace, error: null };
  } catch (error) {
    return { error: (error as Error).message, data: null };
  }
};
