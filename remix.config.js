/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    v2_meta: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true
  },
  publicPath: "/build/",
  serverBuildPath: ".netlify/functions-internal/server.js",
  // serverConditions: ["deno, worker"],
  // serverMainFields: ["main, module"],
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  serverMinify: false,
};
