import { type BinaryLike, createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "path";

export function sha256sum(data: BinaryLike) {
  return createHash("sha256").update(data).digest("hex");
}

export const listFiles = () =>
  fs.readdirSync(path.join(__dirname, "..", "../.."), { withFileTypes: true });
