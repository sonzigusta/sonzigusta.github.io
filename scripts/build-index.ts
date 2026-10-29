import { parse } from "stdlib/yaml";

type Metadata = { title?: string; description?: string; topic?: string; date?: string | Date; categories?: string[]; draft?: boolean };
const readJson = (path: string) => JSON.parse(Deno.readTextFileSync(path));
const data = { topics: readJson("_data/topics.json"), paths: readJson("_data/paths.json"), references: readJson("_data/references.json"), notes: [] as Record<string, unknown>[] };

for (const directory of Deno.readDirSync("posts")) {
  if (!directory.isDirectory || !/^[a-z0-9-]+$/.test(directory.name)) continue;
  const source = `posts/${directory.name}/index.qmd`;
  let text: string;
  try { text = Deno.readTextFileSync(source); } catch { continue; }
  const frontMatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontMatter) throw new Error(`YAML front matter missing: ${source}`);
  const meta = parse(frontMatter[1]) as Metadata;
  if (meta.draft) continue;
  if (!meta.title || !data.topics.some((t: { id: string }) => t.id === meta.topic)) throw new Error(`Title/topic missing or invalid: ${source}`);
  const body = text.slice(frontMatter[0].length);
  const date = meta.date instanceof Date ? meta.date.toISOString().slice(0, 10) : String(meta.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Use a YYYY-MM-DD date: ${source}`);
  data.notes.push({ id: directory.name, title: meta.title, summary: meta.description || "", topic: meta.topic, tags: meta.categories || [], date, minutes: Math.max(1, Math.ceil(body.length / 650)), href: `/posts/${directory.name}/`, source, search: body.replace(/[`#$*{}]/g, " ") });
}
data.notes.sort((a, b) => String(b.date).localeCompare(String(a.date)));
for (const path of data.paths) for (const id of path.ids) if (!data.notes.some(n => n.id === id)) throw new Error(`Learning path points to missing/published draft: ${id}`);
Deno.mkdirSync("assets", { recursive: true });
Deno.writeTextFileSync("assets/catalog.js", `/* Generated from Quarto post sources. Do not edit. */\nwindow.SWR = ${JSON.stringify(data)};\n`);
// Use the same presentation components for the static catalog and browser filters.
const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const renderStatic = new Function("SWR_TOPICS", "SWR_PATHS", "SWR_REFERENCES", "state", "filter", "main", "document", "allNotes", "noteById", "topicById", "escapeHtml", "setupHome", Deno.readTextFileSync("assets/components.js") + '\nrenderHome(); return main.innerHTML.replace(\'<div id="note-list"></div>\', \'<div id="note-list">\' + allNotes().map(row).join(\'\') + \'</div>\');');
const html = renderStatic(data.topics, data.paths, data.references, { saved: [], read: [] }, { topic: "all", view: "all", query: "", sort: "recent" }, { innerHTML: "" }, { title: "" }, () => data.notes, (id: string) => data.notes.find(n => n.id === id), (id: string) => data.topics.find((t: { id: string }) => t.id === id), escapeHtml, () => {});
Deno.mkdirSync("_generated", { recursive: true });
Deno.writeTextFileSync("_generated/home.html", html);
console.log(`SWR catalog: ${data.notes.length} notes · ${data.topics.length} topics`);
