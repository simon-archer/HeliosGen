import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [providers, imageRoute, videoRoute, sidebar] = await Promise.all([
  readFile(new URL("../lib/providers.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/api/generate/route.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/api/generate-video/route.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/AppSidebar.tsx", import.meta.url), "utf8"),
]);

assert.match(providers, /"gpt-image-2-5-sunburst"[\s\S]*"minimax-h3"/);
assert.match(imageRoute, /openai\/gpt-image-2\.5\/\$\{variant\}/);
assert.match(videoRoute, /minimax\/h3-max\/\$\{imageUrl/);
assert.match(sidebar, /!kie\.hasToken && fal\.hasToken[\s\S]*"minimax-h3"/);
console.log("fal.ai provider routes are wired");
