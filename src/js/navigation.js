// navigation.js
import { checkSession } from './auth.js';

class NavigationManager {
    constructor() {
        this.navMenu = document.getElementById('navMenu');
        this.roleSelect = document.getElementById('roleSelect');
        this.currentPage = window.location.pathname.split('/').pop();
        this.userInfo = null;
    }

    // 네비게이션 초기화
    async initialize() {
        try {
            // 세션 체크
            this.userInfo = checkSession();
            // 페이지 이름이 index.html이면 세션 없다고 해도 그냥 통과
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'index.html') {
                // return 하거나, userInfo 안 쓰도록
                return;
            }
            
            if (!this.userInfo) {
                window.location.href = 'login.html';
                return;
            }

            // 역할 설정
            this.setupRole();

            // 메뉴 설정
            this.setupMenu();

            // 이벤트 리스너 설정
            this.setupEventListeners();

            return true;
        } catch (error) {
            console.error('네비게이션 초기화 실패:', error);
            return false;
        }
    }

    // 역할 설정
    setupRole() {
        if (this.roleSelect) {
            this.roleSelect.value = this.userInfo.role;
            this.roleSelect.disabled = true;
        }
    }

    // 메뉴 설정
    setupMenu() {
        if (!this.navMenu) return;

        // 기본 메뉴 항목
        const menuItems = {
            base: {
                link: 'layout.html',
                text: '리뷰 모아보기'
            },
            customerData: {
                link: 'customer_data.html',
                text: '고객 데이터 관리'
            },
            errorLogs: {
                link: 'error_logs.html',
                text: '에러 로그'
            }
        };

        // 역할별 메뉴 구성
        let menuHtml = `<a href="${menuItems.base.link}" class="nav-link">${menuItems.base.text}</a>`;

        switch (this.userInfo.role) {
            case 'webmaster':
                menuHtml += `
                    <a href="${menuItems.customerData.link}" class="nav-link">${menuItems.customerData.text}</a>
                    <a href="${menuItems.errorLogs.link}" class="nav-link">${menuItems.errorLogs.text}</a>
                `;
                break;

            case 'admin':
                menuHtml += `
                    <a href="${menuItems.customerData.link}" class="nav-link">${menuItems.customerData.text}</a>
                `;
                break;

            case 'franchise':
            case 'owner':
                // 기본 메뉴만 표시
                break;
        }

        this.navMenu.innerHTML = menuHtml;
        
        // 현재 페이지 하이라이트
        this.highlightCurrentPage();
    }

    // 현재 페이지 하이라이트
    highlightCurrentPage() {
        this.navMenu.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 페이지 접근 권한 체크
    checkPageAccess() {
        const pagePermissions = {
            'layout.html': ['webmaster', 'admin', 'franchise', 'owner'],
            'customer_data.html': ['webmaster', 'admin'],
            'error_logs.html': ['webmaster']
        };

        const allowedRoles = pagePermissions[this.currentPage];
        
        if (allowedRoles && !allowedRoles.includes(this.userInfo.role)) {
            window.location.href = 'layout.html';
            return false;
        }

        return true;
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 네비게이션 링크 클릭 이벤트
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                this.navigateToPage(href);
            }
        });
    }

    // 페이지 이동
    navigateToPage(href) {
        // 현재 페이지 상태 저장 (필요한 경우)
        this.savePageState();

        // 페이지 이동
        window.location.href = href;
    }

    // 현재 페이지 상태 저장
    savePageState() {
        // 필요한 상태 저장 로직 구현
        const pageState = {
            lastVisited: new Date().toISOString()
        };
        sessionStorage.setItem('pageState', JSON.stringify(pageState));
    }

    // 현재 사용자 역할 반환
    getCurrentRole() {
        return this.userInfo?.role;
    }

    // 현재 사용자 정보 반환
    getCurrentUser() {
        return this.userInfo;
    }
}

// 싱글톤 인스턴스 생성 및 내보내기
const navigationManager = new NavigationManager();
export default navigationManager;