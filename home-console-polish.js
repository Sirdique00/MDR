(function(){'use strict';
function polish(){
  const page=document.getElementById('page-home');
  if(!page||page.classList.contains('hidden'))return;
  const board=page.querySelector('.server-board');
  const controls=page.querySelector('.home-controls');
  if(!board||!controls)return;
  let bar=board.querySelector('.compact-server-controls');
  if(!bar){
    bar=document.createElement('div');
    bar.className='compact-server-controls';
    const mode=controls.querySelector('#server-mode-switch')?.closest('.home-switch');
    const power=controls.querySelector('#bots-master-switch')?.closest('.home-switch');
    if(!mode||!power)return;
    bar.innerHTML='';
    const make=(label,node)=>{const item=document.createElement('div');item.className='compact-control';const text=document.createElement('span');text.textContent=label;item.appendChild(text);item.appendChild(node.querySelector('button'));return item};
    bar.appendChild(make('Mode',mode));
    bar.appendChild(make('Power',power));
    board.querySelector('.server-board-head')?.before(bar);
  }
  controls.remove();
  const note=board.querySelector('.board-note');
  if(note)note.remove();
  const badge=board.querySelector('.board-badge');
  if(badge)badge.remove();
  const old=document.getElementById('home-console-polish-css');
  if(!old){const s=document.createElement('style');s.id='home-console-polish-css';s.textContent=`
    .owner-home{gap:14px}.home-controls{display:none!important}
    .server-board{min-height:620px;padding:18px;border-radius:22px}
    .compact-server-controls{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding:5px 6px;border:1px solid rgba(143,119,255,.15);border-radius:14px;background:rgba(5,10,25,.62);width:max-content;max-width:100%}
    .compact-control{display:flex;align-items:center;gap:7px;padding:3px 5px;color:#aeb8d0;font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
    .compact-control button.switch{width:38px;height:22px;padding:2px;box-shadow:none}.compact-control button.switch i{width:18px;height:18px}.compact-control button.switch.on i{transform:translateX(16px)}
    .server-board-head{margin-bottom:8px}.server-board h3{margin:2px 0;font-size:17px}
    @media(max-width:600px){.compact-server-controls{width:100%;justify-content:flex-start}.server-board{min-height:540px}}
  `;document.head.appendChild(s)}
}
const observer=new MutationObserver(polish);observer.observe(document.body,{subtree:true,childList:true});setInterval(polish,700);setTimeout(polish,200);
})();