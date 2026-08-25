/* Sadeeq AI • API Bot Usage — owner-safe live usage dashboard */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const session=()=>window.__sadeeqConsoleSession?.()||'';
let loading=false;
let timer=null;
function styles(){
 if($('abu-final-css'))return;
 const s=document.createElement('style');s.id='abu-final-css';s.textContent=`
 .abu-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:18px}.abu-tools{display:flex;gap:9px;align-items:center}.abu-refresh{border:1px solid rgba(139,108,255,.25);background:rgba(12,18,40,.82);color:#fff;border-radius:13px;padding:11px 15px;cursor:pointer;font-weight:800}.abu-refresh:disabled{opacity:.55;cursor:not-allowed}.abu-live{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border-radius:999px;border:1px solid rgba(82,232,169,.18);background:rgba(82,232,169,.06);color:#7ff0bd;font-size:9px;font-weight:900;letter-spacing:.06em}.abu-live i{width:7px;height:7px;border-radius:50%;background:#52e8a9;box-shadow:0 0 12px rgba(82,232,169,.55)}.abu-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.abu-card{border:1px solid rgba(139,108,255,.18);border-radius:21px;background:linear-gradient(145deg,rgba(11,18,40,.95),rgba(7,11,27,.97));padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.2);animation:abuIn .3s ease both}.abu-card-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px}.abu-card h3{margin:0;font-size:16px}.abu-card .botline{display:block;color:#77839d;font-size:10px;margin-top:5px}.abu-card code{color:#f4d37a}.abu-status{font-size:8px;font-weight:900;text-transform:uppercase;padding:6px 8px;border-radius:999px}.abu-status.active{color:#7ff0bd;background:rgba(82,232,169,.06);border:1px solid rgba(82,232,169,.16)}.abu-status.suspended,.abu-status.disabled{color:#ffd27b;background:rgba(244,211,122,.06);border:1px solid rgba(244,211,122,.16)}.abu-status.removed{color:#ff9cac;background:rgba(255,100,125,.06);border:1px solid rgba(255,100,125,.16)}.abu-stats{display:grid;grid-template-columns:1fr 1fr;gap:9px}.abu-stat{padding:13px;border-radius:15px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06)}.abu-stat b{display:block;color:#78849d;font-size:9px;font-weight:700;margin-bottom:7px}.abu-stat strong{display:block;font-size:21px;line-height:1;color:#f0f2f8}.abu-stat small{display:block;color:#626f89;font-size:8px;margin-top:5px}.abu-foot{display:flex;justify-content:space-between;gap:10px;margin-top:13px;padding-top:12px;border-top:1px solid rgba(255,255,255,.055);color:#697690;font-size:9px}.abu-empty{padding:42px 18px;text-align:center;border:1px dashed rgba(139,108,255,.2);border-radius:19px;color:#78849d}.abu-error{padding:16px;border:1px solid rgba(255,100,125,.2);background:rgba(255,70,100,.05);border-radius:16px;color:#ffacb9}.abu-skeleton{height:120px;border-radius:19px;background:linear-gradient(90deg,rgba(255,255,255,.025),rgba(139,108,255,.08),rgba(255,255,255,.025));background-size:220% 100%;animation:abuSh 1.2s infinite}.abu-note{margin-top:11px;color:#626f89;font-size:9px}@keyframes abuIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}@keyframes abuSh{to{background-position:-220% 0}}@media(max-width:760px){.abu-head{align-items:stretch;flex-direction:column}.abu-tools{justify-content:space-between}.abu-grid{grid-template-columns:1fr}.abu-stats{grid-template-columns:1fr 1fr}.abu-card{padding:15px}}
 `;document.head.appendChild(s);
}
function num(v){return Number(v||0).toLocaleString()}
function date(v){if(!v)return '—';const d=new Date(v);return Number.isNaN(d.getTime())?String(v):d.toLocaleString()}
function statusClass(v){const x=String(v||'active').toLowerCase();return ['active','suspended','disabled','removed'].includes(x)?x:'active'}
async function load(){
 if(loading)return;
 const root=$('page-usage');if(!root)return;
 styles();loading=true;
 const s=session();
 root.className='page active-page';
 root.innerHTML=`<div class="module-hero"><div><span class="section-label">BOT ANALYTICS</span><h2>API Bot Usage</h2><p>Usage na kowanne website da bot a wuri guda.</p></div><div class="abu-tools"><span class="abu-live"><i></i> LIVE METRICS</span><button id="abu-refresh" class="abu-refresh" type="button">↻ Refresh</button></div></div><section class="form-panel"><div class="panel-heading"><div><span class="section-label">USAGE</span><h3>Website Activity</h3></div></div><div id="abu-list"><div class="abu-grid"><div class="abu-skeleton"></div><div class="abu-skeleton"></div></div></div></section>`;
 const e=$('abu-list');
 if(!s){e.innerHTML='<div class="abu-error">Owner session bai samu ba. Ka sake login.</div>';loading=false;return}
 const r=await window.client?.rpc('owner_list_api_usage',{p_session:s});
 if(r?.error||!r?.data?.ok){e.innerHTML='<div class="abu-error">Ba a iya loda usage ba. Gwada Refresh.</div>';loading=false;const b=$('abu-refresh');if(b)b.onclick=load;return}
 const rows=Array.isArray(r.data.usage)?r.data.usage:[];
 if(!rows.length){e.innerHTML='<div class="abu-empty"><strong>Babu usage da aka rubuta tukuna.</strong><div class="abu-note">Da zarar website ya yi request ko bot ya bada response, statistics za su bayyana a nan.</div></div>'}
 else{
  e.innerHTML='<div class="abu-grid">'+rows.map((x,i)=>{const st=statusClass(x.status);return `<article class="abu-card" style="animation-delay:${Math.min(i*35,300)}ms"><div class="abu-card-top"><div><h3>${esc(x.website_name||'Unknown Website')}</h3><span class="botline">Bot ID: <code>${esc(x.bot_id||'—')}</code></span></div><span class="abu-status ${st}">${esc(x.status||'active')}</span></div><div class="abu-stats"><div class="abu-stat"><b>Requests — Today</b><strong>${num(x.requests_today)}</strong><small>Today</small></div><div class="abu-stat"><b>Requests — All</b><strong>${num(x.requests_total)}</strong><small>All time</small></div><div class="abu-stat"><b>Responses — Today</b><strong>${num(x.responses_today)}</strong><small>Today</small></div><div class="abu-stat"><b>Responses — All</b><strong>${num(x.responses_total)}</strong><small>All time</small></div></div><div class="abu-foot"><span>Last activity: ${esc(date(x.last_activity))}</span><span>${esc(x.website_id||'')}</span></div></article>`}).join('')+'</div>';
 }
 const b=$('abu-refresh');if(b)b.onclick=load;
 loading=false;
}
window.showApiBotUsage=load;
window.addEventListener('beforeunload',()=>{if(timer)clearInterval(timer)});
})();
