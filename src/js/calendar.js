// calendar.js
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.calendarBody = document.getElementById('calendarBody');
        this.monthNames = ["1월", "2월", "3월", "4월", "5월", "6월",
                          "7월", "8월", "9월", "10월", "11월", "12월"];
        this.callbacks = {
            onDateSelect: null
        };
    }

    // 달력 초기화
    initialize(onDateSelect = null) {
        this.callbacks.onDateSelect = onDateSelect;
        this.generateCalendar();
        this.setupEventListeners();
        return this;
    }

    // 달력 생성
    generateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // 달력 제목 업데이트
        const calendarTitle = document.querySelector('.calendar-title');
        if (calendarTitle) {
            calendarTitle.textContent = `${year}년 ${this.monthNames[month]}`;
        }

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        let html = '';
        let date = 1;
        
        // 달력 생성
        for (let i = 0; i < 6; i++) {
            let row = '<tr>';
            
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay.getDay()) {
                    // 이전 달의 날짜
                    row += '<td class="other-month"></td>';
                } else if (date > lastDay.getDate()) {
                    // 다음 달의 날짜
                    row += '<td class="other-month"></td>';
                } else {
                    // 현재 달의 날짜
                    const currentDate = new Date(year, month, date);
                    const isToday = this.isToday(currentDate);
                    const isSelected = this.isSelectedDate(currentDate);
                    const isWeekend = j === 0 || j === 6;
                    
                    row += `
                        <td class="calendar-day ${isToday ? 'today' : ''} 
                                               ${isSelected ? 'selected' : ''} 
                                               ${isWeekend ? 'weekend' : ''}"
                            data-date="${currentDate.toISOString()}"
                        >
                            ${date}
                        </td>`;
                    date++;
                }
            }
            
            row += '</tr>';
            html += row;
            
            if (date > lastDay.getDate()) break;
        }
        
        if (this.calendarBody) {
            this.calendarBody.innerHTML = html;
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 날짜 선택 이벤트
        if (this.calendarBody) {
            this.calendarBody.addEventListener('click', (e) => {
                const cell = e.target.closest('td');
                if (cell && cell.dataset.date) {
                    this.handleDateSelect(new Date(cell.dataset.date));
                }
            });
        }

        // 이전/다음 달 버튼 이벤트
        const prevButton = document.querySelector('.calendar-prev');
        const nextButton = document.querySelector('.calendar-next');

        if (prevButton) {
            prevButton.addEventListener('click', () => this.previousMonth());
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextMonth());
        }
    }

    // 날짜 선택 처리
    handleDateSelect(date) {
        if (!date) return;

        // 이전 선택 해제
        const selected = this.calendarBody.querySelector('.selected');
        if (selected) {
            selected.classList.remove('selected');
        }

        // 새로운 날짜 선택
        this.selectedDate = date;
        const newSelected = this.calendarBody.querySelector(`[data-date="${date.toISOString()}"]`);
        if (newSelected) {
            newSelected.classList.add('selected');
        }

        // 콜백 실행
        if (this.callbacks.onDateSelect) {
            this.callbacks.onDateSelect(date);
        }
    }

    // 이전 달로 이동
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.generateCalendar();
    }

    // 다음 달로 이동
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.generateCalendar();
    }

    // 오늘 날짜인지 확인
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // 선택된 날짜인지 확인
    isSelectedDate(date) {
        return date.toDateString() === this.selectedDate.toDateString();
    }

    // 현재 선택된 날짜 반환
    getSelectedDate() {
        return this.selectedDate;
    }

    // 날짜 포맷팅
    formatDate(date, format = 'YYYY-MM-DD') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }

    // 달력 새로고침
    refresh() {
        this.generateCalendar();
    }

    // 특정 날짜로 이동
    goToDate(date) {
        this.currentDate = new Date(date);
        this.selectedDate = new Date(date);
        this.generateCalendar();
    }
}

// 싱글톤 인스턴스 생성
const calendarManager = new CalendarManager();
export default calendarManager;