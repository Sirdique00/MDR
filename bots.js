const botClient=window.supabase.createClient('https://bopezesfrmdxiagvvyyh.supabase.co','sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const botPage=document.getElementById('page-bots');
const botEscape=value=>String(value??'').replace(/[&<>\'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function botSession(){return typeof window.__sadeeqConsoleSession==='function'?window.__sadeeqConsoleSession():null}
function botUi(){
  if(!botPage)return;
  botPage.innerHTML=`<div class="module-head"><div><span class="section-label">BOT MANAGEMENT</span><h2>Create Bot</h2><p>Ƙirƙiri sabon bot daga Owner Console. Dukkan configuration ana adanawa a Supabase.</p></div><button id="bot-refresh" class="secondary-btn" type="button">↻ Refresh</button></div>
  <div id="bot-feedback" class="inline-feedback hidden" role="alert"></div>
  <div class="bot-create-grid">
    <section class="form-panel">
      <div class="panel-heading"><div><span class="section-label">NEW BOT</span><h3>Create a bot</h3></div></div>
      <form id="create-bot-form" novalidate>
        <label>Bot Name<input id="bot-name" maxlength="120" required autocomplete="off" placeholder="e.g. ABC Company Assistant"></label>
        <label>Instructions<textarea id="bot-instructions" maxlength="20000" rows="6" placeholder="Bayanan da bot zai yi amfani da su wajen bada amsa..."></textarea></label>
        <label>Bot Rules<textarea id="bot-rules" maxlength="20000" rows="5" placeholder="Dokoki da iyakokin bot..."></textarea></label>
        <label>Chat Limit<input id="bot-chat-limit" type="number" min="1" max="1000000" value="100" required></label>
        <button id="create-bot-submit" class="primary-btn" type="submit">Create Bot</button>
      </form>
    </section>
    <aside class="info-panel"><span class="section-label">AUTOMATIC</span><h3>Bot ID</h3><p>Da zarar an ƙirƙiri bot, backend zai samar da unique 9-character Bot ID ta atomatik. Ba frontend ba ne ke ƙirƙirar ID.</p><div class="bot-id-example">SDQ67hd8i</div><small>Misali ne kawai; ainihin ID zai bambanta kuma ba zai maimaitu ba.</small></aside>
  </div>
  <section class="bots-list-panel"><div class="panel-heading"><div><span class="section-label">ALL BOTS</span><h3>Your bots</h3></div><span id="bot-count" class="count-pill">0</span></div><div id="bot-list" class="bot-list"><div class="empty-state">Ana loda bots...</div></div></section>`;
  document.getElementById('create-bot-form')?.addEventListener('submit',createBot);
  document.getElementById('bot-refresh')?.addEventListener('click',loadBots);
  loadBots();
}
function feedback(message,type='error'){
 const el=document.getElementById('bot-feedback');if(!el)return;el.textContent=message;el.className=`inline-feedback ${type}`;el.classList.remove('hidden');
}
async function createBot(event){
 event.preventDefault();
 const session=botSession(); if(!session){feedback('Owner session ta ƙare. Ka sake login.');return;}
 const submit=document.getElementById('create-bot-submit'); submit.disabled=true; submit.textContent='Creating...';
 const name=document.getElementById('bot-name').value.trim();
 const instructions=document.getElementById('bot-instructions').value;
 const rules=document.getElementById('bot-rules').value;
 const limit=Number(document.getElementById('bot-chat-limit').value);
 if(!name){feedback('Bot Name ya zama dole.');submit.disabled=false;submit.textContent='Create Bot';return;}
 if(!Number.isInteger(limit)||limit<1||limit>1000000){feedback('Chat Limit ba daidai ba ne.');submit.disabled=false;submit.textContent='Create Bot';return;}
 const {data,error}=await botClient.rpc('create_owner_bot',{p_session:session,p_name:name,p_instructions:instructions,p_rules:rules,p_chat_limit:limit});
 if(error||!data){feedback(error?.message==='INVALID_OWNER_SESSION'?'Owner session ta ƙare. Ka sake login.':'An kasa ƙirƙirar bot. Gwada kuma.');submit.disabled=false;submit.textContent='Create Bot';return;}
 feedback(`✓ Bot created successfully — ${data.bot_id}`,'success');
 event.target.reset();document.getElementById('bot-chat-limit').value=100;
 await loadBots();
 submit.disabled=false;submit.textContent='Create Bot';
}
async function loadBots(){
 const root=document.getElementById('bot-list'),count=document.getElementById('bot-count');if(!root)return;const session=botSession();if(!session){root.innerHTML='<div class="empty-state">Owner session ta ƙare. Ka sake login.</div>';return;}
 root.innerHTML='<div class="empty-state">Ana loda bots...</div>';
 const {data,error}=await botClient.rpc('list_owner_bots',{p_session:session});
 if(error){root.innerHTML='<div class="empty-state">Ba a iya loda bots ba. Gwada Refresh.</div>';return;}
 const bots=Array.isArray(data)?data:[];if(count)count.textContent=bots.length;
 if(!bots.length){root.innerHTML='<div class="empty-state">Babu bot tukuna. Yi amfani da Create Bot a sama.</div>';return;}
 root.innerHTML=bots.map(bot=>`<article class="bot-card"><div class="bot-card-main"><div class="bot-avatar">✦</div><div><h4>${botEscape(bot.name)}</h4><p>Bot ID: <code>${botEscape(bot.bot_id)}</code></p><small>Created ${botEscape(new Date(bot.created_at).toLocaleString())}</small></div></div><div class="bot-card-meta"><span class="status-pill ${bot.status==='active'?'active':''}">${botEscape(bot.status)}</span><span>Limit: ${Number(bot.chat_limit).toLocaleString()}</span></div></article>`).join('');
}
function showBotsPage(){
 document.querySelectorAll('.page').forEach(p=>{p.classList.add('hidden');p.classList.remove('active-page')});
 botPage.classList.remove('hidden');botPage.classList.add('active-page');
 document.querySelectorAll('.nav-item[data-page]').forEach(i=>i.classList.toggle('active',i.dataset.page==='bots'));
 const title=document.getElementById('page-title');if(title)title.textContent='Bots';
 if(typeof window.closeSidebar==='function')window.closeSidebar();
 if(!botPage.dataset.ready){botPage.dataset.ready='1';botUi();}else loadBots();
}
document.addEventListener('click',e=>{const item=e.target.closest('[data-page="bots"]');if(item){e.preventDefault();e.stopImmediatePropagation();showBotsPage();}},true);
window.showSadeeqBots=showBotsPage;
