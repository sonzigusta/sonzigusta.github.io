# SWR Notes 사용 매뉴얼

손승민 · Quarto + VS Code + GitHub Pages · 2026-11-09

사이트: https://sonzigusta.github.io  
저장소: https://github.com/sonzigusta/sonzigusta.github.io  
배포 확인: https://github.com/sonzigusta/sonzigusta.github.io/actions

## 0. 매일 보는 빠른 순서표

**모든 명령은 VS Code에서 `sonzigusta.github.io` 폴더를 연 뒤, Terminal → New Terminal에서 실행한다.**

### 작업 시작

1. `git status`로 수정 중인 파일이 있는지 확인한다.
2. `working tree clean`이면 `git pull --ff-only`로 최신 내용을 받는다.
3. `quarto preview`로 미리보기를 연다.
4. 편집하고 `Ctrl + S`로 저장하며 화면을 확인한다.

```bash
git status
git pull --ff-only
quarto preview
```

명령은 하나씩 실행한다. 상태 확인에서 변경 파일이 나오거나 오류가 나면 다음 단계 전에 아래 문제 해결 표를 확인한다.

### 작업 종료 및 공개

File → Save All로 모두 저장한다. 미리보기 터미널에서 `Ctrl + C`를 누른 뒤 다음을 하나씩 실행한다.

```bash
quarto render
quarto run scripts/check-site.ts
git status
```

검사가 성공하고 변경 목록이 모두 올릴 내용이면:

```bash
git add .
git commit -m "Update notes"
git push
```

GitHub Actions의 최신 작업이 초록색 체크로 완료되면 실제 사이트를 확인한다. **push 성공과 배포 성공은 별개다.**

## 1. 내 컴퓨터와 공개 사이트의 관계

| 단계 | 무엇이 바뀌는가? |
|---|---|
| 파일 저장 | 내 PC의 원본 파일 |
| `quarto preview` | 내 PC에서 보는 미리보기 |
| `quarto render` | 원본으로 만든 `_site`의 웹페이지 |
| `git add` | 이번 커밋에 포함할 변경사항 선택 |
| `git commit` | 내 PC의 변경 이력 |
| `git push` | GitHub 저장소 |
| GitHub Actions 배포 성공 | 인터넷에 공개된 사이트 |

저장만 하거나 commit만 하면 다른 기기에서 받을 수 없다. **push까지 해야 한다.** 다른 기기에서 받는 명령은 pull이다.

## 2. 새 컴퓨터에서 최초 설정

1. Git, Quarto, VS Code를 설치한다.
2. VS Code의 Extensions에서 Quarto 확장을 설치한다.
3. `Ctrl + Shift + P` → `Git: Clone`을 선택한다.
4. 아래 주소를 입력한다.

```text
https://github.com/sonzigusta/sonzigusta.github.io.git
```

5. 저장할 상위 폴더를 선택하고 복제가 끝나면 Open을 누른다.
6. 왼쪽에 `_quarto.yml`, `posts`, `templates`가 보이는지 확인한다.
7. Terminal → New Terminal에서 `quarto preview`를 실행한다.

GitHub 로그인이 나오면 본인 계정으로 로그인한다. 같은 기기에서는 clone을 반복하지 않는다. 다음부터 기존 폴더를 열고 pull한다.

## 3. 데스크톱과 노트북을 오가는 순서

| 시점 | 실행할 작업 |
|---|---|
| 데스크톱에서 끝낼 때 | 모두 저장 → 검증 → add → commit → push |
| 노트북에서 시작할 때 | 기존 폴더 열기 → status → pull |
| 노트북에서 끝낼 때 | 모두 저장 → 검증 → add → commit → push |
| 데스크톱으로 돌아왔을 때 | status → pull |

ChatGPT가 GitHub에서 수정한 내용도 내 PC에서는 pull로 받아야 한다. 여러 기기에서 같은 파일을 동시에 수정하기보다, 한 기기에서 push를 마친 뒤 다른 기기에서 pull하여 이어 쓴다.

## 4. 기존 양식으로 새 글 만들기

1. VS Code 탐색기에서 `posts` 우클릭 → New Folder.
2. `basic-radiation`처럼 영문 소문자·숫자·하이픈으로 폴더 이름을 정한다.
3. `templates/new-note.qmd`를 선택하고 `Ctrl + C`.
4. 새 폴더를 선택하고 `Ctrl + V`.
5. 복사한 파일을 선택하고 `F2` → `index.qmd`로 이름을 바꾼다.

완성 경로 예: `posts/basic-radiation/index.qmd`

아래는 그대로 사용할 수 있는 원고 시작 양식이다.

```markdown
---
title: "Basic Principle of Radiation"
description: "Why antennas radiate and how the radiation pattern is formed."
date: "2026-11-09"
categories: ["Radiation", "Antennas"]
draft: false
---

## 시작하며

이곳에 글의 목적을 작성합니다.

## 기본 가정

좌표계, 매질, 시간 조화 convention 등 필요한 가정을 설명합니다.

## 본문

수식 유도와 물리적 의미를 작성합니다.

## 정리

결론과 적용 범위를 정리합니다.
```

| 항목 | 의미 |
|---|---|
| `title` | 글 제목 |
| `description` | 목록에 표시할 짧은 소개 |
| `date` | 글의 게시 날짜 |
| `categories` | 주제 분류와 검색용 키워드 |
| `draft: false` | 공개 대상 |
| `draft: true` | 사이트에서 제외 |

주제 키워드는 같은 뜻이면 같은 표기로 유지한다. 새 글을 만들 때 `_quarto.yml`이나 `notes.qmd`를 수정할 필요는 없다. `posts`의 공개 글이 자동으로 목록에 모인다.

`draft: true`라도 공개 저장소에 push한 원고 자체는 공개된다. 미공개 연구 결과를 보호하는 기능으로 사용하지 않는다.

## 5. 수정하면서 실시간으로 확인하기

```bash
quarto preview
```

브라우저에 열린 로컬 페이지와 VS Code를 나란히 놓는다. 파일을 수정하고 `Ctrl + S`로 저장하면 미리보기가 갱신된다. 공개 사이트 주소가 아니라 터미널에 표시된 로컬 주소를 보고 있는지 확인한다.

- 파일 하나 저장: `Ctrl + S`
- 파일 전체 저장: File → Save All
- 미리보기 종료: 실행 중인 터미널을 클릭 → `Ctrl + C`
- 미리보기를 켠 채 다른 명령 사용: Terminal → New Terminal
- 새 글이 목록에 안 보임: 저장·`draft: false` 확인 후 미리보기 재시작

## 6. 본문 서식과 수식

| 기능 | 입력 예시 |
|---|---|
| 소제목 | `## 시작하며` |
| 하위 소제목 | `### 기본 가정` |
| 굵게 | `**중요한 내용**` |
| 기울임 | `*강조*` |
| 목록 | `- 항목` |
| 번호 목록 | `1. 항목` |
| 링크 | `[표시할 이름](https://example.com)` |
| 인라인 코드 | `` `variable` `` |
| 문단 구분 | 문단 사이 빈 줄 |

본문 제목은 `##`부터 시작한다. 최상단 title이 이미 글 제목을 표시한다. `**## 시작하며**`처럼 제목 기호를 굵게 표시 안에 넣지 않는다. 메타데이터 구분선은 역슬래시 없는 `---`다.

### 문장 안 수식

```markdown
파수는 $k=2\pi/\lambda$이며, 자유공간의 파장은 $\lambda=c/f$이다.
```

### 별도 줄 수식과 자동 번호

```markdown
$$
\nabla\times\mathbf E=-\frac{\partial\mathbf B}{\partial t}
$$ {#eq-faraday}

식 [-@eq-faraday]에서 출발합니다.
```

`{#eq-faraday}`는 수식의 참조 이름이다. 번호는 글 안의 순서에 따라 자동으로 매겨진다. 이름은 `eq-`로 시작하고, 글 안에서 중복하지 않는다. 번호 없이 표시하려면 `{#eq-faraday}`를 생략한다. 실제 출력은 Quarto 미리보기에서 확인한다.

### 코드 블록

MATLAB 코드를 보여주려면 다음처럼 작성한다. 현재 사이트 설정에서는 코드가 자동 실행되지 않는다.

````markdown
```matlab
f = 15e9;
c = 299792458;
lambda = c/f;
```
````

## 7. 사진·그래프 넣기

그림을 해당 글의 `index.qmd`와 같은 폴더에 복사한다. 예: `posts/basic-radiation/radiation-pattern.png`

```markdown
![안테나의 방사 패턴](radiation-pattern.png){#fig-pattern width=500}

그림 [-@fig-pattern]에서 방사 패턴을 확인할 수 있습니다.
```

| 부분 | 의미 |
|---|---|
| 대괄호 안 문장 | 그림 캡션 |
| 괄호 안 파일명 | 그림 경로 |
| `#fig-pattern` | 자동 번호와 본문 참조 이름 |
| `width=500` | 표시 너비 |

캡션과 번호 없이 표시:

```markdown
![](radiation-pattern.png){width=500}
```

그림을 글 폴더 아래 `images` 폴더에 넣었다면:

```markdown
![전기장 분포](images/field.png){#fig-field width=500}
```

파일명과 확장자의 대소문자를 실제 파일과 정확히 맞춘다. Windows의 `C:\...` 경로 대신 위와 같은 상대경로를 사용한다. 그림 파일도 함께 commit·push한다.

## 8. 최종 업로드와 배포 확인

1. File → Save All.
2. 미리보기 종료: `Ctrl + C`.
3. 다음 명령을 하나씩 실행한다. 오류가 있으면 다음 단계로 넘어가지 않는다.

```bash
quarto render
quarto run scripts/check-site.ts
git status
```

4. 변경 목록에 올리려는 파일만 있는지 확인한다.
5. 전부 이번 작업에 해당하면 아래를 실행한다.

```bash
git add .
git commit -m "Add radiation note"
git push
```

`git add .`는 삭제를 포함한 변경사항 전체를 선택한다. 다른 작업이 섞여 있으면 원하는 글 폴더만 지정한다.

```bash
git add posts/basic-radiation/
```

커밋 메시지는 작업 내용을 짧게 적는다. 예: `Fix equation reference`, `Update About me`, `Remove old note`.

6. GitHub Actions에서 이번 커밋의 **Build and publish SWR Notes**를 연다.
7. build와 deploy가 모두 성공했는지 확인한다.
8. 실제 사이트의 Notes에서 글과 그림을 확인한다. 이전 화면이면 `Ctrl + F5`로 새로고침한다.

## 9. 글 수정·삭제

수정은 `posts/해당-글/index.qmd`에서 한다. 글을 삭제하려면 해당 글 폴더를 우클릭 → Delete한다. 다른 글에서도 쓰는 그림은 남겨야 한다. 삭제한 글로 연결되는 링크가 있다면 함께 수정한다.

삭제 후에도 8번의 검증·commit·push를 진행한다. 배포 성공 후 공개 사이트에서도 삭제된다. 일반적인 삭제는 과거 Git 이력까지 지우는 작업은 아니다.

Home, Notes, About me처럼 메뉴에 연결된 페이지는 파일만 삭제하면 안 된다. `_quarto.yml`의 메뉴와 렌더링 목록에서도 해당 항목을 정리해야 한다.

`_site`는 자동 생성 결과물이다. 원본 수정·삭제를 대신해 `_site` 안의 HTML을 편집하지 않는다.

## 10. 자주 만나는 문제

| 표시 또는 증상 | 의미와 다음 행동 |
|---|---|
| `Already up to date.` | 이미 최신이다. 편집을 시작한다. |
| `working tree clean` | 커밋되지 않은 파일 변경이 없다. push 여부는 별도로 확인한다. |
| `modified`, `untracked`, `deleted` | 로컬 변경이 있다. Source Control에서 내용을 확인하고 보존할 작업인지 판단한다. |
| `nothing to commit` | 새로 커밋할 내용이 없다. 저장 여부와 현재 폴더를 확인한다. |
| `Everything up-to-date` | 보낼 새 커밋이 없다. 수정했다면 저장·add·commit 여부를 확인한다. |
| `not a git repository` | 블로그 저장소 폴더가 아닌 곳에서 실행 중이다. 폴더를 다시 연다. |
| `quarto` 명령을 찾을 수 없음 | Quarto 설치 여부를 확인하고 VS Code를 재시작한다. |
| 터미널에 명령을 입력할 수 없음 | preview가 실행 중일 수 있다. `Ctrl + C` 또는 새 터미널을 사용한다. |
| 글이 Notes에 안 보임 | `posts` 아래인지, 저장했는지, `draft: false`인지 확인한다. |
| 그림이 깨짐 | 경로·확장자·대소문자와 그림의 commit·push 여부를 확인한다. |
| 수식·참조가 이상함 | `$` 짝, `eq-`/`fig-` 접두어, 참조 이름의 오타·중복을 확인한다. |
| push 성공인데 사이트가 예전 상태 | Actions의 배포 완료 여부를 확인한 뒤 강력 새로고침한다. |
| Actions 빨간 체크 | 실패한 작업의 로그를 열어 오류 위치를 확인한다. 배포 완료로 간주하지 않는다. |

### pull이나 push가 거절되면

`would be overwritten`, `Not possible to fast-forward`, `non-fast-forward`, `CONFLICT`가 나오면 명령을 반복하거나 강제로 덮어쓰지 않는다.

1. `git status`로 현재 상태를 확인한다.
2. VS Code의 Source Control에서 변경 파일을 확인한다.
3. 아직 커밋하지 않은 작업과 원격 변경을 모두 보존해야 한다.
4. 해결 방법을 판단하기 어렵다면 오류 전문과 `git status` 결과를 함께 전달한다.

강제 push, `reset --hard`, Discard Changes를 기본 해결책으로 사용하지 않는다.

## 11. 파일 위치 빠른 찾기

| 수정하려는 내용 | 파일·폴더 |
|---|---|
| 새 글·기존 글 | `posts/글-폴더/index.qmd` |
| 새 글 기본 양식 | `templates/new-note.qmd` |
| 홈 | 루트의 `index.qmd` |
| 글 목록 | `notes.qmd` |
| 자기소개·학력 | `about.qmd` |
| 메뉴·공통 설정 | `_quarto.yml` |
| 스타일 | `assets/styles.css` |
| 참고문헌 | `references.bib` |
| 배포 설정 | `.github/workflows/publish.yml` |

이 매뉴얼은 로컬 참고용이다. VS Code에서 열고 `Ctrl + Shift + V`를 누르면 읽기 편한 Markdown 미리보기로 볼 수 있다. 필요할 때 `Ctrl + F`로 명령어 또는 주제를 검색한다.

---

**시작: status → pull → preview**  
**작성: 편집 → 저장 → 로컬 확인**  
**종료: 검증 → add → commit → push → 배포 확인**
