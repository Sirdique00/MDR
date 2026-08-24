/* Sadeeq AI Hub • Bot Settings bootstrap + final embed contract */
(function(){
'use strict';
const URL='https://bopezesfrmdxiagvvyyh.supabase.co';
const KEY='sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR';
const sb=window.supabase.createClient(URL,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const esc=v=>String(v??'').replace(/[&<>\'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const session=()=>typeof window.__sadeeqConsoleSession==='function'?window.__sadeeqConsoleSession():null;
window.SADEEQ_EMBED_CONTRACT={version:'final-2',secretInIframe:false,requiresOneTimeWebsiteRegistration:true};

/* Fallback is deliberately defined here so All Bots can always open settings.
   bot-settings-secure-fix.js may replace this with the premium renderer when loaded. */
window.openSadeeqBotSettings=async function(botId){
  const s=session();
  const p=document.getElementById('page-bots');
  if(!p||!botId)return;
  if(!s){alert('Owner session ta ƙare. Ka sake login.');return;}
  const {data,error}=await sb.rpc('get_owner_bot',{p_session:s,p_bot_id:botId});
  if(error||!data){alert(error?.message||'Ba a samu bot ba.');return;}
  document.querySelectorAll('.page').forEach(x=>{x.classList.toggle('hidden',x!==p);x.classList.toggle('active-page',x===p);if(x!==p)x.replaceChildren()});
  document.getElementById('page-title').textContent='Bot Settings';
  p.className='page active-page';
  const bot=data,bg=bot.background_config||'gradient:navy-violet';
  const iframe=`<iframe src="https://sirdique00.github.io/MDR/bot.html?bot_id=${encodeURIComponent(bot.bot_id)}" data-bot-id="${esc(bot.bot_id)}" title="${esc(bot.name)}" loading="lazy" style="width:100%;height:600px;border:0;border-radius:18px"></iframe>`;
  p.innerHTML=`<div style="max-width:980px;margin:0 auto;padding-bottom:50px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;gap:12px"><div><div style="font-size:10px;font-weight:900;letter-spacing:.2em;color:#9d8cff">BOT MANAGEMENT</div><h2 style="margin:7px 0">Bot Settings</h2><p style="color:#7f8aa5;margin:0">${esc(bot.name)} • ${esc(bot.bot_id)}</p></div><button id="bs-back" class="secondary-btn">← All Bots</button></div><section style="border:1px solid rgba(144,124,255,.18);border-radius:26px;background:linear-gradient(145deg,rgba(8,14,35,.98),rgba(4,8,23,.98));padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.35)"><div style="display:grid;gap:17px"><label>Bot Name<input id="bs-name" value="${esc(bot.name)}" maxlength="120"></label><label>Welcome Message<input id="bs-welcome" value="${esc(bot.welcome_message)}" maxlength="5000"></label><label>Instructions<textarea id="bs-instructions" maxlength="20000">${esc(bot.instructions)}</textarea></label><label>Bot Rules<textarea id="bs-rules" maxlength="20000">${esc(bot.rules)}</textarea></label><label>Chat Limit<input id="bs-limit" type="number" min="1" max="1000000" value="${Number(bot.chat_limit||100)}"></label><label>Background<select id="bs-background"><option value="gradient:navy-violet">Navy → Violet</option><option value="gradient:violet-gold">Violet → Chagi Gold</option><option value="gradient:midnight-blue">Midnight Blue</option><option value="gradient:obsidian">Obsidian</option></select></label><button id="bs-save" class="primary-btn">Save Changes</button><div id="bs-msg" style="text-align:center"></div><div><h3>Iframe Code</h3><textarea id="bs-iframe" readonly style="width:100%;min-height:110px">${esc(iframe)}</textarea><button id="bs-copy" class="secondary-btn">Copy Iframe</button><p style="font-size:10px;color:#6f7b99">Iframe yana ɗauke da Bot ID kawai. Secret ID ba ya cikin code; ana amfani da shi sau ɗaya wajen website registration.</p></div></div></section></div>`;
  document.getElementById('bs-background').value=bg;
  document.getElementById('bs-back').onclick=()=>window.showSadeeqAllBots?.();
  document.getElementById('bs-copy').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('bs-iframe').value);document.getElementById('bs-msg').textContent='✓ Iframe code copied';}catch{document.getElementById('bs-iframe').select()}};
  document.getElementById('bs-save').onclick=async()=>{const button=document.getElementById('bs-save');button.disabled=true;button.textContent='Saving...';const r=await sb.rpc('update_owner_bot',{p_session:s,p_bot_id:bot.bot_id,p_name:document.getElementById('bs-name').value.trim(),p_instructions:document.getElementById('bs-instructions').value,p_rules:document.getElementById('bs-rules').value,p_welcome_message:document.getElementById('bs-welcome').value.trim(),p_chat_limit:Number(document.getElementById('bs-limit').value),p_background_config:document.getElementById('bs-background').value});button.disabled=false;button.textContent='Save Changes';document.getElementById('bs-msg').textContent=r.error?('✕ '+r.error.message):'✓ Saved successfully';};
};
})();