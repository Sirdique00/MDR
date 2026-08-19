const SUPABASE_URL='https://bopezesfrmdxiagvvyyh.supabase.co';
const SUPABASE_KEY='sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR';
const client=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const $=id=>document.getElementById(id);
const loading=$('console-loading'),denied=$('console-denied'),consoleRoot=$('owner-console');
const pageNames={home:'Home',bots:'Bots',instructions:'Instructions',webs:'Webs Joined',usage:'API Bot Usage',logs:'Audit Logs',sadeeq:'Sadeeq AI',keys:'API Keys',settings:'Settings'};
let consoleSession=null;

function deny(message='Wannan Owner Console ne kawai. Ticket din shiga bai inganta ba ko ya kare.'){
  loading.classList.add('hidden');consoleRoot.classList.add('hidden');denied.classList.remove('hidden');
  const box=$('denied-message');if(box)box.textContent=message;
}

async function unlock(){
  const hash=window.location.hash.replace(/^#/,'');
  const params=new URLSearchParams(hash);
  const ticket=params.get('ticket');
  if(window.history.replaceState) window.history.replaceState({},document.title,window.location.pathname+window.location.search);
  if(!ticket){deny();return;}
  const {data,error}=await client.rpc('redeem_owner_console_ticket',{p_ticket:ticket});
  if(error||typeof data!=='string'||data.length!==64){deny();return;}
  consoleSession=data;
  loading.classList.add('hidden');consoleRoot.classList.remove('hidden');
  initConsole();
  await loadDashboard();
}

function setText(id,value){const el=$(id);if(el)el.textContent=value}
function number(value){return Number(value||0).toLocaleString()}
function showDashboardError(message){const el=$('dashboard-error');if(!el)return;el.textContent=message;el.classList.remove('hidden')}
function clearDashboardError(){$('dashboard-error')?.classList.add('hidden')}

async function loadDashboard(){
  clearDashboardError();
  const {data,error}=await client.rpc('get_owner_dashboard_snapshot',{p_session:consoleSession});
  if(error||!data){showDashboardError('Ba a iya loda bayanan Home ba. Gwada Refresh.');return}
  setText('system-status',data.system_status||'UNKNOWN');
  setText('system-status-note',data.system_status==='ONLINE'?'Owner console active':'System status unavailable');
  setText('security-status',data.security_status||'UNKNOWN');
  setText('security-status-note',data.security_status==='PROTECTED'?'Console security active':'Security status unavailable');
  setText('storage-status',data.storage_status||'UNKNOWN');
  setText('bots-count',number(data.bots_count));
  setText('websites-count',number(data.websites_count));
  setText('requests-today',number(data.requests_today));
  setText('audit-count',`${number(data.audit_events_today)} today`);
  setText('health-message','System snapshot ɗin ya samu nasara.');
  renderLogs(Array.isArray(data.recent_logs)?data.recent_logs:[]);
}

function renderLogs(logs){
  const root=$('recent-logs');if(!root)return;
  if(!logs.length){root.innerHTML='<div class="empty-state">Babu audit activity tukuna.</div>';return}
  root.innerHTML=logs.map(log=>{
    const date=new Date(log.created_at);
    const when=Number.isNaN(date.getTime())?String(log.created_at||''):date.toLocaleString();
    const target=log.target_type?`${log.target_type}${log.target_id?` • ${log.target_id}`:''}`:'system';
    return `<article class="activity-item"><div class="activity-icon">◷</div><div class="activity-main"><strong>${escapeHtml(log.action||'SYSTEM_EVENT')}</strong><span>${escapeHtml(target)}</span></div><time>${escapeHtml(when)}</time></article>`;
  }).join('');
}
function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function initConsole(){
  const items=[...document.querySelectorAll('.nav-item[data-page]')];
  const quick=[...document.querySelectorAll('.quick-action[data-page]')];
  const page=$('page-home'),placeholder=$('page-placeholder'),title=$('page-title');
  const placeholderTitle=$('placeholder-title'),placeholderText=$('placeholder-text');
  function select(name){
    items.forEach(item=>item.classList.toggle('active',item.dataset.page===name));
    title.textContent=pageNames[name]||name;
    if(name==='home'){
      page.classList.remove('hidden');page.classList.add('active-page');placeholder.classList.remove('active-page');placeholder.classList.add('hidden');
    }else{
      page.classList.remove('active-page');page.classList.add('hidden');placeholder.classList.remove('hidden');placeholder.classList.add('active-page');
      placeholderTitle.textContent=pageNames[name]||'Module';
      placeholderText.textContent=`${pageNames[name]||'Wannan module'} an shirya shi a navigation. Za a gina cikakken aiki a Level dinsa, tare da real Supabase actions da security checks.`;
    }
    closeSidebar();
  }
  items.forEach(item=>item.addEventListener('click',()=>select(item.dataset.page)));
  quick.forEach(item=>item.addEventListener('click',()=>select(item.dataset.page)));
  const sidebar=$('sidebar'),backdrop=$('sidebar-backdrop');
  function openSidebar(){sidebar.classList.add('open');backdrop.classList.add('show')}
  function closeSidebar(){sidebar.classList.remove('open');backdrop.classList.remove('show')}
  window.closeSidebar=closeSidebar;
  $('open-sidebar')?.addEventListener('click',openSidebar);
  $('close-sidebar')?.addEventListener('click',closeSidebar);
  backdrop?.addEventListener('click',closeSidebar);
  $('refresh-dashboard')?.addEventListener('click',async()=>{const b=$('refresh-dashboard');b.disabled=true;b.textContent='↻ Loading...';await loadDashboard();b.disabled=false;b.textContent='↻ Refresh'});
  select('home');
}

window.addEventListener('pagehide',()=>{
  if(!consoleSession)return;
  const body=JSON.stringify({p_session:consoleSession});
  navigator.sendBeacon(`${SUPABASE_URL}/rest/v1/rpc/revoke_owner_console_session`,new Blob([body],{type:'application/json'}));
});

unlock();
