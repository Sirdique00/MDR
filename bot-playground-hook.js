/* Sadeeq AI • FINAL Bot Playground integration */
(function(){'use strict';
  const esc=v=>String(v??'').replace(/[&<>\'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function getPage(){return document.getElementById('page-bots')}
  function getBotId(page){
    const iframe=page?.querySelector('iframe[data-bot-id]');
    if(iframe?.dataset?.botId)return iframe.dataset.botId;
    const code=page?.querySelector('#iframe-code,.l8-code textarea');
    const value=code?.value||code?.textContent||'';
    const m=value.match(/[?&]bot_id=([^&"'<>\s]+)/);
    return m?decodeURIComponent(m[1]):'';
  }
  function ensureStyle(){
    if(document.getElementById('final-playground-style'))return;
    const s=document.createElement('style');s.id='final-playground-style';s.textContent=`
      #final-playground-action{display:flex!important;justify-content:center!important;align-items:center!important;width:100%!important;margin:14px 0 0!important;clear:both!important}
      #final-playground-action button{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:240px!important;min-height:46px!important;padding:12px 20px!important;border:1px solid rgba(143,119,255,.42)!important;border-radius:14px!important;background:linear-gradient(135deg,#5f3fe0,#9145ce)!important;color:#fff!important;font:800 12px/1 system-ui,sans-serif!important;cursor:pointer!important;box-shadow:0 10px 30px rgba(80,52,180,.25)!important;transition:transform .2s ease,filter .2s ease,box-shadow .2s ease!important}
      #final-playground-action button:hover{transform:translateY(-2px)!important;filter:brightness(1.1)!important;box-shadow:0 15px 36px rgba(80,52,180,.34)!important}
      #final-playground-action button:active{transform:scale(.98)!important}
    `;document.head.appendChild(s)
  }
  function attach(){
    const page=getPage();if(!page||page.classList.contains('hidden'))return;
    const id=getBotId(page);if(!id)return;
    ensureStyle();
    const anchor=page.querySelector('.l8-code,.iframe-box');
    if(!anchor)return;
    let action=document.getElementById('final-playground-action');
    if(!action){
      action=document.createElement('div');action.id='final-playground-action';
      action.innerHTML='<button type="button" aria-label="Open Bot Playground">✦ Open Bot Playground</button>';
      anchor.parentElement?.appendChild(action) || anchor.appendChild(action);
    }
    const button=action.querySelector('button');
    if(!button)return;
    button.onclick=()=>{
      if(typeof window.openBotPlayground==='function')window.openBotPlayground(id);
      else if(typeof window.showSadeeqPlayground==='function')window.showSadeeqPlayground(id);
      else alert('Playground bai load ba. Ka sake refresh Owner Console.');
    };
  }
  window.attachBotPlayground=attach;
  const observer=new MutationObserver(()=>attach());
  const start=()=>{if(document.body)observer.observe(document.body,{subtree:true,childList:true});attach();setTimeout(attach,100);setTimeout(attach,500);setTimeout(attach,1500)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  setInterval(attach,1000);
})();
