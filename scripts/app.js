const labels = {
  pt: {
    skip: 'Pular para o conteúdo', navProjects: 'Projetos', navApproach: 'Nossa abordagem', navInstitute: 'Laboratório',
    heroEyebrow:'OBSERVATÓRIO OPEN SOURCE / CECIL-IA LABS', heroTitle:'Ideias em órbita.<br><span>Conhecimento em código.</span>',
    heroDescription:'Investigamos sistemas, construímos ferramentas e compartilhamos o processo. Um espaço para ciência aberta, engenharia de software e experimentação aplicada.',
    explore:'Explorar projetos', institutional:'Conhecer o laboratório', statProjects:'repositórios catalogados', statOpen:'catálogo público', statLanguages:'interface bilíngue',
    catalogLabel:'CATÁLOGO ABERTO', projectsTitle:'Projetos em destaque', projectsIntro:'Código, documentação e pesquisas reunidos num só lugar. Cada projeto mantém sua identidade e seu próprio repositório.',
    searchLabel:'Pesquisar projetos', searchPlaceholder:'Pesquisar nome, tecnologia ou assunto...',filterAll:'Todos',filterResearch:'Pesquisa',filterAi:'IA & Dados',filterTools:'Ferramentas',filterLibraries:'Bibliotecas',filterEducation:'Educação',
    catalogHint:'SELEÇÃO CURADA / GITHUB',catalogLoading:'Carregando projetos...',catalogCount:(n)=>`${n} projeto${n === 1 ? '' : 's'} encontrado${n === 1 ? '' : 's'}`,catalogUnavailable:'Não foi possível carregar o catálogo. Consulte os repositórios no GitHub.',
    featured:'EM DESTAQUE',repository:'Código ↗',website:'Acessar ↗',noResults:'Nenhum projeto encontrado.',noResultsHint:'Experimente outra palavra-chave ou categoria.',clearFilters:'Limpar filtros',allRepos:'Ver todos os repositórios no GitHub',
    approachLabel:'MÉTODO E PRINCÍPIOS',approachTitle:'Construir, verificar, compartilhar.',approachIntro:'O laboratório conecta hipóteses, modelos e protótipos. Publicar código e documentação é parte do processo de pesquisa.',
    principle1Title:'Experimentação',principle1Body:'Testamos ideias com modelos, simulações e implementações reproduzíveis.',principle2Title:'Engenharia aberta',principle2Body:'Compartilhamos ferramentas, decisões técnicas e caminhos de evolução.',principle3Title:'Colaboração',principle3Body:'A documentação e o código oferecem pontos de partida para crítica e contribuição.',
    connectLabel:'CONTINUE A EXPLORAÇÃO',contactTitle:'A próxima descoberta<br><span>começa com uma pergunta.</span>',visitGitHub:'Visitar organização no GitHub',footerTag:'Ciência aberta, código compartilhado.',categories:{research:'Pesquisa',ai:'IA & Dados',tools:'Ferramentas',libraries:'Bibliotecas',education:'Educação'}
  },
  en: {
    skip:'Skip to content',navProjects:'Projects',navApproach:'Our approach',navInstitute:'Laboratory',
    heroEyebrow:'OPEN SOURCE OBSERVATORY / CECIL-IA LABS',heroTitle:'Ideas in orbit.<br><span>Knowledge in code.</span>',
    heroDescription:'We investigate systems, build tools, and share the process. A space for open science, software engineering, and applied experimentation.',
    explore:'Explore projects',institutional:'Visit the laboratory',statProjects:'cataloged repositories',statOpen:'public catalog',statLanguages:'bilingual interface',
    catalogLabel:'OPEN CATALOG',projectsTitle:'Featured projects',projectsIntro:'Code, documentation, and research in one place. Every project retains its identity and its own repository.',
    searchLabel:'Search projects',searchPlaceholder:'Search by name, technology, or topic...',filterAll:'All',filterResearch:'Research',filterAi:'AI & Data',filterTools:'Tools',filterLibraries:'Libraries',filterEducation:'Education',
    catalogHint:'CURATED SELECTION / GITHUB',catalogLoading:'Loading projects...',catalogCount:(n)=>`${n} project${n === 1 ? '' : 's'} found`,catalogUnavailable:'Could not load the catalog. Browse repositories on GitHub.',
    featured:'FEATURED',repository:'Source ↗',website:'Visit ↗',noResults:'No matching projects.',noResultsHint:'Try a different search or category.',clearFilters:'Clear filters',allRepos:'Browse all repositories on GitHub',
    approachLabel:'METHOD & PRINCIPLES',approachTitle:'Build, verify, share.',approachIntro:'The laboratory links hypotheses, models, and prototypes. Publishing code and documentation is part of the research process.',
    principle1Title:'Experimentation',principle1Body:'We test ideas with models, simulations, and reproducible implementations.',principle2Title:'Open engineering',principle2Body:'We share tools, technical decisions, and paths for further development.',principle3Title:'Collaboration',principle3Body:'Documentation and code provide starting points for feedback and contributions.',
    connectLabel:'KEEP EXPLORING',contactTitle:'The next discovery<br><span>starts with a question.</span>',visitGitHub:'Visit GitHub organization',footerTag:'Open science, shared code.',categories:{research:'Research',ai:'AI & Data',tools:'Tools',libraries:'Libraries',education:'Education'}
  }
};

let preferredLanguage = 'pt';
try { preferredLanguage = localStorage.getItem('cecil-labs-lang') === 'en' ? 'en' : 'pt'; } catch { /* Storage may be disabled. */ }
const state = {lang:preferredLanguage, category:'all',query:'',projects:[]};
const els = {
  grid:document.getElementById('project-grid'),result:document.getElementById('result-count'),empty:document.getElementById('empty-state'),
  filters:document.getElementById('filters'),search:document.getElementById('search'),lang:document.getElementById('language-toggle')
};
const makeElement = (tag, className, text) => {
  const el=document.createElement(tag);
  if(className) el.className=className;
  if(text !== undefined) el.textContent=text;
  return el;
};
function safeHref(value) {
  try {const url=new URL(value);return url.protocol==='https:' ? url.href : null;} catch {return null;}
}
function updateLanguage() {
  const t=labels[state.lang];
  document.documentElement.lang=state.lang==='pt'?'pt-BR':'en';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(typeof t[key]==='string') el.textContent=t[key];});
  // The only HTML fragments here are controlled, static translations in this file.
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{const key=el.dataset.i18nHtml;if(typeof t[key]==='string') el.innerHTML=t[key];});
  els.search.placeholder=t.searchPlaceholder;
  els.lang.textContent=state.lang==='pt'?'EN':'PT';
  els.lang.setAttribute('aria-label',state.lang==='pt'?'Switch language to English':'Mudar idioma para português');
  els.filters.setAttribute('aria-label',state.lang==='pt'?'Filtrar por categoria':'Filter by category');
  render();
}
function render() {
  const t=labels[state.lang];const query=state.query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const matches=state.projects.filter(p=>{
    if(state.category!=='all' && p.category!==state.category) return false;
    const haystack=[p.name,p.id,p.description?.pt,p.description?.en,...(p.tags||[])].filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return haystack.includes(query);
  });
  matches.sort((a,b)=>Number(b.featured)-Number(a.featured)||a.name.localeCompare(b.name));
  els.grid.replaceChildren();
  const fragment=document.createDocumentFragment();
  for (const p of matches) {
    const card=makeElement('article','project-card');
    const overline=makeElement('div','card-overline');
    overline.append(makeElement('span','card-category',t.categories[p.category]||p.category));
    if(p.featured) overline.append(makeElement('span','card-featured',t.featured));
    card.append(overline,makeElement('h3','',p.name),makeElement('p','',p.description?.[state.lang]||p.description?.pt||''));
    const tags=makeElement('div','tags');for(const tag of (p.tags||[]).slice(0,4)) tags.append(makeElement('span','tag',tag));card.append(tags);
    const links=makeElement('div','project-links');
    const repo=safeHref(p.repository);if(repo){const a=makeElement('a','',t.repository);a.href=repo;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`${p.name} — GitHub`);links.append(a);}
    const website=safeHref(p.website);if(website){const a=makeElement('a','secondary',t.website);a.href=website;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`${p.name} — ${state.lang==='pt'?'site ou publicação':'site or publication'}`);links.append(a);}
    card.append(links);fragment.append(card);
  }
  els.grid.append(fragment);els.empty.hidden=matches.length>0;
  els.result.textContent=t.catalogCount(matches.length);
}
els.filters.addEventListener('click',e=>{
  const button=e.target.closest('button[data-category]');if(!button||!els.filters.contains(button))return;
  state.category=button.dataset.category;
  els.filters.querySelectorAll('button').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});render();
});
els.search.addEventListener('input',e=>{state.query=e.target.value;render();});
const clear=()=>{state.query='';state.category='all';els.search.value='';const all=els.filters.querySelector('[data-category="all"]');els.filters.querySelectorAll('button').forEach(b=>{const active=b===all;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});render();els.search.focus();};
document.getElementById('clear-filters').addEventListener('click',clear);
els.lang.addEventListener('click',()=>{state.lang=state.lang==='pt'?'en':'pt';try{localStorage.setItem('cecil-labs-lang',state.lang);}catch{}updateLanguage();});
document.getElementById('year').textContent=String(new Date().getFullYear());
updateLanguage();
try {
  const response=await fetch('/data/projects.json',{cache:'no-cache'});
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const projects=await response.json();if(!Array.isArray(projects))throw new Error('Invalid catalog');
  state.projects=projects;document.getElementById('stat-total').textContent=String(projects.length).padStart(2,'0');render();
}catch(error){els.result.textContent=labels[state.lang].catalogUnavailable;console.error('Could not load catalog:',error);}
