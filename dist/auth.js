import{s as n}from"./chunks/supabaseClient-S2iIDnZv.js";import"./chunks/index-BQfYHZiF.js";async function l(r,s){try{const{data:e,error:a}=await n.from("login_data").select("*").eq("user_id",r).eq("password_hash",s).single();if(a)throw a;if(!e)throw new Error("사용자를 찾을 수 없습니다.");return{success:!0,user:{id:e.id,role:e.role,storeName:e.store_name,storeCode:e.store_code,name:e.full_name}}}catch(e){return console.error("Login error:",e),{success:!1,error:e.message}}}function c(){const r=sessionStorage.getItem("userInfo");return r?JSON.parse(r):null}function i(r){console.log(`현재 역할: ${r}`);const s=document.getElementById("navMenu");if(!s)return;let e="";switch(r){case"admin":e=`
                <a href="/dashboard.html" class="nav-link">대시보드</a>
                <a href="/users.html" class="nav-link">사용자 관리</a>
            `;break;case"franchise":e=`
                <a href="/stores.html" class="nav-link">가게 관리</a>
                <a href="/orders.html" class="nav-link">주문 관리</a>
            `;break;case"owner":e=`
                <a href="/reviews.html" class="nav-link">리뷰</a>
            `;break;default:e=`
                <a href="/home.html" class="nav-link">홈</a>
            `}s.innerHTML=e}export{c,l,i as u};
