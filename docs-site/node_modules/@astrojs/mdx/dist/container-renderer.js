function getContainerRenderer() {
  return {
    name: "astro:jsx",
    serverEntrypoint: "@astrojs/mdx/server.js"
  };
}
export {
  getContainerRenderer
};
