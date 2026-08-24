(function(){'use strict';
const SUPABASE_URL='https://bopezesfrmdxiagvvyyh.supabase.co';
const SUPABASE_KEY='sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function css(){
 if($('webs-joint-style'))return;
 const s=document.createElement('style');s.id='webs-joint-style';s.textContent=`
 .wj-shell{animation:wjIn .35s ease}.wj-head{display:flex;justify-content:space-between;align-items:end;gap:16px;margin-bottom:20px}.wj-head h2{margin:5px 0 0;font-size:30px}.wj-head p{margin:5px 0 0;color:#7f8ba7;line-height:1.55}.wj-refresh{border:1px solid rgba(139,108,255,.25);background:rgba(12,18,40,.8);color:#fff;border-radius:13px;padding:11px 15px;cursor:pointer}.wj-refresh:disabled{opacity:.55}.wj-grid{display:grid;gap:16px}.wj-bot{border:1px solid rgba(139,108,255,.18);border-radius:22px;background:linear-gradient(145deg,rgba(11,18,40,.94),rgba(7,11,27,.96));padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.2);overflow:hidden}.wj-bot-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.wj-bot-title{display:flex;align-items:center;gap:12px}.wj-bot-icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#5b38c6,#a77b2f);font-weight:900;box-shadow:0 8px 28px rgba(112,79,224,.18)}.wj-bot-title h3{margin:0;font-size:18px}.wj-bot-title small{display:block;color:#75819b;margin-top:4px}.wj-count{font-size:11px;color:#aeb8d0;border:1px solid rgba(139,108,255,.2);padding:7px 10px;border-radius:999px}.wj-sites{display:grid;gap:10px;margin-top:15px}.wj-site{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:15px;border-radius:17px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);transition:.2s ease}.wj-site:hover{border-color:rgba(139,108,255,.22);transform:translateY(-1px)}.wj-site-main strong{display:block;font-size:15px}.wj-site-main span{display:block;color:#7f8ba7;font-size:11px;margin-top:4px;word-break:break-all}.wj-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.wj-pill{font-size:9px;padding:5px 8px;border-radius:999px;background:rgba(139,108,255,.08);border:1px solid rgba(139,108,255,.12);color:#aeb8d0}.wj-pill.active{color:#7ff0bd;border-color:rgba(82,232,169,.18);background:rgba(82,232,169,.06)}.wj-pill.suspended{color:#ffd27b;border-color:rgba(244,211,122,.18);background:rgba(244,211,122,.06)}.wj-pill.removed{color:#ff9cac;border-color:rgba(255,100,125,.18);background:rgba(255,100,125,.06)}.wj-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.wj-actions button{border:1px solid rgba(255,255,255,.1);background:#0b1228;color:#fff;border-radius:10px;padding:8px 10px;cursor:pointer;font-size:11px;transition:.18s}.wj-actions button:hover{transform:translateY(-1px);filter:brightness(1.08)}.wj-actions button:disabled{opacity:.55;cursor:not-allowed;transform:none}.wj-actions .restore{border-color:rgba(82,232,169,.2);color:#7ff0bd}.wj-actions .danger{border-color:rgba(255,100,125,.22);color:#ff9cac}.wj-actions .warn{border-color:rgba(244,211,122,.2);color:#f4d37a}.wj-actions .neutral{border-color:rgba(139,108,255,.2);color:#bcaaff}.wj-empty{padding:35px 18px;text-align:center;border:1px dashed rgba(139,108,255,.2);border-radius:20px;color:#7f8ba7}.wj-loading{padding:35px;text-align:center;color:#8d99b2}.wj-error{padding:16px;border:1px solid rgba(255,100,125,.2);background:rgba(255,70,100,.05);border-radius:16px;color:#ffacb9}@keyframes wjIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@media(max-width:650px){.wj-head{align-items:flex-start;flex-direction:column}.wj-refresh{width:100%}.wj-site{grid-template-columns:1fr}.wj-actions{justify-content:flex-start}.wj-actions button{flex:1;min-width:90px}}
 `;document.head.appendChild(s)
}
function statusClass(status){return status==='removed'?'removed':status==='suspended'?'suspended':'active'}
function statusLabel(status){return status==='removed'?'REMOVED':status==='suspended'?'SUSPENDED':'ACTIVE'}
function actionLabel(status){if(status==='active')return 'Suspend';return 'Restore'}
function actionTarget(status){if(status==='active')return 'suspended';return 'active'}
function render(rows){
 const root=$('page-webs');if(!root)return;
 if(!rows.length){root.innerHTML='<div class="wj-shell"><div class="wj-head"><div><span class="section-label">WEBS JOINED</span><h2>Connected Websites</h2><p>Duk websites da suka yi amfani da bot ɗinka za su bayyana a nan.</p></div><button class="wj-refresh" id="wj-refresh">↻ Refresh</button></div><div class="wj-empty">Babu website da ya haɗu da bot tukuna.</div></div>';bind();return}
 const groups={};rows.forEach(r=>{const key=r.bot_id;if(!groups[key])groups[key]={bot_id:r.bot_id,bot_name:r.bot_name,sites:[]};groups[key].sites.push(r)});
 root.innerHTML='<div class="wj-shell"><div class="wj-head"><div><span class="section-label">WEBS JOINED</span><h2>Connected Websites</h2><p>Duk websites da suka haɗu da bots ɗinka. Status, ID, activity da access controls suna nan wuri ɗaya.</p></div><button class="wj-refresh" id="wj-refresh">↻ Refresh</button></div><div class="wj-grid">'+Object.values(groups).map(g=>`<section class="wj-bot"><div class="wj-bot-top"><div class="wj-bot-title"><div class="wj-bot-icon">⚡</div><div><h3>${esc(g.bot_name)}</h3><small>Bot ID: ${esc(g.bot_id)}</small></div></div><span class="wj-count">${g.sites.length} website${g.sites.length===1?'':'s'}</span></div><div class="wj-sites">${g.sites.map(s=>{const status=s.link_status||'active';const when=s.last_seen_at?new Date(s.last_seen_at).toLocaleString(): 'Never';return `<article class="wj-site"><div class="wj-site-main"><strong>${esc(s.website_name||'Unknown Website')}</strong><span>${esc(s.origin_host||'Unknown origin')}</span><div class="wj-meta"><span class="wj-pill">${esc(s.website_id)}</span><span class="wj-pill ${statusClass(status)}">${statusLabel(status)}</span><span class="wj-pill">Last seen: ${esc(when)}</span></div></div><div class="wj-actions">${status==='active'?`<button class="warn" data-action="suspended" data-bot="${esc(s.bot_id)}" data-link="${esc(s.link_id)}">Suspend</button>`:`<button class="restore" data-action="active" data-bot="${esc(s.bot_id)}" data-link="${esc(s.link_id)}">Restore</button>`}${status!=='removed'?`<button class="danger" data-action="removed" data-bot="${esc(s.bot_id)}" data-link="${esc(s.link_id)}">Remove</button>`:''}</div></article>`}).join('')}</div></section>`).join('')+'</div></div>';
 bind();
}
function bind(){
 const refresh=$('wj-refresh');if(refresh)refresh.onclick=load;
 document.querySelectorAll('#page-webs [data-action]').forEach(btn=>btn.addEventListener('click',async()=>{
   const action=btn.dataset.action;const session=window.__sadeeqConsoleSession?.();if(!session)return;
   const original=btn.textContent;btn.disabled=true;btn.textContent=action==='removed'?'Removing...':action==='suspended'?'Suspending...':'Restoring...';
   const {error}=await sb.rpc('set_owner_website_status',{p_session:session,p_bot_id:btn.dataset.bot,p_website_id:btn.dataset.link,p_status:action});
   if(error){btn.disabled=false;btn.textContent=original;alert('Ba a iya canza status na website ba. Gwada Refresh.');return}
   await load();
 }));
}
async function load(){
 const root=$('page-webs');if(!root)return;css();root.innerHTML='<div class="wj-loading">Ana loda Webs Joined...</div>';
 const session=window.__sadeeqConsoleSession?.();if(!session){root.innerHTML='<div class="wj-error">Owner session bai samu ba.</div>';return}
 const {data,error}=await sb.rpc('list_owner_websites',{p_session:session});
 if(error){root.innerHTML='<div class="wj-error">Ba a iya loda Webs Joined ba. Gwada Refresh.</div>';return}
 render(Array.isArray(data)?data:[]);
}
window.showSadeeqWebs=load;
// Public dashboard hook. Keep the module-specific name above for backwards compatibility.
window.showWebsJoined=load;
})();
