/* Final Bot Playground hook — targets the actual Level 8 Bot Settings markup. */
(function(){'use strict';
function attach(){
  const page=document.getElementById('page-bots');
  if(!page || page.classList.contains('hidden')) return;
  if(document.getElementById('open-bot-playground')) return;
  const code=page.querySelector('.l8-code textarea');
  if(!code) return;
  let id='';
  const iframe=page.querySelector('iframe[data-bot-id]');
  if(iframe) id=iframe.getAttribute('data-bot-id')||'';
  if(!id){
    const m=(code.value||'').match(/[?&]bot_id=([^&\"']+)/);
    if(m) id=decodeURIComponent(m[1]);
  }
  if(!id) return;
  const wrap=document.createElement('div');
  wrap.id='bot-playground-action';
  wrap.style='display:flex;justify-content:center;gap:10px;margin:14px 0 0';
  wrap.innerHTML='<button id="open-bot-playground" class="secondary-btn" type="button" style="min-width:240px;padding:13px 18px;border-radius:14px;cursor:pointer">✦ Open Bot Playground</button>';
  const codeBox=code.closest('.l8-code')||code.parentElement||page.querySelector('.l8-section');
  (codeBox||page).appendChild(wrap);
  document.getElementById('open-bot-playground').onclick=function(){
    if(typeof window.openBotPlayground==='function') window.openBotPlayground(id);
    else if(typeof window.showBotPlayground==='function') window.showBotPlayground(id);
  };
}
const observer=new MutationObserver(attach);
observer.observe(document.body,{subtree:true,childList:true});
window.attachBotPlayground=attach;
setTimeout(attach,100);
setInterval(attach,500);
})();
