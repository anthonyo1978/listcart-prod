import fs from "fs";

export function applyPatch({ file, replace, with: replacement }) {
  const content = fs.readFileSync(file, "utf8");

  if (!content.includes(replace)) {
    throw new Error(`Patch failed: block not found in ${file}`);
  }

  const updated = content.replace(replace, replacement);
  fs.writeFileSync(file, updated, "utf8");

  console.log(`Patched: ${file}`);
}
