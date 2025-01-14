// Supabase 초기화
const initSupabase = () => {
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        return supabase.createClient(supabaseUrl, supabaseKey);
    } catch (error) {
        console.error('Supabase 초기화 실패:', error);
        return null;
    }
};

// 권한별 메뉴 업데이트
const updateMenuByRole = (role) => {
    const navMenu = document.getElementById('navMenu');
    
    // 기본 메뉴 (리뷰 모아보기)
    navMenu.innerHTML = '<a href="layout.html" class="nav-link">리뷰 모아보기</a>';
    
    // 권한별 메뉴 추가
    switch(role) {
        case 'webmaster':
        case 'admin':
            navMenu.innerHTML += `
                <a href="customer Data.html" class="nav-link">고객 데이터 관리</a>
                <a href="error_logs.html" class="nav-link">에러 로그</a>
            `;
            break;
        case 'franchise':
            // 프랜차이즈 특정 메뉴 추가
            break;
        case 'owner':
            // 점주 특정 메뉴 추가
            break;
    }

    // 현재 페이지에 해당하는 메뉴 활성화
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
};

// 세션 체크
const checkSession = () => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(userInfo);
};

// 역할 선택 이벤트 리스너
const setupRoleSelect = () => {
    const roleSelect = document.getElementById('roleSelect');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            updateMenuByRole(this.value);
        });
    }
};

// 페이지 초기화
const initPage = () => {
    const userInfo = checkSession();
    if (!userInfo) return;

    const supabase = initSupabase();
    if (!supabase) return;

    setupRoleSelect();
    
    // 초기 메뉴 설정
    const roleSelect = document.getElementById('roleSelect');
    if (roleSelect) {
        updateMenuByRole(roleSelect.value);
    }
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', initPage);