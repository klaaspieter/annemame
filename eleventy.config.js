export default async function (eleventyConfig) {
  eleventyConfig.addBundle("css");

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
