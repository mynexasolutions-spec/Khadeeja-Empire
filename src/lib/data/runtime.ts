import { LOCAL_DATA_DIRECTORY, LOCAL_DATA_FILE } from "./local-store";

export const localRuntime = {
  directory: LOCAL_DATA_DIRECTORY,
  file: LOCAL_DATA_FILE,
  public: false,
} as const;

export function getLocalRuntimePath(): string {
  return LOCAL_DATA_FILE;
}
