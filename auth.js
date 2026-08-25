const SUPABASE_URL='https://bopezesfrmdxiagvvyyh.supabase.co';
const SUPABASE_KEY='sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR';
const client=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:true}});

const $=id=>document.getElementById(id);
const loginForm=$('login-form'),signupForm=$('signup-form');
const pinSetupPanel=$('pin-setup-panel'),pinPanel=$('pin-panel');
const statusBox=$('status'),loginSwitch=$('show-login'),signupSwitch=$('show-signup');

function status(message,type=''){statusBox.textContent=message;statusBox.className='status '+type}
function showLogin(){loginForm.classList.remove('hidden');signupForm.classList.add('hidden');pinSetupPanel.classList.add('hidden');pinPanel.classList.add('hidden');loginSwitch.classList.add('hidden');signupSwitch.classList.remove('hidden');$('title').textContent='Shiga cikin tsarin';$('subtitle').textContent='Wannan yanki na Owner ne kawai.'}
function showSignup(){loginForm.classList.add('hidden');signupForm.classList.remove('hidden');pinSetupPanel.classList.add('hidden');pinPanel.classList.add('hidden');loginSwitch.classList.remove('hidden');signupSwitch.classList.add('hidden');$('title').textContent='Kirkiri Owner Account';$('subtitle').textContent='Ana iya yin wannan sau daya kawai.'}
function showPinSetup(){loginForm.classList.add('hidden');signupForm.classList.add('hidden');pinSetupPanel.classList.remove('hidden');pinPanel.classList.add('hidden');loginSwitch.classList.add('hidden');signupSwitch.classList.add('hidden');$('title').textContent='Saita Owner PIN';$('subtitle').textContent='Kada ka rufe shafin har sai an ajiye PIN.'}
function showPin(){loginForm.classList.add('hidden');signupForm.classList.add('hidden');pinSetupPanel.classList.add('hidden');pinPanel.classList.remove('hidden');loginSwitch.classList.add('hidden');signupSwitch.classList.add('hidden');$('title').textContent='An tabbatar da Login';$('subtitle').textContent='Mataki na biyu: Owner PIN.'}

async function ownerExists(){
  const {data,error}=await client.rpc('get_owner_status');
  if(error){console.error(error);return true;}
  return data===true || data?.get_owner_status===true;
}

async function pinConfigured(){
  const {data,error}=await client.rpc('get_owner_pin_status');
  if(error){console.error(error);return false;}
  return data===true || data?.get_owner_pin_status===true;
}

async function reserveBootstrap(email){
  const {data,error}=await client.rpc('reserve_owner_bootstrap',{p_email:email});
  return !error && (data===true || data?.reserve_owner_bootstrap===true);
}

async function createConsoleTicket(){
  const {data,error}=await client.rpc('create_owner_console_ticket');
  if(error || typeof data!=='string' || data.length!==64) return null;
  return data;
}

loginSwitch.onclick=showLogin;
signupSwitch.onclick=showSignup;

loginForm.addEventListener('submit',async e=>{
 e.preventDefault();
 const btn=loginForm.querySelector('button');btn.disabled=true;status('Ana tabbatar da bayanan...');
 const email=$('email').value.trim();
 const {data,error}=await client.auth.signInWithPassword({email,password:$('password').value});
 if(error||!data.session){status('Login ya gaza. Duba email da password.','error');btn.disabled=false;return}

 const exists=await ownerExists();
 if(!exists){
   const reserved=await reserveBootstrap(email);
   if(!reserved){status('Ba a iya fara Owner setup ba. Gwada kuma.','error');btn.disabled=false;return}
   status('Login yayi nasara. Yanzu ka saita PIN dinka.','ok');
   showPinSetup();
   btn.disabled=false;return;
 }

 if(!(await pinConfigured())){
   status('Account dinka ba shi da PIN tukuna. Saita PIN yanzu.','ok');
   showPinSetup();
   btn.disabled=false;return;
 }

 status('Login yayi nasara.','ok');
 showPin();
 btn.disabled=false;
});

signupForm.addEventListener('submit',async e=>{
 e.preventDefault();
 const email=$('signup-email').value.trim();
 const password=$('signup-password').value;
 const confirm=$('signup-confirm').value;
 if(password!==confirm){status('Passwords ba su yi daidai ba.','error');return}

 const btn=signupForm.querySelector('button');btn.disabled=true;status('Ana fara Owner Account setup...');
 if(await ownerExists()){status('Owner Account ya riga ya kasance. Sign Up ya rufe.','error');showLogin();btn.disabled=false;return}

 const reserved=await reserveBootstrap(email);
 if(!reserved){status('Owner Account setup yana cikin amfani ko ya riga ya kammala.','error');btn.disabled=false;return}

 const {data,error}=await client.auth.signUp({email,password});
 if(error){status(error.message,'error');btn.disabled=false;return}

 if(data.session){
   status('Account an kirkira. Yanzu ka saita PIN dinka.','ok');
   showPinSetup();
 }else{
   status('Account an kirkira. Tabbatar da email dinka, sannan ka yi Login domin saita PIN.','ok');
   showLogin();
 }
 btn.disabled=false;
});

$('save-pin-btn').onclick=async()=>{
 const pin=$('setup-pin').value.trim();
 const confirm=$('setup-pin-confirm').value.trim();
 if(!/^\d{6,12}$/.test(pin)){status('PIN dole ya zama lambobi 6 zuwa 12.','error');return}
 if(pin!==confirm){status('PIN din farko da na biyu ba su yi daidai ba.','error');return}

 const btn=$('save-pin-btn');btn.disabled=true;status('Ana ajiye Owner PIN...');
 const {data:sessionData}=await client.auth.getSession();
 const session=sessionData?.session;
 if(!session){status('Login session ya kare. Yi Login sannan ka saita PIN.','error');showLogin();btn.disabled=false;return}

 const exists=await ownerExists();
 let result;
 if(exists){
   result=await client.rpc('set_owner_pin',{p_pin:pin});
 }else{
   const email=session.user.email;
   const reserved=await reserveBootstrap(email);
   if(!reserved){status('Owner setup reservation ya kare. Gwada Login/Sign Up kuma.','error');btn.disabled=false;return}
   result=await client.rpc('finalize_owner_bootstrap',{p_user_id:session.user.id,p_email:email,p_pin:pin});
 }

 if(result.error){status(result.error.message||'Ba a iya ajiye PIN ba.','error');btn.disabled=false;return}
 status('PIN an saita cikin nasara.','ok');
 $('setup-pin').value='';$('setup-pin-confirm').value='';
 showPin();
 btn.disabled=false;
};

$('pin-btn').onclick=async()=>{
 const pin=$('pin').value.trim();
 if(!/^\d{6,12}$/.test(pin)){status('PIN dole ya zama lambobi 6 zuwa 12.','error');return}
 const btn=$('pin-btn');btn.disabled=true;status('Ana tabbatar da PIN...');
 const {data,error}=await client.rpc('verify_owner_pin_gate_v2',{p_pin:pin});
 if(error||!(data===true || data?.verify_owner_pin_gate_v2===true)){
   status(error?.message||'PIN bai yi daidai ba ko an kulle shi.','error');
   btn.disabled=false;return;
 }

 status('Ana buɗe Owner Console...','ok');
 const ticket=await createConsoleTicket();
 if(!ticket){
   status('An tabbatar da PIN amma ba a iya bude secure console ticket ba. Gwada kuma.','error');
   btn.disabled=false;return;
 }
 window.location.href='./dashboard.html#ticket='+encodeURIComponent(ticket);
};

(async()=>{
 const exists=await ownerExists();
 if(exists)showLogin();else showSignup();
})();
