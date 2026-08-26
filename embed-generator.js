(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const getBotId = () => $('bot-id')?.value?.trim() || new URLSearchParams(location.search).get('bot')?.trim() || '';

  function buildCode() {
    const botId = getBotId();
    if (!botId) return '';
    const base = location.origin + location.pathname.replace(/[^/]*$/, '');
    const src = `${base}bot.html?bot_id=${encodeURIComponent(botId)}`;
    return `<iframe src="${src}" title="Sadeeq AI" style="width:100%;height:680px;border:0;border-radius:16px;overflow:hidden" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="clipboard-write"></iframe>`;
  }

  function render() {
    const code = buildCode();
    const out = $('embed-code');
    if (out) out.value = code;
    const preview = $('embed-preview');
    if (preview && code) preview.src = new DOMParser().parseFromString(code, 'text/html').querySelector('iframe').src;
  }

  async function copyCode() {
    const code = buildCode();
    if (!code) return alert('Enter or select a Bot ID first.');
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const out = $('embed-code'); out?.select(); document.execCommand('copy');
    }
    const btn = $('copy-embed');
    if (btn) { const old = btn.textContent; btn.textContent = 'Copied ✓'; setTimeout(() => btn.textContent = old, 1500); }
  }

  window.SadeeqEmbed = { buildCode, render, copyCode };
  document.addEventListener('DOMContentLoaded', () => {
    $('bot-id')?.addEventListener('input', render);
    $('copy-embed')?.addEventListener('click', copyCode);
    render();
  });
})();
