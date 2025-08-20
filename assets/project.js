async function loadProject(){
  const base = window.PATHS || {DATA:'./data', LANG:'ja'}
  const res = await fetch(`${base.DATA}/projects-${base.LANG}.json`)
  const list = await res.json()
  const params = new URLSearchParams(location.search)
  const slug = params.get('slug')
  const p = list.find(x=>x.slug===slug)
  const t = base.LANG==='en'
  if(!p){ document.getElementById('detail').textContent = t?'Not found.':'見つかりませんでした。'; return }
  document.title = `${p.title} | Portfolio`
  document.getElementById('bc').innerHTML = `<a href="../index.html">${t?'Home':'Home'}</a> / <a href="index.html">Projects</a> / ${p.title}`
  document.getElementById('title').textContent = p.title
  document.getElementById('periodRole').textContent = [p.period,p.role].filter(Boolean).join(' / ')
  document.getElementById('summary').textContent = p.summary
  document.getElementById('problem').textContent = p.problem
  document.getElementById('actions').innerHTML = (p.actions||[]).map(a=>`<li>${a}</li>`).join('')
  document.getElementById('result').textContent = p.result
  document.getElementById('role').textContent = p.role || ''
  document.getElementById('tech').innerHTML = (p.tech||[]).map(tg=>`<span class="tag">${tg}</span>`).join('')
  const links = (p.links||[]).map(l=>`<li><a href="${l.href}" target="_blank" rel="noreferrer">${l.label||l.href}</a></li>`).join('')
  document.getElementById('links').innerHTML = links || (t?'<em>No external links</em>':'<em>外部リンクなし</em>')
}
document.addEventListener('DOMContentLoaded', loadProject)
