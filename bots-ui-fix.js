/* Sadeeq • Bot Management UI polish + resilient Create Bot handler */
(function(){
  'use strict';
  const SUPABASE_URL='https://bopezesfrmdxiagvvyyh.supabase.co';
  const SUPABASE_KEY='sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR';
  let client=null;

  function addStyles(){
    if(document.getElementById('sadeeq-bot-ui-fix')) return;
    const s=document.createElement('style');
    s.id='sadeeq-bot-ui-fix';
    s.textContent=`
      /* Two-tone Sadeeq palette: deep navy + violet, with Chagi gold accents */
      #page-bots .bot-module{max-width:900px;margin:0 auto 26px;text-align:center;animation:sbFade .55s ease both}
      #page-bots .bot-module>div{width:100%}
      #page-bots .bot-module .secondary-btn{margin:16px auto 0;display:inline-flex}
      #page-bots .bot-create-grid{width:min(100%,820px)!important;margin:0 auto!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:22px!important}
      #page-bots .form-panel.bot-create-card,#page-bots .info-panel.bot-info-card,#page-bots .bots-list-panel{width:100%;box-sizing:border-box;text-align:center;border:1px solid rgba(143,119,255,.20)!important;background:linear-gradient(145deg,rgba(9,16,38,.96),rgba(5,9,24,.94))!important;box-shadow:0 18px 55px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.025)!important}
      #page-bots .form-panel.bot-create-card{padding:30px 24px!important;border-radius:24px!important}
      #page-bots .panel-heading{justify-content:center!important;flex-wrap:wrap;gap:12px}
      #page-bots .panel-heading>div{text-align:center}
      #page-bots .bot-form-grid{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:18px!important;max-width:680px;margin:26px auto 0}
      #page-bots .bot-field,#page-bots .bot-field.full{grid-column:auto!important;width:100%;text-align:left}
      #page-bots .bot-field span{font-size:12px!important;color:#b9c2dc!important;margin-bottom:8px;display:flex;justify-content:flex-start}
      #page-bots .bot-field span i{color:#c5a44b!important}
      #page-bots .bot-field input,#page-bots .bot-field textarea{box-sizing:border-box!important;width:100%!important;border-radius:16px!important;border:1px solid rgba(132,112,255,.24)!important;background:linear-gradient(135deg,#050a1c,#0b1230)!important;color:#f7f8ff!important;min-height:54px!important;padding:15px 16px!important;box-shadow:0 8px 26px rgba(0,0,0,.16)!important;transition:.22s ease!important}
      #page-bots .bot-field textarea{min-height:150px!important}
      #page-bots .bot-field input:focus,#page-bots .bot-field textarea:focus{border-color:rgba(155,130,255,.82)!important;box-shadow:0 0 0 3px rgba(127,95,255,.11),0 0 32px rgba(127,95,255,.10)!important;transform:translateY(-1px)}
      #page-bots .bot-limit-wrap{position:relative}
      #page-bots .bot-limit-wrap input{padding-right:85px!important}
      #page-bots .bot-limit-suffix{position:absolute;right:15px;bottom:18px;color:#6f7b99;font-size:9px;text-transform:uppercase;letter-spacing:.08em;pointer-events:none}
      #page-bots .bot-submit-row{display:flex!important;justify-content:center!important;align-items:center!important;grid-column:auto!important;margin-top:4px!important}
      #page-bots .bot-submit{min-width:230px!important;justify-content:center!important;border:0!important;border-radius:15px!important;background:linear-gradient(100deg,#6845f5 0%,#8b4df2 52%,#c2a044 145%)!important;box-shadow:0 14px 38px rgba(103,69,245,.28)!important}
      #page-bots .bot-submit:hover{box-shadow:0 18px 48px rgba(103,69,245,.38)!important;transform:translateY(-2px)!important}
      #page-bots .bot-info-card{padding:28px 24px!important;border-radius:22px!important}
      #page-bots .bot-info-card p{max-width:600px;margin:10px auto;line-height:1.7}
      #page-bots .bot-id-visual{max-width:300px;margin:20px auto 12px!important;color:#f4d37a!important;border-color:rgba(194,160,68,.30)!important;background:linear-gradient(135deg,rgba(194,160,68,.09),rgba(104,69,245,.08))!important}
      #page-bots .bot-auto-points{max-width:430px;margin:18px auto 0!important;text-align:left!important}
      #page-bots .bot-auto-point{justify-content:flex-start}
      #page-bots .bots-list-panel{margin:22px auto 0!important;padding:24px!important;border-radius:22px!important;max-width:820px!important}
      #page-bots .bot-card{border-radius:17px!important}
      #page-bots .inline-feedback{max-width:820px;margin:0 auto 18px;text-align:center;border-radius:15px!important}
      #page-bots .inline-feedback.error{border-color:rgba(245,96,123,.36)!important;background:rgba(73,16,31,.38)!important;color:#ff9daf!important}
      #page-bots .inline-feedback.success{border-color:rgba(67,224,163,.32)!important;background:rgba(10,55,43,.30)!important;color:#8ce8c4!important}
      @keyframes sbFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
      @media(max-width:600px){
        #page-bots .form-panel.bot-create-card{padding:24px 16px!important;border-radius:20px!important}
        #page-bots .bot-create-grid{width:min(100%,620px)!important}
        #page-bots .bot-form-grid{max-width:100%}
        #page-bots .bot-submit{width:100%!important;min-width:0!important}
        #page-bots .bots-list-panel{padding:18px!important}
      }
      @media(prefers-reduced-motion:reduce){#page-bots .bot-module{animation:none}}
    `;
    document.head.appendChild(s);
  }

  function getClient(){
    if(client) return client;
    if(window.supabase?.createClient) client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    return client;
  }

  function setFeedback(message,type){
    const el=document.getElementById('bot-feedback');
    if(!el)return;
    el.textContent=message;
    el.className='inline-feedback bot-feedback-modern '+type;
    el.classList.remove('hidden');
  }

  function buttonState(button,loading){
    if(!button)return;
    button.disabled=loading;
    button.classList.toggle('loading',loading);
    button.innerHTML=loading?'Creating secure bot…':'<span aria-hidden="true">⚡</span><span>Create Bot</span>';
  }

  async function handleCreate(event){
    const form=event.target;
    if(!form || form.id!=='create-bot-form') return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const session=typeof window.__sadeeqConsoleSession==='function'?window.__sadeeqConsoleSession():null;
    if(!session){setFeedback('Owner session ta ƙare. Ka sake login.','error');return;}

    const name=document.getElementById('bot-name')?.value.trim()||'';
    const instructions=document.getElementById('bot-instructions')?.value||'';
    const rules=document.getElementById('bot-rules')?.value||'';
    const limit=Number(document.getElementById('bot-chat-limit')?.value);
    const button=document.getElementById('create-bot-submit');

    if(!name){setFeedback('Bot Name ya zama dole.','error');return;}
    if(!Number.isInteger(limit)||limit<1||limit>1000000){setFeedback('Chat Limit ba daidai ba ne.','error');return;}

    const sb=getClient();
    if(!sb){setFeedback('Ba a haɗa Supabase ba. Sake buɗe shafin.','error');return;}

    buttonState(button,true);
    setFeedback('Ana ƙirƙirar bot cikin tsaro…','loading');

    try{
      const {data,error}=await sb.rpc('create_owner_bot',{p_session:session,p_name:name,p_instructions:instructions,p_rules:rules,p_chat_limit:limit});
      if(error) throw error;
      const botId=data?.bot_id;
      if(!botId) throw new Error('BOT_CREATE_NO_ID');
      setFeedback(`✓ An ƙirƙiri bot cikin nasara • ${botId}`,'success');
      form.reset();
      const limitField=document.getElementById('bot-chat-limit');if(limitField)limitField.value=100;
      document.getElementById('bot-refresh')?.click();
    }catch(error){
      const msg=String(error?.message||'');
      if(msg.includes('INVALID_OWNER_SESSION')) setFeedback('Owner session ta ƙare. Ka sake login.','error');
      else if(msg.includes('BOT_NAME_REQUIRED')) setFeedback('Ka saka sunan bot.','error');
      else if(msg.includes('INVALID_CHAT_LIMIT')) setFeedback('Chat Limit ba daidai ba ne.','error');
      else if(msg.includes('BOT_TEXT_TOO_LONG')) setFeedback('Instructions ko Rules sun yi tsawo sosai.','error');
      else setFeedback('An kasa ƙirƙirar bot. Gwada kuma.','error');
    }finally{buttonState(button,false);}
  }

  function boot(){
    addStyles();
    document.addEventListener('submit',handleCreate,true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
