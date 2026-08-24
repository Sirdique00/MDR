/* Sadeeq AI Hub • Final UI enforcement */
(function(){
'use strict';
const HOME='#page-home';
function styles(){
  if(document.getElementById('ui-final-fixes-css'))return;
  const s=document.createElement('style');s.id='ui-final-fixes-css';
  s.textContent=`
    #page-home{padding:0!important;margin:0!important}
    #page-home>.owner-home{display:block!important;width:100%!important;margin:0!important;padding:0!important}
    #page-home>.owner-home>.server-board{width:100%!important;height:700px!important;min-height:700px!important;max-height:700px!important;box-sizing:border-box!important;margin:0!important}
    #page-home .server-messages{min-height:0!important;max-height:none!important;flex:1 1 auto!important}
    #page-home .home-controls,#page-home .compact-server-controls,#page-home .compact-server-toolbar,#page-home .board-note,#page-home .board-badge{display:none!important}
    #direct-open-bot-playground{width:100%!important;margin-top:12px!important;min-height:46px!important;display:block!important}
  `;document.head.appendChild(s)
}
function purgeHome(){
  const page=document.querySelector(HOME);if(!page||page.classList.contains('hidden'))return;
  styles();
  /* Home has exactly one owner: home-console.js. Remove every legacy/duplicate block. */
  [...page.children].forEach(el=>{if(!el.classList.contains('owner-home'))el.remove()});
  const home=page.querySelector('.owner-home');
  if(!home)return;
  const board=home.querySelector('.server-board');
  if(!board)return;
  board.style.width='100%';board.style.height='700px';board.style.minHeight='700px';board.style.maxHeight='700px';
  home.querySelectorAll('.home-controls,.compact-server-controls,.compact-server-toolbar,.board-note,.board-badge').forEach(el=>el.remove());
}
function playgroundFix(){
  const page=document.getElementById('page-bots');if(!page||page.classList.contains('hidden'))return;
  const code=page.querySelector('#iframe-code');
  const iframeBox=page.querySelector('.iframe-box');
  if(!code||!iframeBox||page.querySelector('#direct-open-bot-playground'))return;
  styles();
  const button=document.createElement('button');button.id='direct-open-bot-playground';button.type='button';button.className='primary-btn';button.textContent='✦ Open Bot Playground';
  button.onclick=function(){const m=code.value.match(/[?&]bot_id=([^&\"']+)/);const id=m?decodeURIComponent(m[1]):null;if(id&&typeof window.openBotPlayground==='function')window.openBotPlayground(id);else alert('Ba a gano Bot ID ba. Ka sake bude Bot Settings.')};
  iframeBox.insertAdjacentElement('afterend',button);
}
function run(){purgeHome();playgroundFix()}
const observer=new MutationObserver(run);observer.observe(document.body,{subtree:true,childList:true});
run();setTimeout(run,250);setTimeout(run,1000);setInterval(run,2000);
})();
