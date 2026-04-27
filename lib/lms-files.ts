import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAppEnv } from "@/lib/env";

export type StoredFile = {
  absolutePath: string;
  relativePath: string;
  fileName: string;
};

async function ensureDirectory(dir: string) {
  await mkdir(dir, { recursive: true });
}

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

export async function saveBufferToUploads(
  directory: "paymentProofDir" | "certificateDir" | "courseAssetDir",
  fileName: string,
  buffer: Buffer,
) {
  const env = getAppEnv();
  const rootDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), env.uploadRoot);
  const targetDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), env[directory]);
  await ensureDirectory(targetDir);
  const safeName = sanitizeFileName(fileName);
  const absolutePath = path.join(targetDir, safeName);
  await writeFile(absolutePath, buffer);
  const relativePath = path.relative(rootDir, absolutePath).replaceAll("\\", "/");

  return {
    absolutePath,
    relativePath,
    fileName: safeName,
  } satisfies StoredFile;
}

export function getDownloadUrl(relativePath: string) {
  return `/api/lms/files?path=${encodeURIComponent(relativePath)}`;
}
