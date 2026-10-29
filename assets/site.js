'use strict';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const main=$('#main');
const {topics:SWR_TOPICS,notes:SWR_NOTES,paths:SWR_PATHS,references:SWR_REFERENCES}=window.SWR;
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topicById=id=>SWR_TOPICS.find(t=>t.id===id)||SWR_TOPICS[0];
const allNotes=()=>SWR_NOTES, noteById=id=>SWR_NOTES.find(n=>n.id===id);
const storageKey='swr-reading-progress-v1';
let state={saved:[],read:[]},toastTimer;
try{const data=JSON.parse(localStorage.getItem(storageKey)||'{}');for(const key of ['saved','read'])if(Array.isArray(data[key]))state[key]=[...new Set(data[key].filter(id=>typeof id==='string'&&SWR_NOTES.some(n=>n.id===id)))];}catch{}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200)}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(state));return true}catch{toast('브라우저 저장이 제한되어 진행 상태를 보관할 수 없습니다.');return false}}
const query=new URLSearchParams(location.search);
let filter={topic:SWR_TOPICS.some(t=>t.id===query.get('topic'))?query.get('topic'):'all',view:['saved','read'].includes(query.get('view'))?query.get('view'):'all',query:query.get('q')||'',sort:['title','unread'].includes(query.get('sort'))?query.get('sort'):'recent'};
function syncQuery(){const p=new URLSearchParams();if(filter.topic!=='all')p.set('topic',filter.topic);if(filter.view!=='all')p.set('view',filter.view);if(filter.query)p.set('q',filter.query);if(filter.sort!=='recent')p.set('sort',filter.sort);history.replaceState(null,'',location.pathname+(p.size?'?'+p:'')+location.hash)}
function normalized(s){return String(s).normalize('NFKC').toLowerCase()}
function filteredNotes(){
 const tokens=normalized(filter.query).trim().split(/\s+/).filter(Boolean);
 return allNotes().filter(n=>(filter.topic==='all'||n.topic===filter.topic)&&(filter.view==='all'||state[filter.view==='saved'?'saved':'read'].includes(n.id))&&tokens.every(q=>normalized([n.title,n.summary,n.search,...n.tags,topicById(n.topic).name].join(' ')).includes(q))).sort((a,b)=>filter.sort==='title'?a.title.localeCompare(b.title):filter.sort==='unread'?(Number(state.read.includes(a.id))-Number(state.read.includes(b.id))||b.date.localeCompare(a.date)):b.date.localeCompare(a.date));
}
function renderList(){
 const notes=filteredNotes();$('#results-count').textContent=`${notes.length} ${notes.length===1?'note':'notes'}${filter.query?' found':''}`;
 $('#filter-summary').innerHTML=filter.topic!=='all'?`<div class="filter-summary">Subject <button id="clear-topic">${topicById(filter.topic).name} ${icon('close')}</button></div>`:'';
 $('#clear-topic')?.addEventListener('click',()=>{filter.topic='all';refreshTopics();renderList();syncQuery()});
 $('#note-list').innerHTML=notes.length?notes.map(row).join(''):`<div class="empty-state">${icon(filter.view==='saved'?'bookmark':'search')}<h3>${filter.view==='saved'?'아직 조건에 맞는 북마크가 없습니다.':filter.view==='read'?'조건에 맞는 읽은 글이 없습니다.':'조건에 맞는 글이 없습니다.'}</h3><p>검색어와 필터를 바꾸거나 전체 학습 노트를 확인하세요.</p><button class="button ghost" id="reset-filters">모든 글 보기 ${icon('arrow')}</button></div>`;
 $('#reset-filters')?.addEventListener('click',()=>{filter={topic:'all',view:'all',query:'',sort:'recent'};renderHome();syncQuery();$('#library').scrollIntoView()});
}
function refreshTopics(){$$('.topic-tile').forEach(v=>{const selected=filter.topic===v.dataset.topic;v.classList.toggle('selected',selected);v.setAttribute('aria-pressed',selected)})}
function setupHome(){
 $('#note-sort').value=filter.sort;
 $('#note-search').addEventListener('input',e=>{filter.query=e.target.value;$('#clear-search').hidden=!filter.query;renderList();syncQuery()});
 $('#clear-search').addEventListener('click',()=>{filter.query='';$('#note-search').value='';$('#clear-search').hidden=true;renderList();syncQuery();$('#note-search').focus()});
 $('#note-sort').addEventListener('change',e=>{filter.sort=e.target.value;renderList();syncQuery()});
 $$('.view-tab').forEach(b=>b.addEventListener('click',()=>{filter.view=b.dataset.view;$$('.view-tab').forEach(v=>v.setAttribute('aria-pressed',v===b));renderList();syncQuery()}));
 $$('.topic-tile').forEach(b=>b.addEventListener('click',()=>{filter.topic=filter.topic===b.dataset.topic?'all':b.dataset.topic;refreshTopics();renderList();syncQuery();$('#library').scrollIntoView({behavior:'smooth'})}));
 renderList();
}
const sidebar=$('#sidebar'),shade=$('#drawer-shade');
function setDrawer(open){const previous=sidebar.classList.contains('open');sidebar.classList.toggle('open',open);sidebar.inert=!open;shade.hidden=!open;$('#menu-toggle').setAttribute('aria-expanded',open);$('#menu-toggle').setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');document.body.style.overflow=open?'hidden':'';if(open){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');$('#menu-close').focus()}else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');if(previous)$('#menu-toggle').focus()}}
$('#menu-toggle').addEventListener('click',()=>setDrawer(!sidebar.classList.contains('open')));$('#menu-close').addEventListener('click',()=>setDrawer(false));shade.addEventListener('click',()=>setDrawer(false));
$('#drawer-count').textContent=String(SWR_NOTES.length).padStart(2,'0');$('#drawer-topics').innerHTML=SWR_TOPICS.map(t=>`<a href="/?topic=${t.id}#library" class="drawer-link">${icon(t.icon)} ${t.short}<span class="mono" style="font-size:9px;color:var(--quiet)">${SWR_NOTES.filter(n=>n.topic===t.id).length}</span></a>`).join('');
function initArticle(){
 const slug=location.pathname.split('/').filter(Boolean)[1],note=noteById(slug);if(!note)return;
 const topic=topicById(note.topic);$('#article-topic').textContent=topic.name;$('.article-heading').style.setProperty('--topic',topic.color);$('#article-time').textContent=note.minutes+' MIN READ';$('#edit-on-github').href='https://github.com/sonzigusta/sonzigusta.github.io/edit/main/'+note.source;
 function updateStatus(){const read=state.read.includes(note.id),saved=state.saved.includes(note.id);$('#read-note').setAttribute('aria-pressed',read);$('#read-note').innerHTML=icon('check')+' '+(read?'읽음 표시 해제':'읽음으로 표시');$('#save-note').setAttribute('aria-pressed',saved);$('#save-note').setAttribute('aria-label','북마크 '+(saved?'해제':'추가'));$('#save-note').dataset.save=note.id}
 $('#read-note').addEventListener('click',()=>{const read=state.read.includes(note.id);state.read=read?state.read.filter(id=>id!==note.id):[...state.read,note.id];if(persist())toast(read?'읽음 표시를 해제했습니다.':'이 브라우저에 읽음 상태를 저장했습니다.');updateStatus()});
 const headings=$$('#article-body h2');$('#article-toc').innerHTML=headings.map((h,i)=>{if(!h.id)h.id='section-'+i;return `<a href="#${encodeURIComponent(h.id)}">${escapeHtml(h.textContent)}</a>`}).join('');
 $('#related-notes').innerHTML=SWR_NOTES.filter(n=>n.topic===note.topic&&n.id!==note.id).slice(0,3).map(n=>`<a href="${n.href}">${escapeHtml(n.title)} ${icon('arrow')}</a>`).join('');updateStatus();
}
document.addEventListener('click',e=>{
 const save=e.target.closest('[data-save]');if(save){const id=save.dataset.save,saved=state.saved.includes(id);state.saved=saved?state.saved.filter(v=>v!==id):[...state.saved,id];if(persist())toast(saved?'북마크를 해제했습니다.':'이 브라우저의 북마크에 담았습니다.');if($('#note-list'))renderList();else{save.setAttribute('aria-pressed',!saved);save.setAttribute('aria-label','북마크 '+(saved?'추가':'해제'))}return}
 const tag=e.target.closest('[data-tag]');if(tag&&$('#note-search')){filter.query=tag.dataset.tag;$('#note-search').value=filter.query;$('#clear-search').hidden=false;renderList();syncQuery();$('#note-search').focus()}
 if(e.target.closest('.sidebar a'))setDrawer(false);
 const skip=e.target.closest('a[href="#main"]');if(skip){e.preventDefault();main.focus();main.scrollIntoView()}
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&sidebar.classList.contains('open'))setDrawer(false);
 if(e.key==='Tab'&&sidebar.classList.contains('open')){const items=$$('button,a[href]',sidebar),first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
 if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!sidebar.classList.contains('open')&&$('#note-search')){e.preventDefault();$('#note-search').focus()}
});
const page=location.pathname;
if(page==='/paths.html')renderPaths();else if(page==='/references.html')renderReferences();else if(page.startsWith('/posts/'))initArticle();else if(page==='/'||page==='/index.html')renderHome();
const nav=page==='/paths.html'?'paths':page==='/references.html'?'references':'notes';$$('.top-nav a').forEach(a=>{if(a.dataset.nav===nav){a.classList.add('active');a.setAttribute('aria-current','page')}});
hydrateIcons();
if(location.hash==='#library')requestAnimationFrame(()=>$('#library')?.scrollIntoView());
