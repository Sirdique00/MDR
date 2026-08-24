/* Owner Audit Logs — real Supabase session scoped module */
(function(){'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function session(){return window.__sadeeqConsoleSession?.()||''}
function fmt(v){const d=new Date(v);return Number.isNaN(d.getTime())?String(v||'—'):d.toLocaleString()}
async function load(){
 const root=$('page-logs');if(!root)return;
 root.className='page active-page';
 root.innerHTML='<div class="module-hero"><div><span class="section-label">SECURITY & ACTIVITY</span><h2>Audit Logs</h2><p>Real events da suka faru a Owner Console, daga Supabase audit trail.</p></div><div class="module-badge">LIVE LOGS</div></div><section class="form-panel"><div class="panel-heading"><div><span class="section-label">AUDIT TRAIL</span><h3>Recent events</h3></div><button id="audit-refresh" class="secondary-btn" type="button">↻ Refresh</button></div><div id="audit-list" class="empty-state">Ana loda audit logs...</div></section>';
 const r=await window.client?.rpc('owner_list_audit_logs',{p_session:session(),p_limit:100});
 const e=$('audit-list');if(!e)return;
 if(r?.error||!r?.data?.ok){e.textContent='Ba a iya loda audit logs ba. Gwada Refresh.';return}
 const rows=Array.isArray(r.data.logs)?r.data.logs:[];
 e.innerHTML=rows.length?'<div class="audit-list">'+rows.map(x=>`<article class="activity-item"><div class="activity-icon">◷</div><div class="activity-main"><strong>${esc(x.action||'SYSTEM_EVENT')}</strong><span>${esc(x.target_type||'system')}${x.target_id?' • '+esc(x.target_id):''}</span></div><time>${esc(fmt(x.created_at))}</time></article>`).join('')+'</div>':'Babu audit events tukuna.';
 $('audit-refresh').onclick=load;
}
window.showAuditLogs=load;
})();