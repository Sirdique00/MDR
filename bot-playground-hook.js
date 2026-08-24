(function(){'use strict';
function attach(){
  const page=document.getElementById('page-bots');
  if(!page||page.classList.contains('hidden'))return;
  const card=page.querySelector('.bot-settings-card');
  const code=page.querySelector('#iframe-code');
  if(!card||!code||document.getElementById('open-bot-playground'))return;
  const m=code.value.match(/[?&]bot_id=([^&\"']+)/);
  if(!m)return;
  const wrap=document.createElement('div');
  wrap.id='bot-playground-action';
  wrap.style='display:flex;justify-content:center;margin:14px 0 0';
  wrap.innerHTML='<button id="open-bot-playground" class="secondary-btn" type="button" style="min-width:240px">✦ Open Bot Playground</button>';
  const iframeSection=code.closest('.bot-section');
  (iframeSection||card).appendChild(wrap);
  const btn=document.getElementById('open-bot-playground');
  btn.onclick=()=>window.openBotPlayground?.(decodeURIComponent(m[1]));
}
const observer=new MutationObserver(attach);
observer.observe(document.body,{subtree:true,childList:true});
setInterval(attach,700);
window.attachBotPlayground=attach;
})();