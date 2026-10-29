const output = "_site";
const pages: string[] = [];
function walk(dir: string) { for (const e of Deno.readDirSync(dir)) { const p = `${dir}/${e.name}`; if (e.isDirectory) walk(p); else if (e.name.endsWith(".html")) pages.push(p); } }
walk(output);
for (const script of ["catalog.js", "components.js", "site.js"]) new Function(Deno.readTextFileSync(`${output}/assets/${script}`));
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
const maxwell = Deno.readTextFileSync(output + "/posts/maxwell-equations/index.html");
if (!maxwell.includes('id="eq-maxwell-equations-1"') || !maxwell.includes('href="#eq-maxwell-equations-1"')) throw new Error("Numbered equation/reference is missing.");
if (!maxwell.includes("mathjax") || !maxwell.includes("ref-tong-em")) throw new Error("MathJax or bibliography is missing.");
const guide = Deno.readTextFileSync(output + "/writing.html");
if (!guide.includes('id="fig-writing-dipole"') || !guide.includes('href="#fig-writing-dipole"')) throw new Error("Figure/reference example is missing.");
if (missing.length) throw new Error("Broken local links:\n" + [...new Set(missing)].join("\n"));
console.log(`Validated ${pages.length} HTML pages, internal assets, equation numbering, figure references and bibliography.`);
