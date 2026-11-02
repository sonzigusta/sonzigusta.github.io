const output = "_site";
const pages: string[] = [];
function walk(dir: string) { for (const e of Deno.readDirSync(dir)) { const p = `${dir}/${e.name}`; if (e.isDirectory) walk(p); else if (e.name.endsWith(".html")) pages.push(p); } }
walk(output);
const missing: string[] = [];
for (const page of pages) {
  const html = Deno.readTextFileSync(page);
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const link = match[1].replaceAll("&amp;", "&");
    if (/^(?:[a-z]+:|\/\/|#)/i.test(link)) continue;
    const path = decodeURIComponent(link.split(/[?#]/)[0]);
    if (!path) continue;
    const parent = page.slice(0, page.lastIndexOf("/"));
    const target = path.startsWith("/") ? output + path : parent + "/" + path;
    try { const file = Deno.statSync(target); if (file.isDirectory) Deno.statSync(target + "/index.html"); } catch { missing.push(`${page}: ${link}`); }
  }
}
const guide = Deno.readTextFileSync(output + "/writing.html");
for (const id of ["eq-writing-faraday", "fig-writing-dipole"]) {
  if (!guide.includes(`id="${id}"`) || !guide.includes(`href="#${id}"`)) throw new Error(`Missing numbered reference: ${id}`);
}
if (!guide.includes("mathjax") || !guide.includes("ref-tong-em")) throw new Error("MathJax or bibliography is missing.");
if (pages.some(p => p.includes("/_examples/"))) throw new Error("Reference-only examples must not be published.");
if (missing.length) throw new Error("Broken local links:\n" + [...new Set(missing)].join("\n"));
console.log(`Validated ${pages.length} HTML pages, internal links, math, figure references and bibliography.`);
