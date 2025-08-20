async function loadProjects(){
  const base = window.PATHS || {DATA:'./data', LANG:'ja'}
  const url = `${base.DATA}/projects-${base.LANG}.json`
  const res = await fetch(url)
  const list = await res.json()
  const grid = document.querySelector('.grid')
  grid.innerHTML = ''
  list.forEach(p=>{
    const el = document.createElement('article')
    el.className='card'
    const itemHref = `item.html?slug=${encodeURIComponent(p.slug)}`
    el.innerHTML = `
      <h3 class="h2" style="margin:0 0 4px">${p.title}</h3>
      <p class="meta">${[p.period,p.role].filter(Boolean).join(' / ')}</p>
      <p>${p.summary}</p>
      <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div style="margin-top:10px"><a href="${itemHref}">${base.LANG==='en'?'Read more →':'詳細を見る →'}</a></div>
    `
    grid.appendChild(el)
  })
}
document.addEventListener('DOMContentLoaded', loadProjects)
