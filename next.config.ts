import type { NextConfig } from "next";

/**
 * GitHub Pages serves plain static files, so the site is exported to
 * HTML rather than run as a Node server.
 *
 * A *project* Pages site is served from a subpath —
 * https://vijay951997.github.io/Fitness-website/ — so every internal
 * link and asset URL has to be prefixed with the repository name.
 * The workflow sets GITHUB_PAGES=true; local `npm run dev` leaves it
 * unset so the site still runs at http://localhost:3000/ with no prefix.
 *
 * If you later point a custom domain at the site (e.g. fitwithvijay.in),
 * the domain serves from the root — delete the GITHUB_PAGES env line in
 * .github/workflows/deploy.yml so basePath goes back to "".
 */
const repository = "Fitness-website";
const isProjectPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProjectPages ? `/${repository}` : "",
  assetPrefix: isProjectPages ? `/${repository}/` : undefined,
  trailingSlash: true,
  // The static export has no image optimisation server.
  images: { unoptimized: true },
  // basePath rewrites next/link and next/image, but NOT raw paths inside
  // CSS url() or style attributes. Components that build such a URL read
  // this value and prefix it themselves — see components/Portrait.tsx.
  env: { NEXT_PUBLIC_BASE_PATH: isProjectPages ? `/${repository}` : "" },
};

export default nextConfig;
