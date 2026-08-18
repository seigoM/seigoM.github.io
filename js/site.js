(() => {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  let prev = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const d = y - prev;
    if (y < 60 || d < -4)      header.classList.remove('is-hidden');
    else if (d > 4)            header.classList.add('is-hidden');
    prev = y;
  }, { passive: true });
})();

(() => {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const photos = [...document.querySelectorAll('#photoList .photo')];
  if (!lb || photos.length === 0) return;
  let index = -1;

  const show  = (i) => {
    index = (i + photos.length) % photos.length;
    img.src = photos[index].src;
  };
  const open  = (i) => { show(i); lb.hidden = false;
                         document.body.style.overflow = 'hidden';
                         history.pushState({ lb: true }, ''); };
  const close = ()  => { lb.hidden = true; index = -1;
                         document.body.style.overflow = ''; };

  photos.forEach((p, i) => p.addEventListener('click', () => open(i)));

  window.addEventListener('popstate', () => { if (index >= 0) close(); });
  lb.addEventListener('click', (e) => { if (e.target === lb) history.back(); });
  window.addEventListener('keydown', (e) => {
    if (index < 0) return;
    if (e.key === 'Escape')      history.back();
    if (e.key === 'ArrowRight')  show(index + 1);
    if (e.key === 'ArrowLeft')   show(index - 1);
  });

  let tx = 0, ty = 0;
  lb.addEventListener('touchstart', (e) => {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) show(dx < 0 ? index + 1 : index - 1);
  }, { passive: true });
})();
