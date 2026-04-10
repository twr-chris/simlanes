const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  // Parse YAML data files
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", function (date, format) {
    const d = new Date(date);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if (format === "iso") return d.toISOString().split("T")[0];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  });

  // Guides collection
  eleventyConfig.addCollection("guides", function (collectionApi) {
    return collectionApi.getFilteredByGlob("guides/*.md");
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["md", "html", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
