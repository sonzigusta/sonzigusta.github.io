# SWR Notes

**Seungmin Wave & Radio Frequency Notes** — antennas, RF, classical electrodynamics, and advanced engineering electromagnetism, from first principles.

Public site: **https://sonzigusta.github.io/**

## Windows setup

1. Install [Git for Windows](https://git-scm.com/install/windows), [VS Code](https://code.visualstudio.com/download), and [Quarto](https://quarto.org/docs/get-started/) (1.10.19 or newer).
2. Add the **Quarto** extension in VS Code.
3. Clone this repository and open the folder:

```powershell
git clone https://github.com/sonzigusta/sonzigusta.github.io.git
cd sonzigusta.github.io
code .
quarto preview
```

No Python, R, Node.js, Ruby, or TeX installation is needed for Markdown-only HTML posts. Quarto includes the TypeScript runtime used to build the catalog.

## Write a note

Copy `templates/new-note.qmd` to `posts/your-note-slug/index.qmd`. Change its title, description, date, topic, and tags. Use one of `antennas`, `rf`, `classical`, or `engineering` for `topic`. Keep the slug in lowercase ASCII with hyphens. Add images in the same post folder and citations to `references.bib`.

Use `$...$` for inline LaTeX and `$$...$$` for display math. Add `{#eq-label}` to an equation and `@eq-label` in the text to reference it. The site includes real equation, figure, and bibliography examples in [the writing guide](https://sonzigusta.github.io/writing.html).

`draft: true` excludes a post from the published output and catalog. Because this repository is public, draft source files committed here are still publicly visible.

## Validate and publish

```powershell
quarto render
quarto run scripts/check-site.ts
git add .
git commit -m "Add a study note"
git push
```

Every push to `main` runs `.github/workflows/publish.yml`: it renders the site, checks internal links and math output, uploads `_site`, and deploys to GitHub Pages. GitHub repository **Settings → Pages → Source** must be **GitHub Actions**. Check the Actions tab for deployment errors.

Only the source is committed. `_site/`, `.quarto/`, generated catalogs and local preview configuration are ignored. Bookmarks and reading progress are stored per visitor in their browser; the public website has no shared editing backend.

## Source layout

| Path | Purpose |
|---|---|
| `posts/*/index.qmd` | Study note sources |
| `templates/new-note.qmd` | Copyable new post template |
| `_quarto.yml` | Rendering, bibliography and site settings |
| `_data/` | Topics, curated learning paths and reference links |
| `references.bib` | Bibliography database |
| `assets/` | Logo, diagram, styles and browser interactions |
| `includes/page.html` | Shared page template |
| `scripts/build-index.ts` | Catalog and static home generation |
| `scripts/check-site.ts` | Build validation |

Foundation notes are educational starting points, not experimental results. Each note states its assumptions and convention. Adapt them as your understanding develops.
