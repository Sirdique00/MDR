const SUPABASE_URL='https://bopezesfrmdxiagvvyyh.supabase.co';
const SUPABASE_KEY='sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR';
const client=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});

const $=id=>document.getElementById(id);
const loading=$('console-loading'),denied=$('console-denied'),consoleRoot=$('owner-console');

function deny(){loading.classList.add('hidden');consoleRoot.classList.add('hidden');denied.classList.remove('hidden');}

async function unlock(){
  const hash=window.location.hash.replace(/^#/,'');
  const params=new URLSearchParams(hash);
  const ticket=params.get('ticket');

  // Clear the one-time credential from the address bar immediately.
  if(window.history.replaceState) window.history.replaceState({},document.title,window.location.pathname+window.location.search);

  if(!ticket){deny();return;}

  const {data,error}=await client.rpc('redeem_owner_console_ticket',{p_ticket:ticket});
  if(error || data!==true){deny();return;}

  loading.classList.add('hidden');
  consoleRoot.classList.remove('hidden');
  initConsole();
}

const pageNames={
  home:'Home',bots:'Bots',instructions:'Instructions',webs:'Webs Joined',usage:'API Bot Usage',logs:'Audit Logs',sadeeq:'Sadeeq AI',keys:'API Keys',settings:'Settings'
};

function initConsole(){
  const items=[...document.querySelectorAll('.nav-item[data-page]')];
  const page=$('page-home');
  const placeholder=$('page-placeholder');
  const title=$('page-title');
  const placeholderTitle=$('placeholder-title');
  const placeholderText=$('placeholder-text');

  function select(name){
    items.forEach(item=>item.classList.toggle('active',item.dataset.page===name));
    title.textContent=pageNames[name]||name;
    if(name==='home'){
      page.classList.add('active-page');
      placeholder.classList.remove('active-page');
      placeholder.classList.add('hidden');
    }else{
      page.classList.remove('active-page');
      placeholder.classList.remove('hidden');
      placeholder.classList.add('active-page');
      placeholderTitle.textContent=pageNames[name]||'Module';
      placeholderText.textContent=`${pageNames[name]||'Wannan module'} an shirya shi a Level 4 navigation. Za a gina cikakken aiki daga Supabase a level dinsa, ba tare da hard-code na system state ba.`;
    }
    closeSidebar();
  }

  items.forEach(item=>item.addEventListener('click',()=>select(item.dataset.page)));

  const sidebar=$('sidebar'),backdrop=$('sidebar-backdrop');
  function openSidebar(){sidebar.classList.add('open');backdrop.classList.add('show')}
  function closeSidebar(){sidebar.classList.remove('open');backdrop.classList.remove('show')}
  window.openSidebar=openSidebar;
  window.closeSidebar=closeSidebar;
  $('open-sidebar')?.addEventListener('click',openSidebar);
  $('close-sidebar')?.addEventListener('click',closeSidebar);
  backdrop?.addEventListener('click',closeSidebar);

  select('home');
}

unlock();
