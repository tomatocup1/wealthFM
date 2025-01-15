import{c as D}from"./index-BQfYHZiF.js";const L=void 0,w=void 0,S=D(L,w);function E(){const e=new Date,r=e.getMonth(),t=e.getFullYear(),n=new Date(t,r,1),a=new Date(t,r+1,0),l=document.getElementById("calendarBody");let o=1,c="";for(let s=0;s<6;s++){c+="<tr>";for(let d=0;d<7;d++)if(s===0&&d<n.getDay())c+="<td></td>";else if(o>a.getDate())c+="<td></td>";else{const i=o===e.getDate();c+=`<td class="${i?"today":""}" data-date="${o}">${o}</td>`,o++}if(c+="</tr>",o>a.getDate())break}l.innerHTML=c,f()}async function u(e){try{const r=new Date(e);r.setHours(0,0,0,0);const t=new Date(e);t.setHours(23,59,59,999);const{data:n,error:a}=await S.from("error_logs").select("*").gte("occurred_at",r.toISOString()).lte("occurred_at",t.toISOString()).order("occurred_at",{ascending:!1});if(a)throw a;return console.log("Fetched logs:",n),n}catch(r){throw console.error("Error fetching logs:",r),r}}function y(e){const r=document.getElementById("logTableBody");if(!e||e.length===0){r.innerHTML='<tr><td colspan="6" class="text-center">해당 날짜의 오류 로그가 없습니다.</td></tr>';return}r.innerHTML=e.map(t=>`
        <tr>
            <td>${new Date(t.occurred_at).toLocaleString("ko-KR")}</td>
            <td>
                <span class="badge ${t.category==="오류"?"badge-error":"badge-warning"}">
                    ${t.category||"-"}
                </span>
            </td>
            <td>${t.platform||"-"}</td>
            <td>${t.store_name||"-"}</td>
            <td>${t.error_type||"-"}</td>
            <td>${t.error_message||"-"}</td>
        </tr>
    `).join("")}function f(){document.querySelectorAll("#calendarBody td[data-date]").forEach(e=>{e.addEventListener("click",async function(){const r=this.dataset.date,t=new Date,n=new Date(t.getFullYear(),t.getMonth(),parseInt(r));document.querySelectorAll("#calendarBody td.selected").forEach(a=>{a.classList.remove("selected")}),this.classList.add("selected");try{const a=await u(n);y(a)}catch(a){console.error("Error:",a),alert("데이터 로드 중 오류가 발생했습니다.")}})})}function b(){const e=document.querySelector(".search-input"),r=document.querySelector('.filter-select[data-filter="platform"]'),t=document.querySelector('.filter-select[data-filter="category"]');function n(){const a=document.querySelectorAll("#logTableBody tr"),l=e.value.toLowerCase(),o=r.value,c=t.value;a.forEach(s=>{const d=s.textContent.toLowerCase(),i=s.children[2].textContent,g=s.children[1].textContent.trim(),m=d.includes(l),h=o==="all"||i===o,p=c==="all"||g===c;s.style.display=m&&h&&p?"":"none"})}e.addEventListener("input",n),r.addEventListener("change",n),t.addEventListener("change",n)}document.addEventListener("DOMContentLoaded",async()=>{try{E(),f(),b();const r=await u(new Date);y(r)}catch(e){console.error("초기화 실패:",e),alert("페이지 로드 중 오류가 발생했습니다.")}});
