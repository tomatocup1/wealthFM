// init.js
export const initializeEventListeners = () => {
    // 역할 선택 이벤트
    document.getElementById('roleSelect')?.addEventListener('change', function() {
        setupMenuByRole(this.value);
    });

    // 가게 선택 이벤트
    document.getElementById('storeSelect')?.addEventListener('change', function() {
        loadReviews(this.value);
    });

    // 캘린더 날짜 선택 이벤트
    document.querySelectorAll('#calendarBody td[data-date]')?.forEach(td => {
        td.addEventListener('click', handleDateSelection);
    });
};