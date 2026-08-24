/* Final Bot Playground button hook — works with the secure Bot Settings renderer. */
(function(){'use strict';
function getId(page){
  const code=page.querySelector('#secure-iframe')||page.querySelector('#iframe-code');
  const value=code?.value||'';
  const m=value.match(/[?&]bot_id=([^&"'<>\s]+)/);
  return m?decodeURIComponent(m[1]):'';
}
function attach(){
  const page=document.getElementById('page-bots');
  if(!page||page.classList.contains('hidden'))return;
  const box=page.querySelector('.l8-code')||page.querySelector('.iframe-box');
  if(!box)return;
  const id=getId(page);if(!id)return;
  let button=document.getElementById('open-bot-playground');
  if(!button){
    const wrap=document.createElement('div');
    wrap.id='bot-playground-action';
    wrap.style='display:flex;justify-content:center;margin:14px 0 0';
    wrap.innerHTML='<button id="open-bot-playground" type="button" style="min-width:240px;padding:13px 18px;border:1px solid rgba(143,119,255,.35);border-radius:14px;background:linear-gradient(135deg,#5f3fe0,#8a43c7);color:#fff;font-weight:900;cursor:pointer;box-shadow:0 10px 28px rgba(80,52,180,.22);transition:.2s">✦ Open Bot Playground</button>';
    box.appendChild(wrap);button=wrap.querySelector('#open-bot-playground');
  }
  button.onclick=()=>{
    if(typeof window.openBotPlayground==='function')window.openBotPlayground(id);
    else alert('Playground bai load ba. Ka sake refresh page.');
  };
}
const observer=new MutationObserver(attach);observer.observe(document.body,{subtree:true,childList:true});
window.attachBotPlayground=attach;
setTimeout(attach,50);setTimeout(attach,250);setTimeout(attach,1000);setInterval(attach,700);
})();
