// Quarto generates categories and counts from every published post, including
// inherited directory metadata. Keep its filtering and pagination behavior.
document.addEventListener('DOMContentLoaded', () => {
  const host = document.querySelector('#note-topics');
  if (!host) return;
  const hasNotes = Boolean(document.querySelector('.quarto-post'));
  document.body.classList.toggle('has-notes', hasNotes);
  if (!hasNotes) return;
  const heading = document.querySelector('#notes-list-heading');
  const categories = document.querySelector('.quarto-listing-category');
  if (!categories) return;
  const buttons = [];
  for (const item of categories.querySelectorAll('.category')) {
    const encoded = item.dataset.category;
    const topic = decodeURIComponent(atob(encoded));
    const count = item.querySelector('.quarto-category-count')?.textContent.replace(/[()]/g, '').trim() || '0';
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.topic = topic;
    const title = document.createElement('span');
    title.className = 'note-topic-title';
    title.textContent = topic || '전체 글';
    const total = document.createElement('span');
    total.className = 'note-topic-count';
    total.textContent = `${count}개의 글`;
    button.append(title, total);
    button.addEventListener('click', () => {
      window.quartoListingCategory(encoded);
      updateSelection();
    });
    host.append(button);
    buttons.push(button);
  }
  // Leave the native category elements in the DOM for Quarto's filtering logic.
  categories.hidden = true;
  document.querySelector('.quarto-listing-category-title')?.setAttribute('hidden', '');
  const updateSelection = () => {
    const current = new URLSearchParams(location.hash.slice(1)).get('category') || '';
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.topic === current));
    if (heading) heading.textContent = current || '전체 글';
  };
  updateSelection();
  // Native post category links also change the selected category via pushState.
  document.addEventListener('click', event => {
    if (event.target.closest('.listing-category')) updateSelection();
  });
  // Quarto restores category and pagination from the URL on page load.
  window.addEventListener('popstate', () => location.reload());
  const search = document.querySelector('.quarto-listing-filter input');
  if (search) {
    search.placeholder = '글 검색';
    search.setAttribute('aria-label', '글 검색');
    search.addEventListener('input', () => search.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true })));
  }
});
