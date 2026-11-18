// Native details/summary keeps every collection usable without JavaScript.
document.addEventListener('DOMContentLoaded', () => {
  const search = document.querySelector('#notes-search');
  if (!search) return;
  const groups = [...document.querySelectorAll('.notes-collection')];
  const empty = document.querySelector('#notes-no-results');
  let savedOpen = null;
  const restoreCategory = () => {
    const category = new URLSearchParams(location.hash.slice(1)).get('category');
    if (category) groups.forEach(group => { group.open = group.dataset.category === category; });
  };
  restoreCategory();
  window.addEventListener('hashchange', restoreCategory);
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    if (query && !savedOpen) savedOpen = new Set(groups.filter(group => group.open));
    let count = 0;
    for (const group of groups) {
      let matches = 0;
      for (const post of group.querySelectorAll('.collection-post')) {
        const text = `${group.dataset.category} ${post.textContent}`.toLocaleLowerCase();
        post.hidden = Boolean(query && !text.includes(query));
        if (!post.hidden) matches++;
      }
      group.hidden = matches === 0;
      if (query) group.open = matches > 0;
      else if (savedOpen) group.open = savedOpen.has(group);
      count += matches;
    }
    empty.hidden = count > 0;
    if (!query) savedOpen = null;
  });
});
