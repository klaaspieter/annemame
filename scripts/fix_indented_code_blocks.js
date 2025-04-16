import matter from "gray-matter";
import { glob } from "glob";
import fs from "node:fs/promises";

import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import { unified } from "unified";

const files = await glob("./src/blog/*.md");

for (const file of files) {
  const markdown = await fs.readFile(files[0], "utf8");

  const newMarkdown = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkStringify)
    .process(markdown);

  await fs.writeFile(file, String(newMarkdown));
}
