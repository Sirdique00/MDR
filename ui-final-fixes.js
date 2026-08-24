/* Sadeeq AI Hub • Final UI fixes */
(function(){
'use strict';

function homeFix(){
  const page=document.getElementById('page-home');
  if(!page || page.classList.contains('hidden')) return;
  const board=page.querySelector('.server-board');
  if(!board) return;

  const controls=page.querySelector('.home-controls');
  if(controls){
    let toolbar=board.querySelector('.compact-server-toolbar');
    if(!toolbar){
      toolbar=document.createElement('div');
      toolbar.className='compact-server-toolbar';
      const modeWrap=document.createElement('div');
      modeWrap.className='compact-control';
      modeWrap.innerHTML='<span>Mode</span>';
      const mode=controls.querySelector('#server-mode-switch');
      if(mode) modeWrap.appendChild(mode);
      const powerWrap=document.createElement('div');
      powerWrap.className='compact-control';
      powerWrap.innerHTML='<span>Power</span>';
      const power=controls.querySelector('#bots-master-switch');
      if(power) powerWrap.appendChild(power);
      toolbar.append(modeWrap,powerWrap);
      board.prepend(toolbar);
    }
    controls.remove();
  }

  board.style.width='100%';
  board.style.height='700px';
  board.style.minHeight='700px';
  board.style.maxHeight='700px';
  board.style.boxSizing='border-box';
  board.style.margin='0';

  const messages=board.querySelector('.server-messages');
  if(messages){
    messages.style.minHeight='0';
    messages.style.maxHeight='none';
    messages.style.flex='1 1 auto';
  }
}

function playgroundFix(){
  const page=document.getElementById('page-bots');
  if(!page || page.classList.contains('hidden')) return;
  const code=page.querySelector('#iframe-code');
  if(!code || page.querySelector('#direct-open-bot-playground')) return;
  const iframeBox=page.querySelector('.iframe-box');
  if(!iframeBox) return;
  const button=document.createElement('button');
  button.id='direct-open-bot-playground';
  button.type='button';
  button.className='primary-btn';
  button.textContent='✦ Open Bot Playground';
  button.style.cssText='width:100%;margin-top:12px;min-height:46px;display:block;';
  button.onclick=function(){
    const m=code.value.match(/[?&]bot_id=([^&\"']+)/);
    const id=m?decodeURIComponent(m[1]):null;
    if(id && typeof window.openBotPlayground==='function') window.openBotPlayground(id);
    else alert('Ba a gano Bot ID ba. Ka sake bude Bot Settings.');
  };
  iframeBox.insertAdjacentElement('afterend',button);
}

function run(){homeFix();playgroundFix();}
const observer=new MutationObserver(run);
observer.observe(document.body,{subtree:true,childList:true});
setTimeout(run,250);
setTimeout(run,1000);
setInterval(run,2000);
})();
