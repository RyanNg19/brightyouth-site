# BrightYouth static website

All six pages are static HTML. No build step is needed.

## GitHub Pages

Extract the site ZIP. Upload the HTML, CSS, app.js, and the complete assets folder to the root of the repository used by GitHub Pages. Keep the folder structure intact; do not flatten the photos into the repository root.

The event and portrait photos used by the pages are in assets/optimized/. The supplied originals remain in assets/events/ and assets/team/.

For a repository named brightyouth-site, the Home URL ends with /brightyouth-site/index.html. All page links and local image paths are relative, so they also work under that repository prefix.

Preserve exact filename capitalization. If an image returns 404, compare its URL to the file's location in the repository. For example, assets/optimized/2025-lunar-community-960.jpg must be uploaded at that exact nested path.

## Preview

From the extracted folder, run: python -m http.server 4173

Open http://127.0.0.1:4173/index.html. Fonts, GSAP, and the retained Forever Love stock photo need an internet connection. If animation scripts are unavailable, navigation and page content remain usable.

Publishing is a separate step and has not been performed by this remodel.
