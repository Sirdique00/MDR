/* Stable Bot Playground integration for the actual Bot Settings markup. */
(function(){'use strict';
function getBotId(page){
  const iframe=page.querySelector('iframe[data-bot-id]');
  if(iframe?.dataset?.botId) return iframe.dataset.botId;
  const code=page.querySelector('#iframe-code');
  const m=(code?.value||'').match(/[?&]bot_id=([^&"']+)/);
  return m?decodeURIComponent(m[1]):'';
}
function attach(){
  const page=document.getElementById('page-bots');
  if(!page || page.classList.contains('hidden')) return;
  const codeBox=page.querySelector('.iframe-box');
  if(!codeBox) return;
  const id=getBotId(page); if(!id) return;
  let wrap=document.getElementById('bot-playground-action');
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='bot-playground-action';
    wrap.style='display:flex;justify-content:center;margin:14px 0 0;animation:pgHookIn .25s ease both';
    wrap.innerHTML='<button id="open-bot-playground" class="secondary-btn" type="button" style="min-width:240px;padding:13px 18px;border-radius:14px;cursor:pointer">✦ Open Bot Playground</button>';
    codeBox.appendChild(wrap);
  }
  const btn=document.getElementById('open-bot-playground');
  if(!btn)return;
  btn.onclick=()=>{
    if(typeof window.openBotPlayground==='function') window.openBotPlayground(id);
    else alert('Playground bai gama load ba. Ka sake refresh page.');
  };
}
const style=document.createElement('style');style.textContent='@keyframes pgHookIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}';document.head.appendChild(style);
const observer=new MutationObserver(attach);observer.observe(document.body,{subtree:true,childList:true});
window.attachBotPlayground=attach;setTimeout(attach,100);setInterval(attach,800);
})();
