/* Sadeeq AI Hub • Create Bot / All Bots separation */
(function(){
  'use strict';
  let lastPage=null;

  function addStyles(){
    if(document.getElementById('sadeeq-all-bots-styles')) return;
    const s=document.createElement('style');
    s.id='sadeeq-all-bots-styles';
    s.textContent=`
      #page-bots .bot-view-switch{width:min(100%,820px);margin:0 auto 20px;display:flex;justify-content:center;gap:8px;padding:6px;border:1px solid rgba(143,119,255,.18);border-radius:16px;background:rgba(6,11,28,.72);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
      #page-bots .bot-view-switch button{flex:1;max-width:240px;border:1px solid transparent;border-radius:11px;padding:11px 16px;background:transparent;color:#8792ad;font:600 12px inherit;cursor:pointer;transition:.22s ease}
      #page-bots .bot-view-switch button.active{color:#fff;background:linear-gradient(100deg,rgba(104,69,245,.85),rgba(139,77,242,.72));border-color:rgba(165,143,255,.28);box-shadow:0 8px 24px rgba(80,52,210,.2)}
      #page-bots .bot-view-switch button:hover{color:#fff}
      #page-bots.bot-show-all .bot-create-grid{display:none!important}
      #page-bots.bot-show-all .bots-list-panel{display:block!important;animation:allBotsIn .35s ease both}
      #page-bots.bot-show-create .bot-create-grid{display:grid!important}
      #page-bots.bot-show-create .bots-list-panel{display:none!important}
      @keyframes allBotsIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    `;
    document.head.appendChild(s);
  }

  function setup(){
    const page=document.getElementById('page-bots');
    if(!page || !page.querySelector('.bot-create-grid')) return;
    addStyles();
    const module=page.querySelector('.bot-module');
    if(!module)return;

    let switcher=page.querySelector('.bot-view-switch');
    if(!switcher){
      switcher=document.createElement('div');
      switcher.className='bot-view-switch';
      switcher.innerHTML='<button type="button" data-bot-view="create">＋ Create Bot</button><button type="button" data-bot-view="all">◈ All Bots</button>';
      module.insertAdjacentElement('afterend',switcher);
      switcher.addEventListener('click',function(e){
        const btn=e.target.closest('[data-bot-view]');
        if(!btn)return;
        const view=btn.dataset.botView;
        page.classList.toggle('bot-show-create',view==='create');
        page.classList.toggle('bot-show-all',view==='all');
        switcher.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));
        if(view==='all'){
          if(typeof window.loadSadeeqBots==='function') window.loadSadeeqBots();
          else page.querySelector('#bot-refresh')?.click();
        }
        window.scrollTo({top:0,behavior:'smooth'});
      });
    }

    if(lastPage!==page){
      lastPage=page;
      page.classList.add('bot-show-create');
      page.classList.remove('bot-show-all');
      switcher.querySelector('[data-bot-view="create"]')?.classList.add('active');
    }
  }

  const observer=new MutationObserver(()=>setup());
  function boot(){
    const page=document.getElementById('page-bots');
    if(page)observer.observe(page,{childList:true,subtree:true});
    setup();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
