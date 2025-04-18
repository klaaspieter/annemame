import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addBundle("css", {
    transforms: [
      async function (content) {
        if (isCSSNakedDay()) {
          return "";
        }

        return content;
      },
    ],
  });
  eleventyConfig.addGlobalData("isCSSNakedDay", isCSSNakedDay());

  eleventyConfig.addBundle("js");

  eleventyConfig.addPassthroughCopy({
    "./src/public/": "/",
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
}

function isCSSNakedDay() {
  const now = Date.now();
  const currentYear = new Date().getFullYear();
  const startEpoch = new Date(`${currentYear}-04-09T00:00:00+1400`).getTime();
  const endEpoch = new Date(`${currentYear}-04-09T23:59:59-1200`).getTime();

  return startEpoch <= now && now <= endEpoch;
}
