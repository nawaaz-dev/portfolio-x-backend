import * as fs from "fs";

/**
 * 1. Get list of workspaces including the workspace
 *
 */
export const getWorkspaceDirStats = (
  workspaceDirPath: string
): {
  count: number;
  lastWorkspaceSequence: number;
  nextWorkspaceSequnce: number;
  workspaceFilenames: string[];
} => {
  const workspaceFilenames = fs.readdirSync(workspaceDirPath);
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
