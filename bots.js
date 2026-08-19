const botClient=window.supabase.createClient('https://bopezesfrmdxiagvvyyh.supabase.co','sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const botPage=document.getElementById('page-bots');
const botEscape=value=>String(value??'').replace(/[&<>\'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function botSession(){return typeof window.__sadeeqConsoleSession==='function'?window.__sadeeqConsoleSession():null}
function injectBotStyles(){
 if(document.getElementById('sadeeq-bot-styles'))return;
 const style=document.createElement('style');style.id='sadeeq-bot-styles';style.textContent=`
 .bot-module{animation:botPageIn .5s ease both}.bot-create-card{position:relative;overflow:hidden}.bot-create-card:before{content:"";position:absolute;inset:-1px;background:radial-gradient(circle at 0 0,rgba(141,114,255,.14),transparent 32%),radial-gradient(circle at 100% 100%,rgba(212,107,226,.08),transparent 30%);pointer-events:none}.bot-form-inner{position:relative;z-index:1}.bot-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.bot-field{display:flex!important;flex-direction:column!important;gap:8px!important;min-width:0}.bot-field.full{grid-column:1/-1}.bot-field span{display:flex;align-items:center;gap:8px;color:#aeb8d0;font-size:11px;font-weight:700;letter-spacing:.03em}.bot-field span i{font-style:normal;color:#9b8cff;font-size:13px}.bot-field input,.bot-field textarea{display:block!important;width:100%!important;min-height:48px!important;border:1px solid rgba(139,124,255,.18)!important;background:linear-gradient(145deg,rgba(5,10,25,.92),rgba(9,16,34,.78))!important;color:#f7f8ff!important;border-radius:14px!important;padding:13px 14px!important;outline:none!important;font:inherit!important;font-size:13px!important;line-height:1.5!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 8px 25px rgba(0,0,0,.12)!important;transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease,background .2s ease!important}.bot-field textarea{min-height:150px!important;resize:vertical!important}.bot-field input:hover,.bot-field textarea:hover{border-color:rgba(141,114,255,.35)!important}.bot-field input:focus,.bot-field textarea:focus{border-color:rgba(141,114,255,.75)!important;background:linear-gradient(145deg,rgba(8,13,31,.98),rgba(14,20,45,.9))!important;box-shadow:0 0 0 3px rgba(141,114,255,.10),0 0 28px rgba(141,114,255,.08)!important;transform:translateY(-1px)!important}.bot-field input::placeholder,.bot-field textarea::placeholder{color:#5f6b84!important}.bot-limit-wrap{position:relative}.bot-limit-wrap input{padding-right:70px!important}.bot-limit-suffix{position:absolute;right:12px;bottom:12px;color:#68758f;font-size:9px;letter-spacing:.08em;text-transform:uppercase;pointer-events:none}.bot-submit-row{grid-column:1/-1;display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:3px}.bot-submit{position:relative;overflow:hidden;min-width:170px!important;padding:14px 22px!important;border-radius:13px!important;background:linear-gradient(100deg,#5a39e8,#8737ed 55%,#a848d8)!important;box-shadow:0 12px 30px rgba(103,54,240,.25)!important;transition:transform .2s ease,box-shadow .2s ease,filter .2s ease!important}.bot-submit:before{content:"";position:absolute;top:0;bottom:0;width:60px;left:-80px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:skewX(-18deg);animation:botShimmer 3s ease-in-out infinite}.bot-submit:hover{transform:translateY(-2px)!important;box-shadow:0 16px 38px rgba(103,54,240,.36)!important;filter:brightness(1.08)}.bot-submit:active{transform:translateY(0)!important}.bot-submit:disabled{transform:none!important;filter:none!important}.bot-submit.loading{cursor:wait}.bot-submit.loading:after{content:"";display:inline-block;width:13px;height:13px;margin-left:9px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;vertical-align:-2px;animation:spin .7s linear infinite}.bot-feedback-modern{animation:feedbackIn .25s ease both}.bot-section-enter{animation:botSection .55s ease both}
 @keyframes botPageIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes botSection{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes feedbackIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}@keyframes botShimmer{0%{left:-80px}45%,100%{left:120%}}
 @media(max-width:900px){.bot-form-grid{grid-template-columns:1fr}.bot-field.full{grid-column:auto}.bot-submit-row{grid-column:auto;justify-content:stretch}.bot-submit{width:100%}}@media(prefers-reduced-motion:reduce){.bot-module,.bot-section-enter,.bot-feedback-modern,.bot-submit:before{animation:none!important}}
 `;document.head.appendChild(style);
}
function botUi(){
 if(!botPage)return;
 injectBotStyles();
 botPage.innerHTML=`<div class="module-head bot-module"><div><span class="section-label">BOT MANAGEMENT</span><h2>Create Bot</h2><p>Ƙirƙiri sabon bot daga Owner Console. Dukkan configuration ana adanawa a Supabase.</p></div><button id="bot-refresh" class="secondary-btn" type="button">↻ Refresh</button></div>
  <div id="bot-feedback" class="inline-feedback hidden bot-feedback-modern" role="alert"></div>
  <section class="form-panel bot-create-card bot-section-enter"><div class="bot-form-inner"><div class="panel-heading"><div><span class="section-label">NEW BOT</span><h3>Create a bot</h3></div><span class="secure-pill">OWNER ONLY</span></div>
    <form id="create-bot-form" novalidate><div class="bot-form-grid">
      <label class="bot-field full"><span><i>✦</i> Bot Name</span><input id="bot-name" maxlength="120" required autocomplete="off" placeholder="e.g. ABC Company Assistant"></label>
      <label class="bot-field full"><span><i>⌘</i> Instructions</span><textarea id="bot-instructions" maxlength="20000" rows="6" placeholder="Bayanan da bot zai yi amfani da su wajen bada amsa..."></textarea></label>
      <label class="bot-field full"><span><i>◈</i> Bot Rules</span><textarea id="bot-rules" maxlength="20000" rows="5" placeholder="Dokoki da iyakokin bot..."></textarea></label>
      <label class="bot-field bot-limit-wrap"><span><i>◷</i> Chat Limit</span><input id="bot-chat-limit" type="number" min="1" max="1000000" value="100" required><em class="bot-limit-suffix">requests</em></label>
      <div class="bot-submit-row"><button id="create-bot-submit" class="primary-btn bot-submit" type="submit">Create Bot</button></div>
    </div></form></div></section>`;
  document.getElementById('create-bot-form')?.addEventListener('submit',createBot);
  document.getElementById('bot-refresh')?.addEventListener('click',()=>{window.location.reload()});
}
function feedback(message,type='error'){
 const el=document.getElementById('bot-feedback');if(!el)return;el.textContent=message;el.className=`inline-feedback ${type} bot-feedback-modern`;el.classList.remove('hidden');
}
async function createBot(event){
 event.preventDefault();
 const session=botSession(); if(!session){feedback('Owner session ta ƙare. Ka sake login.');return;}
 const submit=document.getElementById('create-bot-submit'); submit.disabled=true;submit.classList.add('loading');submit.textContent='Creating...';
 const name=document.getElementById('bot-name').value.trim();
 const instructions=document.getElementById('bot-instructions').value;
 const rules=document.getElementById('bot-rules').value;
 const limit=Number(document.getElementById('bot-chat-limit').value);
 if(!name){feedback('Bot Name ya zama dole.');submit.disabled=false;submit.classList.remove('loading');submit.textContent='Create Bot';return;}
 if(!Number.isInteger(limit)||limit<1||limit>1000000){feedback('Chat Limit ba daidai ba ne.');submit.disabled=false;submit.classList.remove('loading');submit.textContent='Create Bot';return;}
 const {data,error}=await botClient.rpc('create_owner_bot',{p_session:session,p_name:name,p_instructions:instructions,p_rules:rules,p_chat_limit:limit});
 if(error||!data){feedback(error?.message==='INVALID_OWNER_SESSION'?'Owner session ta ƙare. Ka sake login.':'An kasa ƙirƙirar bot. Gwada kuma.');submit.disabled=false;submit.classList.remove('loading');submit.textContent='Create Bot';return;}
 feedback(`✓ Bot created successfully — ${data.bot_id}`,'success');event.target.reset();document.getElementById('bot-chat-limit').value=100;submit.disabled=false;submit.classList.remove('loading');submit.textContent='Create Bot';
}
function showBotsPage(){
 document.querySelectorAll('.page').forEach(p=>{p.classList.add('hidden');p.classList.remove('active-page')});botPage.classList.remove('hidden');botPage.classList.add('active-page');document.querySelectorAll('.nav-item[data-page]').forEach(i=>i.classList.toggle('active',i.dataset.page==='bots'));const title=document.getElementById('page-title');if(title)title.textContent='Bots';if(typeof window.closeSidebar==='function')window.closeSidebar();if(!botPage.dataset.ready){botPage.dataset.ready='1';botUi();}else botUi();
}
document.addEventListener('click',e=>{const item=e.target.closest('[data-page="bots"]');if(item){e.preventDefault();e.stopImmediatePropagation();showBotsPage();}},true);
window.showSadeeqBots=showBotsPage;
