import"./chunks/modulepreload-polyfill-B5Qt9EMX.js";import{l as d,c as i}from"./auth.js";import"./chunks/supabaseClient-CAAA46mf.js";import"./chunks/index-BQfYHZiF.js";function r(e,o){const t=document.getElementById(e);t.textContent=o,t.style.display="block"}function s(e){document.getElementById(e).style.display="none"}function l(e){const o=document.querySelector(".login-button"),t=document.getElementById("loginText"),n=document.getElementById("loginSpinner");o.disabled=e,t.style.display=e?"none":"block",n.style.display=e?"block":"none"}document.getElementById("loginForm").addEventListener("submit",async function(e){e.preventDefault(),s("userIdError"),s("passwordError");const o=document.getElementById("userId").value,t=document.getElementById("password").value;if(!o){r("userIdError","아이디를 입력해주세요.");return}if(!t){r("passwordError","비밀번호를 입력해주세요.");return}l(!0);try{const n=await d(o,t);n.success?(sessionStorage.setItem("userInfo",JSON.stringify(n.user)),window.location.href="layout.html"):r("passwordError","아이디 또는 비밀번호가 올바르지 않습니다.")}catch(n){console.error("로그인 오류:",n),r("passwordError","로그인 중 오류가 발생했습니다.")}finally{l(!1)}});document.addEventListener("DOMContentLoaded",function(){i()&&(window.location.href="layout.html")});
