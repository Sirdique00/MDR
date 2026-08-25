/* Owner Audit Logs — owner scoped live audit trail */
(function(){'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function session(){return window.__sadeeqConsoleSession?.()||''}
function fmt(v){const d=new Date(v);return Number.isNaN(d.getTime())?String(v||'—'):d.toLocaleString()}
function resultOf(x){if(x?.metadata?.success===true||x?.action?.endsWith('_SUCCESS'))return 'success';if(x?.metadata?.success===false||x?.action?.endsWith('_FAILURE')||x?.action?.includes('FAILED'))return 'failed';return 'event'}
function label(x){const r=resultOf(x);return r==='success'?'SUCCESS':r==='failed'?'FAILED':'EVENT'}
function render(rows){
 const list=$('audit-list');if(!list)return;
 const q=($('audit-search')?.value||'').trim().toLowerCase();
 const filter=$('audit-filter')?.value||'all';
 const filtered=rows.filter(x=>{
   const hay=[x.action,x.target_type,x.target_id,JSON.stringify(x.metadata||{})].join(' ').toLowerCase();
   return (!q||hay.includes(q))&&(filter==='all'||resultOf(x)===filter);
 });
 if(!filtered.length){list.innerHTML='<div class="empty-state">Babu event da ya dace da wannan filter.</div>';return}
 list.innerHTML='<div class="audit-list">'+filtered.map(x=>{const r=resultOf(x);return `<article class="activity-item"><div class="activity-icon">${r==='success'?'✓':r==='failed'?'✕':'◷'}</div><div class="activity-main"><strong>${esc(x.action||'SYSTEM_EVENT')}</strong><span>${esc(x.target_type||'system')}${x.target_id?' • '+esc(x.target_id):''} <b class="audit-result ${r}">${label(x)}</b></span></div><time>${esc(fmt(x.created_at))}</time></article>`}).join('')+'</div>';
}
async function load(){
 const root=$('page-logs');if(!root)return;
 root.className='page active-page';
 root.innerHTML='<div class="module-hero"><div><span class="section-label">SECURITY & ACTIVITY</span><h2>Audit Logs</h2><p>Dukkan events da aka rubuta daga Owner Console da login.</p></div><div class="module-badge">LIVE LOGS</div></div><section class="form-panel"><div class="panel-heading"><div><span class="section-label">AUDIT TRAIL</span><h3>Recent events</h3></div><button id="audit-refresh" class="secondary-btn" type="button">↻ Refresh</button></div><div class="audit-tools"><input id="audit-search" class="text-input" type="search" placeholder="Search action, target, ID..." autocomplete="off"><select id="audit-filter" class="text-input"><option value="all">All events</option><option value="success">Success</option><option value="failed">Failed</option><option value="event">Other events</option></select></div><div id="audit-list" class="empty-state">Ana loda audit logs...</div></section>';
 const r=await window.client?.rpc('owner_list_audit_logs',{p_session:session(),p_limit:250});
 const e=$('audit-list');if(!e)return;
 if(r?.error||!r?.data?.ok){e.textContent='Ba a iya loda audit logs ba. Gwada Refresh.';return}
 const rows=Array.isArray(r.data.logs)?r.data.logs:[];
 const style=document.createElement('style');style.textContent='.audit-tools{display:flex;gap:10px;margin:0 0 14px}.audit-tools .text-input{flex:1;min-width:0}.audit-result{margin-left:7px;font-size:8px;letter-spacing:.4px}.audit-result.success{color:#7fe4b8}.audit-result.failed{color:#ff9cae}.audit-result.event{color:#f4d37a}@media(max-width:650px){.audit-tools{flex-direction:column}}';document.head.appendChild(style);
 $('audit-search').oninput=()=>render(rows);$('audit-filter').onchange=()=>render(rows);$('audit-refresh').onclick=load;render(rows);
}
window.showAuditLogs=load;
})();