const SUPABASE_URL='https://bopezesfrmdxiagvvyyh.supabase.co';
const SUPABASE_KEY='sb_publishable_eLAz-YGqz0ET4n7t1g9BOA_suPeofcR';
const client=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:true}});

const $=id=>document.getElementById(id);
const loginForm=$('login-form'), signupForm=$('signup-form'), pinPanel=$('pin-panel');
const statusBox=$('status'), loginSwitch=$('show-login'), signupSwitch=$('show-signup');

function status(message,type=''){statusBox.textContent=message;statusBox.className='status '+type}
function showLogin(){loginForm.classList.remove('hidden');signupForm.classList.add('hidden');pinPanel.classList.add('hidden');loginSwitch.classList.add('hidden');signupSwitch.classList.remove('hidden');$('title').textContent='Shiga cikin tsarin';$('subtitle').textContent='Wannan yanki na Owner ne kawai.'}
function showSignup(){loginForm.classList.add('hidden');signupForm.classList.remove('hidden');pinPanel.classList.add('hidden');loginSwitch.classList.remove('hidden');signupSwitch.classList.add('hidden');$('title').textContent='Kirkiri Owner Account';$('subtitle').textContent='Ana iya yin wannan sau daya kawai.'}
function showPin(){loginForm.classList.add('hidden');signupForm.classList.add('hidden');pinPanel.classList.remove('hidden');loginSwitch.classList.add('hidden');signupSwitch.classList.add('hidden');$('title').textContent='An tabbatar da Login';$('subtitle').textContent='Mataki na biyu: Owner PIN.'}

async function ownerExists(){
  const {data,error}=await client.rpc('get_owner_status');
  if(error) return true;
  return data===true || data?.get_owner_status===true;
}

loginSwitch.onclick=showLogin; signupSwitch.onclick=showSignup;

loginForm.addEventListener('submit',async e=>{
 e.preventDefault();
 const btn=loginForm.querySelector('button'); btn.disabled=true; status('Ana tabbatar da bayanan...');
 const {data,error}=await client.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});
 if(error||!data.session){status('Login ya gaza. Duba email da password.','error');btn.disabled=false;return}
 status('Login yayi nasara.'); showPin(); btn.disabled=false;
});

signupForm.addEventListener('submit',async e=>{
 e.preventDefault();
 const email=$('signup-email').value.trim(), password=$('signup-password').value, confirm=$('signup-confirm').value;
 if(password!==confirm){status('Passwords ba su yi daidai ba.','error');return}
 const btn=signupForm.querySelector('button');btn.disabled=true;status('Ana kirkirar Owner Account...');
 if(await ownerExists()){status('Owner Account ya riga ya kasance. Sign Up ya rufe.','error');showLogin();return}
 const {data,error}=await client.auth.signUp({email,password});
 if(error){status(error.message,'error');btn.disabled=false;return}
 if(data.session){
   await client.rpc('finalize_owner_bootstrap');
   status('Account an kirkira cikin nasara.','ok');
   showPin();
 }else{
   status('An kirkiri account. Duba email domin tabbatarwa, sannan ka yi Login.','ok');
   showLogin();
 }
 btn.disabled=false;
});

$('pin-btn').onclick=async()=>{
 const pin=$('pin').value.trim();
 if(!/^\d{6}$/.test(pin)){status('PIN dole ya zama lambobi 6.','error');return}
 const btn=$('pin-btn');btn.disabled=true;status('Ana tabbatar da PIN...');
 const {data,error}=await client.rpc('verify_owner_pin_gate',{p_pin:pin});
 if(error){
   const fallback=await client.rpc('verify_owner_pin',{p_pin:pin});
   if(fallback.error||fallback.data!==true){status('PIN bai yi daidai ba ko an kulle shi.','error');btn.disabled=false;return}
 }else if(data!==true && data?.verify_owner_pin_gate!==true){status('PIN bai yi daidai ba ko an kulle shi.','error');btn.disabled=false;return}
 status('An buɗe Owner Console.','ok');
 sessionStorage.setItem('sadeeq_owner_gate','1');
 window.location.href='./dashboard.html';
};

(async()=>{
 const exists=await ownerExists();
 if(exists){showLogin();}else{showSignup();}
})();
