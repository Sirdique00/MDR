/* Sadeeq • Create Bot page hard guard
   This page is intentionally form-only. Existing bots belong only to All Bots. */
(function(){
  'use strict';
  const page=()=>document.getElementById('page-bots');
  const legacySelectors=[
    '[data-bot-id]','.bot-card','.bots-list-panel','.bot-list','.bot-id-visual',
    '.bot-auto-points','.bot-auto-point','.bot-info-card','.all-bots-list',
    '.bot-collection','.bot-inventory','#all-only-list','.bot-id-section',
    '.automatic-bot-id','.your-bots','.bot-section-list','#bot-refresh'
  ];

  function clean(){
    const root=page();
    if(!root) return;

    // Remove every known bot-list/card/inventory/ID fragment from Create Bot.
    legacySelectors.forEach(selector=>{
      try{ root.querySelectorAll(selector).forEach(el=>el.remove()); }catch(_){ }
    });

    const form=root.querySelector('#create-bot-form');
    if(!form) return;

    // Keep only the containers that actually lead to the Create Bot form.
    const keep=new Set([form]);
    let node=form.parentElement;
    while(node && node!==root){ keep.add(node); node=node.parentElement; }

    [...root.children].forEach(child=>{
      if(keep.has(child)) return;
      // Feedback is part of the creation workflow.
      if(child.id==='bot-feedback') return;
      child.remove();
    });

    // No automatic Bot ID, inventory, bot collection, or All Bots text here.
    const forbiddenText=/automatic\s+bot\s+id|bot\s+collection|your\s+bots|all\s+bots|inventory|jerin\s+dukkan\s+bots|bots?\s*\(\s*\d+\s*\)/i;
    [...root.querySelectorAll('*')].forEach(el=>{
      if(el.id==='create-bot-form' || el.closest('#create-bot-form')) return;
      if(el.children.length===0 && forbiddenText.test(el.textContent||'')) el.remove();
    });
  }

  function start(){
    clean();
    const root=page();
    if(!root || root.dataset.createOnlyGuard==='1') return;
    root.dataset.createOnlyGuard='1';
    const observer=new MutationObserver(()=>clean());
    observer.observe(root,{childList:true,subtree:true});
    window.__sadeeqCreateBotOnlyGuard=observer;
    window.addEventListener('pageshow',clean);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
  window.sadeeqEnforceCreateBotOnly=clean;
})();
