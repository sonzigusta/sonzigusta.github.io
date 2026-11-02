// Keep navigation and local assets on one build when Pages/browser caches differ.
const root = "_site";
const pages: string[] = [];
function walk(dir: string) {
  for (const entry of Deno.readDirSync(dir)) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory) walk(path);
    else if (entry.name.endsWith(".html")) pages.push(path);
  }
}
walk(root);
pages.sort();
const source = pages.map(p => Deno.readTextFileSync(p)).join("\n") + Deno.readTextFileSync("assets/styles.css");
const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
const revision = Deno.env.get("GITHUB_SHA")?.slice(0, 12) || [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
const origin = "https://sonzigusta.github.io";
for (const page of pages) {
  let html = Deno.readTextFileSync(page);
  html = html.replace(/<meta name="swr-build" content="[^"]*">\s*/g, "");
  html = html.replace(/\b(href|src)=(["'])([^"']+)\2/g, (attribute, name, quote, raw) => {
    const value = raw.replaceAll("&amp;", "&");
    if (value.startsWith("#")) return attribute;
    const target = new URL(value, origin);
    if (target.origin !== origin) return attribute;
    if (!/\/$|\.(?:html|css|js|png|svg|jpg|jpeg|webp|ico)$/i.test(target.pathname)) return attribute;
    const hashAt = value.indexOf("#");
    const hash = hashAt < 0 ? "" : value.slice(hashAt);
    const base = hashAt < 0 ? value : value.slice(0, hashAt);
    const [path, query = ""] = base.split("?");
    const params = new URLSearchParams(query);
    params.set("v", revision);
    return `${name}=${quote}${path}?${params.toString().replaceAll("&", "&amp;")}${hash}${quote}`;
  });
  html = html.replace("</head>", `<meta name="swr-build" content="${revision}">\n</head>`);
  Deno.writeTextFileSync(page, html);
}
Deno.writeTextFileSync(`${root}/build-version.json`, JSON.stringify({ revision, commit: Deno.env.get("GITHUB_SHA") || null }));
console.log(`Versioned ${pages.length} pages and their navigation/assets: ${revision}`);
