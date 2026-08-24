/* Sadeeq AI Hub • FINAL single-source Bot Settings renderer */
(function(){
'use strict';
const URL='https://bopezesfrmdxiagvvyyh.supabase.co';
const KEY='sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR';
const sb=window.supabase.createClient(URL,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const session=()=>typeof window.__sadeeqConsoleSession==='function'?window.__sadeeqConsoleSession():null;
const esc=v=>String(v??'').replace(/[&<>\'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const bgCss=v=>({
'gradient:violet-gold':'linear-gradient(135deg,#24134d,#76551a,#0b1025)',
'gradient:midnight-blue':'linear-gradient(135deg,#020617,#0b1d45,#050816)',
'gradient:obsidian':'linear-gradient(135deg,#030303,#16131e,#050816)',
'gradient:navy-violet':'linear-gradient(135deg,#050816,#30206d,#0b1025)'
}[v]||'linear-gradient(135deg,#050816,#30206d,#0b1025)');
function render(bot){
 const p=document.getElementById('page-bots'); if(!p)return;
 document.querySelectorAll('.page').forEach(x=>{x.classList.toggle('hidden',x!==p);x.classList.toggle('active-page',x===p);if(x!==p)x.replaceChildren()});
 document.getElementById('page-title').textContent='Bot Settings';
 const bg=bot.background_config||'gradient:navy-violet';
 const iframe=`<iframe src="https://sirdique00.github.io/MDR/bot.html?bot_id=${encodeURIComponent(bot.bot_id)}" data-bot-id="${esc(bot.bot_id)}" title="${esc(bot.name)}" loading="lazy" style="width:100%;height:600px;border:0;border-radius:18px"></iframe>`;
 p.innerHTML=`<div class="final-bs"><div class="final-bs-head"><div><div class="final-bs-kicker">BOT MANAGEMENT</div><h2>Bot Settings</h2><p>${esc(bot.name)} • ${esc(bot.bot_id)}</p></div><button id="fbs-back" type="button">← All Bots</button></div><section class="final-bs-card"><div class="final-bs-top"><div><div class="final-bs-avatar">✦</div><h3>${esc(bot.name)}</h3><small>BOT ID • ${esc(bot.bot_id)}</small></div><button id="fbs-menu" type="button">⋮</button></div><div id="fbs-actions" class="final-bs-actions hidden"><button id="fbs-pin">${bot.pinned?'Unpin':'Pin'} Bot</button><button id="fbs-delete" class="danger">Delete Bot</button></div><div class="final-bs-grid"><label>Bot Name<input id="fbs-name" maxlength="120" value="${esc(bot.name)}"></label><label>Welcome Message<input id="fbs-welcome" maxlength="5000" value="${esc(bot.welcome_message||'')}"></label><label class="full">Instructions<textarea id="fbs-instructions" maxlength="20000">${esc(bot.instructions||'')}</textarea></label><label class="full">Bot Rules<textarea id="fbs-rules" maxlength="20000">${esc(bot.rules||'')}</textarea></label><label>Chat Limit<input id="fbs-limit" type="number" min="1" max="1000000" value="${Number(bot.chat_limit||100)}"></label><label>Background<select id="fbs-bg"><option value="gradient:navy-violet">Navy → Violet</option><option value="gradient:violet-gold">Violet → Chagi Gold</option><option value="gradient:midnight-blue">Midnight Blue</option><option value="gradient:obsidian">Obsidian</option></select></label></div><button id="fbs-save" class="save">Save Changes</button><div id="fbs-msg"></div><div class="final-bs-section"><div class="final-bs-section-head"><h4>Playground</h4><span>Test this exact bot</span></div><button id="fbs-playground" class="playground">✦ Open Bot Playground</button></div><div class="final-bs-section"><div class="final-bs-section-head"><h4>Secure Iframe Code</h4><span>Bot ID only</span></div><textarea id="fbs-iframe" readonly>${esc(iframe)}</textarea><button id="fbs-copy" type="button">Copy Iframe</button><p>Iframe yana ɗauke da Bot ID kawai. Secret ID ana amfani da shi sau ɗaya wajen website registration.</p></div><div class="final-bs-section"><div class="final-bs-section-head"><h4>Secret ID</h4><span>Private</span></div><input id="fbs-secret" type="password" readonly value="${esc(bot.secret_id||'')}"><button id="fbs-show" type="button">Show</button></div></section></div>`;
 document.getElementById('fbs-bg').value=bg;
 document.getElementById('fbs-back').onclick=()=>window.showSadeeqAllBots?.();
 document.getElementById('fbs-menu').onclick=()=>document.getElementById('fbs-actions').classList.toggle('hidden');
 document.getElementById('fbs-show').onclick=e=>{const x=document.getElementById('fbs-secret');x.type=x.type==='password'?'text':'password';e.target.textContent=x.type==='password'?'Show':'Hide'};
 document.getElementById('fbs-copy').onclick=async()=>{try{await navigator.clipboard.writeText(iframe);document.getElementById('fbs-msg').textContent='✓ Iframe code copied';}catch{document.getElementById('fbs-iframe').select()}};
 document.getElementById('fbs-bg').onchange=e=>document.getElementById('fbs-bg').style.borderColor='rgba(143,119,255,.55)';
 document.getElementById('fbs-save').onclick=async()=>{const s=session();if(!s){document.getElementById('fbs-msg').textContent='Owner session ta ƙare.';return}const btn=document.getElementById('fbs-save');btn.disabled=true;btn.textContent='Saving...';const r=await sb.rpc('update_owner_bot',{p_session:s,p_bot_id:bot.bot_id,p_name:document.getElementById('fbs-name').value.trim(),p_instructions:document.getElementById('fbs-instructions').value,p_rules:document.getElementById('fbs-rules').value,p_chat_limit:Number(document.getElementById('fbs-limit').value),p_welcome_message:document.getElementById('fbs-welcome').value.trim(),p_background_config:document.getElementById('fbs-bg').value});btn.disabled=false;btn.textContent='Save Changes';document.getElementById('fbs-msg').textContent=r.error?'✕ '+r.error.message:'✓ Saved successfully';};
 document.getElementById('fbs-playground').onclick=()=>window.openBotPlayground?.(bot.bot_id);
 document.getElementById('fbs-pin').onclick=async()=>{const r=await sb.rpc('set_owner_bot_pinned',{p_session:session(),p_bot_id:bot.bot_id,p_pinned:!bot.pinned});if(!r.error)open(bot.bot_id)};
 document.getElementById('fbs-delete').onclick=async()=>{if(!confirm('Ka tabbata kana son delete wannan bot?'))return;const r=await sb.rpc('delete_owner_bot',{p_session:session(),p_bot_id:bot.bot_id});if(!r.error)window.showSadeeqAllBots?.()};
}
async function open(botId){const s=session();if(!s){alert('Owner session ta ƙare. Ka sake login.');return}const r=await sb.rpc('get_owner_bot',{p_session:s,p_bot_id:String(botId||'').trim()});if(r.error||!r.data){alert(r.error?.message||'Ba a samu bot ba.');return}render(r.data)}
window.openSadeeqBotSettings=open;
window.__sadeeqFinalBotSettings=true;
})();
