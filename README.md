# SWR Notes

Seungmin Wave & Radio Frequency Notes.

Public site: https://sonzigusta.github.io/

A small Quarto site modeled on the author's Google Sites home: a photo banner, a short Welcome, Maxwell's equations, and plain pages for notes and a personal introduction.

## Windows setup

Install [Git](https://git-scm.com/install/windows), [VS Code](https://code.visualstudio.com/download), [Quarto](https://quarto.org/docs/get-started/) (1.10.19 or newer), and the **Quarto** extension in VS Code.

```powershell
git clone https://github.com/sonzigusta/sonzigusta.github.io.git
cd sonzigusta.github.io
code .
quarto preview
```

No Python, R, Node.js, Ruby, or TeX installation is needed for Markdown-only HTML notes.

## Add a note and choose your own topics

Copy `templates/new-note.qmd` to `posts/your-note-slug/index.qmd`. Edit its title, description, date and `categories`.

```yaml
categories: ["Your own topic", "Another topic"]
```

Topic names are unrestricted. Notes and category filters are generated automatically from published files in `posts/`. There is no preset subject list. Add images in the note's folder. `draft: true` excludes a note from the website, but committed source in this public repository remains public.

Use `$...$` for inline LaTeX and `$$...$$` for display math. Equation references, figures and citations are explained in [the writing guide](https://sonzigusta.github.io/writing.html).

## Change the template

| File | Edit |
|---|---|
| `index.qmd` | Welcome text and homepage equations |
| `assets/styles.css` | Colors, fonts, photo banner and spacing |
| `_quarto.yml` | Site name, navbar and rendering |
| `about.qmd` | Personal introduction |
| `notes.qmd` | List of notes, search and topic filters |
| `templates/new-note.qmd` | New post defaults |
| `references.bib` | Bibliography |

Add a custom page to `project.render` and a navbar entry in `_quarto.yml` to create another top-level menu.

The former 13 generated foundation notes are preserved in `_examples/foundation-notes/`, excluded from website rendering. To reuse one, copy it under `posts/`, remove its former `topic` field and choose your own `categories`.

## Publish

```powershell
quarto render
quarto run scripts/check-site.ts
git add .
git commit -m "Update my notes"
git push
```

Pushes to `main` render, validate and deploy to GitHub Pages automatically. Repository **Settings → Pages → Source** is **GitHub Actions**. Build output `_site/` is not committed.
