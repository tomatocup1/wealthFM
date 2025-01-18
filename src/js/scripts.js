// scripts.js
import { supabase } from './supabaseClient.js';

class PageManager {
    constructor() {
        this.userInfo = null;
        this.currentStore = 'all';
        this.currentPlatform = 'all';
        this.currentDate = new Date();
    }

    // 페이지 초기화
    async initializePage() {
       const currentPage = window.location.pathname.split('/').pop();
       if (currentPage === 'index.html') {
           return; // index.html은 아무것도 안 한다
       }
        try {
            // 1. 세션 체크
            this.userInfo = this.checkSession();
            if (!this.userInfo) return;

            // 2. 역할 설정
            this.setupRole();

            // 3. 메뉴 설정
            this.setupNavigation();

            // 4. 이벤트 리스너 설정
            this.setupEventListeners();

            // 5. React 컴포넌트 초기화
            //this.initializeReactComponents();

        } catch (error) {
            console.error('페이지 초기화 실패:', error);
        }
    }

    // 세션 체크
    checkSession() {
        const userInfo = sessionStorage.getItem('userInfo');
        if (!userInfo) {
            window.location.href = 'login.html';
            return null;
        }
        return JSON.parse(userInfo);
    }

    // 역할 설정
    setupRole() {
        const roleSelect = document.getElementById('roleSelect');
        if (roleSelect) {
            roleSelect.value = this.userInfo.role;
            roleSelect.disabled = true;
        }
    }

    // 네비게이션 메뉴 설정
    setupNavigation() {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu) return;

        let menuHtml = '<a href="layout.html" class="nav-link active">리뷰 모아보기</a>';
        
        // 역할별 메뉴 추가
        switch (this.userInfo.role) {
            case 'webmaster':
                menuHtml += `
                    <a href="customer_data.html" class="nav-link">고객 데이터 관리</a>
                    <a href="error_logs.html" class="nav-link">에러 로그</a>
                    <a href="admin_management.html" class="nav-link">관리자 관리</a>
                `;
                break;
            case 'admin':
                menuHtml += `
                    <a href="customer_data.html" class="nav-link">고객 데이터 관리</a>
                `;
                break;
        }

        navMenu.innerHTML = menuHtml;
        this.highlightCurrentPage();
    }

    // 현재 페이지 메뉴 하이라이트
    highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html') {
            return; // 로그인 체크 건너뛰기
        }
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 플랫폼 필터 이벤트
        document.querySelectorAll('.platform-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handlePlatformChange(e.target.dataset.platform);
            });
        });

        // 스토어 선택 이벤트
        const storeSelect = document.getElementById('storeSelect');
        if (storeSelect) {
            storeSelect.addEventListener('change', (e) => {
                this.handleStoreChange(e.target.value);
            });
        }

        // 달력 날짜 선택 이벤트
        document.querySelectorAll('#calendarBody td[data-date]').forEach(td => {
            td.addEventListener('click', (e) => {
                this.handleDateSelection(e.target);
            });
        });
    }

    // 플랫폼 변경 처리
    handlePlatformChange(platform) {
        document.querySelectorAll('.platform-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.platform === platform);
        });
        this.currentPlatform = platform;
        this.updateReviewDisplay();
    }

    // 스토어 변경 처리
    handleStoreChange(storeCode) {
        this.currentStore = storeCode;
        this.updateReviewDisplay();
    }

    // 날짜 선택 처리
    handleDateSelection(dateElement) {
        // 이전 선택 제거
        document.querySelectorAll('.calendar td.selected').forEach(td => {
            td.classList.remove('selected');
        });
        
        // 새로운 선택 추가
        dateElement.classList.add('selected');
        
        // 날짜 업데이트 및 리뷰 갱신
        const selectedDate = new Date(this.currentDate.getFullYear(), 
                                    this.currentDate.getMonth(), 
                                    parseInt(dateElement.dataset.date));
        this.currentDate = selectedDate;
        this.updateReviewDisplay();
    }

    // React 컴포넌트 초기화
    //initializeReactComponents() {
    //    const container = document.getElementById('review-dashboard-root');
    //    if (container && window.ReviewDashboard) {
    //        const root = ReactDOM.createRoot(container);
    //        root.render(React.createElement(window.ReviewDashboard, {
    //            initialStore: this.currentStore,
    //            initialPlatform: this.currentPlatform,
    //            initialDate: this.currentDate,
    //            userRole: this.userInfo.role
    //        }));
    //    }
    //}

    // 리뷰 표시 업데이트
    async updateReviewDisplay() {
        if (window.reviewDashboard) {
            window.reviewDashboard.updateFilters({
                store: this.currentStore,
                platform: this.currentPlatform,
                date: this.currentDate
            });
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {

    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html') {
        // index.html은 로그인 체크하지 않고 그냥 통과
        // (pageManager.initializePage() 호출도 안 할 수 있음)
        return;
    }

    const pageManager = new PageManager();
    pageManager.initializePage();
    
    // 전역 접근을 위해 window 객체에 할당
    window.pageManager = pageManager;
});