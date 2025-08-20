// tiny helpers
function $(q,root=document){return root.querySelector(q)}
function $all(q,root=document){return Array.from(root.querySelectorAll(q))}
// Each HTML sets window.PATHS = { DATA:'data or ../data', LANG:'ja'|'en' }

// Scroll-in animations (Cool Minimal)
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.animate');
  if (!('IntersectionObserver' in window) || els.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
});
