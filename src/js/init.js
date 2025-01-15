// src/js/init.js

export function initializePage() {
    console.log('페이지 초기화 중...');
    
    // DOM 요소 초기화 작업 (예: Root 영역에 기본 내용 추가)
    const rootElement = document.getElementById('review-dashboard-root');
    if (rootElement) {
        rootElement.innerHTML = '<p>초기화 완료!</p>';
    }

    // 역할 선택 이벤트
    document.getElementById('roleSelect')?.addEventListener('change', function() {
        setupMenuByRole(this.value); // 역할에 따른 메뉴 설정
    });

    // 가게 선택 이벤트
    document.getElementById('storeSelect')?.addEventListener('change', function() {
        loadReviews(this.value); // 선택된 가게 리뷰 로드
    });

    // 캘린더 날짜 선택 이벤트
    document.querySelectorAll('#calendarBody td[data-date]')?.forEach(td => {
        td.addEventListener('click', handleDateSelection); // 날짜 선택 이벤트 핸들러
    });
}
