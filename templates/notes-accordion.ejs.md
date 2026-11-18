```{=html}
<%
const groups = new Map();
for (const item of items) {
  const categories = Array.isArray(item.categories) ? item.categories : item.categories ? [item.categories] : ['Uncategorized'];
  for (const category of [...new Set(categories)]) {
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(item);
  }
}
%>
<section class="notes-archive" aria-label="Notes by subject">
  <% if (items.length) { %>
  <div class="notes-toolbar">
    <span class="notes-total"><%- groups.size %> categories · <%- items.length %> notes</span>
    <input id="notes-search" type="search" aria-label="Search notes..." placeholder="Search notes..." autocomplete="off">
  </div>
  <div class="notes-collections">
  <% for (const [category, posts] of [...groups].sort((a, b) => a[0].localeCompare(b[0]))) { %>
    <details class="notes-collection" data-category="<%- category %>">
      <summary>
        <span class="collection-title"><%- category %></span>
        <span class="collection-chevron" aria-hidden="true"></span>
        <span class="collection-count" aria-label="<%- posts.length %> notes"><%- posts.length %> <%- posts.length === 1 ? 'note' : 'notes' %></span>
      </summary>
      <div class="collection-posts">
      <% for (const item of posts) { %>
        <article class="collection-post">
          <div class="collection-post-copy">
            <h2><a href="<%- item.path %>"><%= item.title %></a></h2>
            <% if (item.description) { %><div class="collection-description"><%= item.description %></div><% } %>
          </div>
          <% if (item.date) { %><span class="collection-date"><%- item.date %></span><% } %>
        </article>
      <% } %>
      </div>
    </details>
  <% } %>
  </div>
  <p id="notes-no-results" role="status" hidden>No matching notes.</p>
  <% } else { %>
  <p class="notes-empty">No notes published yet.</p>
  <% } %>
</section>
```
