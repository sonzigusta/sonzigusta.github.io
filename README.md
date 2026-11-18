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

## 주제별로 새 글 추가하기

1. `git pull --ff-only`로 최신 설정을 받습니다.
2. `templates/new-note.qmd`를 주제 폴더 아래의 새 글 폴더에 복사합니다.
   - 전자기학: `posts/electrodynamics/my-new-note/index.qmd`
   - 일상과 생각: `posts/just-talking/my-new-note/index.qmd`
3. 제목, 설명, 날짜와 본문을 수정하고 그림은 같은 글 폴더에 넣습니다.

각 주제 폴더의 `_metadata.yml`이 카테고리를 자동 지정합니다. 새 글에는 `categories`를 따로 적지 않아도 됩니다. Notes에서 카테고리를 클릭하면 해당 글들만 표시됩니다. 새 주제를 만들려면 `posts/새-주제/_metadata.yml`에 `categories: ["새 주제 이름"]`을 넣고 그 아래에 글을 작성합니다. 공개한 글이 생기면 카테고리도 자동으로 표시됩니다.

기존 「전자파 복사」와 「Preface」는 기존 링크와 댓글 연결을 유지하기 위해 원래 폴더에 두고, 각각 Electrodynamics와 Just Talking으로 분류했습니다. 새 글은 위 주제 폴더를 사용하세요. Preface의 `comments: false`는 유지되며 다른 새 글에는 giscus가 자동 적용됩니다.

`draft: true`는 글을 사이트에서 제외하지만 공개 저장소에 커밋한 원본까지 비공개로 만들지는 않습니다.

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
