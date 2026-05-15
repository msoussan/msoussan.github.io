// Theme + footer plumbing.
// - Inline pre-paint script in <head> sets data-theme before first render.
// - This script: syncs aria-pressed on every .theme-toggle, stamps the current
//   year into [data-current-year] slots, and delegates clicks so multiple
//   toggles (e.g. nav + footer) stay in lockstep.

(function () {
  function syncToggleState() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var buttons = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
    }
  }

  function stampYear() {
    var year = String(new Date().getFullYear());
    var slots = document.querySelectorAll('[data-current-year]');
    for (var i = 0; i < slots.length; i += 1) {
      slots[i].textContent = year;
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncToggleState();
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    stampYear();
    syncToggleState();
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle')) {
      toggleTheme();
    }
  });

  // Clipboard: flash "Copied" on any [data-copy] button.
  function flashCopied(btn) {
    btn.setAttribute('data-state', 'copied');
    setTimeout(function () { btn.removeAttribute('data-state'); }, 1600);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var text = btn.getAttribute('data-copy');
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flashCopied(btn); });
      return;
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); flashCopied(btn); } catch (err) { /* ignore */ }
    document.body.removeChild(ta);
  });
}());
