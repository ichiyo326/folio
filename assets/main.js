// tiny helpers
function $(q,root=document){return root.querySelector(q)}
function $all(q,root=document){return Array.from(root.querySelectorAll(q))}
// Each HTML sets window.PATHS = { DATA:'data or ../data', LANG:'ja'|'en' }
