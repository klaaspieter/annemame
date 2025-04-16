import matter from "gray-matter";
import { glob } from "glob";
import fs from "node:fs/promises";
import { DateTime } from "luxon";

const files = await glob("./src/blog/*.md");

for (const file of files) {
  const post = matter.read(file);
  console.log("fixing:", post.path);

  const postData = post.data;

  if (postData["layout"]) {
    console.log("removing layout", postData["layout"]);
    delete postData["layout"];
  }

  const date = postData["date"];
  if (date) {
    const newDate = DateTime.fromFormat(date, "yyyy-MM-dd HH:mm:ss").toISO();
    postData["date"] = newDate;
  }

  console.log("new frontmatter:", postData);

  const newPost = matter.stringify(post.content, postData);

  await fs.writeFile(post.path, newPost);
}
