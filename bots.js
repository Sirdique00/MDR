const botClient=window.supabase.createClient('https://xubufcfhcdtrsrvuulxh.supabase.co','sb_publishable_rbrh83jGHubDm-IlVP24DA_bH5kwpE1',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const botPage=document.getElementById('page-bots');
const botEscape=value=>String(value??'').replace(/[&<>\'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function botSession(){return typeof window.__sadeeqConsoleSession==='function'?window.__sadeeqConsoleSession():null}
