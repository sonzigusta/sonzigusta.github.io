// Subjects come from the notes themselves; there is no fixed topic list.
document.addEventListener('DOMContentLoaded', () => {
  const host = document.querySelector('#note-topics');
  if (!host) return;
  const hasNotes = Boolean(document.querySelector('.quarto-post'));
  document.body.classList.toggle('has-notes', hasNotes);
  const topics = [...new Set([...document.querySelectorAll('.quarto-post .listing-category')]
    .map(el => el.textContent.trim()))].sort((a, b) => a.localeCompare(b));
  if (!hasNotes) return;
  for (const [label, topic] of [['All', ''], ...topics.map(t => [t, t])]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.topic = topic;
    button.addEventListener('click', () => {
      window.quartoListingCategory(btoa(encodeURIComponent(topic)));
    });
    host.append(button);
  }
  const updateSelection = () => {
    const current = new URLSearchParams(location.hash.slice(1)).get('category') || '';
    for (const button of host.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.topic === current));
    }
  };
  updateSelection();
  window.addEventListener('hashchange', updateSelection);
  const search = document.querySelector('.quarto-listing-filter input');
  if (search) {
    search.placeholder = 'Search notes';
    search.setAttribute('aria-label', 'Search notes');
    // Keep pasted text and mobile input in sync with the native listing search.
    search.addEventListener('input', () => search.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true })));
  }
});
