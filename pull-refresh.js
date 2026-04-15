(() => {
  const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  if (!isStandalone || !('ontouchstart' in window)) return;

  const indicator = document.createElement('div');
  indicator.textContent = 'Pull to refresh';
  indicator.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;text-align:center;padding:10px 0;font-family:DM Sans,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#9e9890;background:#f9f6f0;transform:translateY(-100%);transition:transform .18s ease;pointer-events:none;';
  document.body.appendChild(indicator);

  let startY = 0;
  let pulling = false;
  let distance = 0;
  const threshold = 80;

  window.addEventListener('touchstart', (e) => {
    if (window.scrollY <= 0) {
      startY = e.touches[0].clientY;
      pulling = true;
      distance = 0;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!pulling || window.scrollY > 0) return;
    distance = e.touches[0].clientY - startY;
    if (distance > 12) {
      const progress = Math.min(distance / threshold, 1);
      indicator.textContent = progress >= 1 ? 'Release to refresh' : 'Pull to refresh';
      indicator.style.transform = `translateY(${(-100 + progress * 100)}%)`;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (!pulling) return;
    pulling = false;
    if (distance > threshold) {
      indicator.textContent = 'Refreshing…';
      indicator.style.transform = 'translateY(0)';
      setTimeout(() => window.location.reload(), 120);
    } else {
      indicator.style.transform = 'translateY(-100%)';
    }
  }, { passive: true });
})();
