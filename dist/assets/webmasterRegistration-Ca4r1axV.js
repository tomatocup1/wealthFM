import"./modulepreload-polyfill-B5Qt9EMX.js";let s;async function d(){try{const e=await fetch("http://localhost:3000/config");if(!e.ok)throw new Error("Failed to fetch config");const t=await e.json();s=supabase.createClient(t.SUPABASE_URL,t.SUPABASE_KEY),console.log("Supabase initialized successfully")}catch(e){console.error("Failed to initialize Supabase:",e)}}function c(e,t){const r=document.getElementById(e);r.textContent=t,r.style.display="block"}function m(e){document.getElementById(e).style.display="none"}function i(e,t,r,n){return t.test(e)?(m(r),!0):(c(r,n),!1)}async function f(e){try{if(!s)throw new Error("Supabase is not initialized");const{data:t}=await s.from("login_data").select("email").eq("email",e.email).single();if(t)throw new Error("이미 등록된 이메일입니다.");const{data:r}=await s.from("login_data").select("user_id").eq("user_id",e.user_id).single();if(r)throw new Error("이미 사용 중인 아이디입니다.");const n={full_name:e.full_name,user_id:e.user_id,password_hash:e.password,email:e.email,phone:e.phone||null,role:"webmaster",created_at:new Date().toISOString()},{error:a}=await s.from("login_data").insert([n]);if(a)throw a;return{success:!0,message:"웹마스터 계정이 성공적으로 등록되었습니다."}}catch(t){throw console.error("웹마스터 등록 오류:",t),t}}document.addEventListener("DOMContentLoaded",async function(){await d();const e=document.getElementById("webmasterForm");e.addEventListener("submit",async function(t){t.preventDefault(),document.querySelectorAll(".error-message").forEach(o=>o.style.display="none");const r=document.getElementById("user_id").value,n=document.getElementById("password").value,a=document.getElementById("password_confirm").value,l=document.getElementById("email").value;if(i(r,/^[a-zA-Z0-9_]{5,20}$/,"userIdError","아이디는 5~20자의 영문, 숫자, 언더스코어만 사용 가능합니다.")&&i(n,/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,"passwordError","비밀번호는 8자 이상의 영문과 숫자 조합이어야 합니다.")){if(n!==a){c("passwordConfirmError","비밀번호가 일치하지 않습니다.");return}if(i(l,/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"emailError","유효한 이메일 주소를 입력해주세요."))try{const o={full_name:document.getElementById("full_name").value,user_id:r,password:n,email:l,phone:document.getElementById("phone").value},u=await f(o);alert(u.message),e.reset()}catch(o){alert("계정 등록 실패: "+o.message)}}})});
