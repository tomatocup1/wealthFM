// error_logs.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// error_logs.js 파일 상단에 추가
function generateCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const calendarBody = document.getElementById('calendarBody');
    let date = 1;
    let html = '';

    // 달력 생성
    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay.getDay()) {
                html += '<td></td>';
            } else if (date > lastDay.getDate()) {
                html += '<td></td>';
            } else {
                const isToday = date === today.getDate();
                html += `<td class="${isToday ? 'today' : ''}" data-date="${date}">${date}</td>`;
                date++;
            }
        }
        html += '</tr>';
        if (date > lastDay.getDate()) break;
    }
    
    calendarBody.innerHTML = html;

    // 날짜 선택 이벤트 설정
    setupCalendarEvents();
}

// 에러 로그 조회 함수
async function fetchLogData(date) {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
            .from('error_logs')
            .select('*')
            .gte('occurred_at', startOfDay.toISOString())
            .lte('occurred_at', endOfDay.toISOString())
            .order('occurred_at', { ascending: false });

        if (error) throw error;

        console.log('Fetched logs:', data); // 데이터 확인용 로그
        return data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
}

// 로그 테이블 업데이트 함수
function updateLogTable(logs) {
    const tbody = document.getElementById('logTableBody');
    if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">해당 날짜의 오류 로그가 없습니다.</td></tr>';
        return;
    }

    tbody.innerHTML = logs.map(log => `
        <tr>
            <td>${new Date(log.occurred_at).toLocaleString('ko-KR')}</td>
            <td>
                <span class="badge ${log.category === '오류' ? 'badge-error' : 'badge-warning'}">
                    ${log.category || '-'}
                </span>
            </td>
            <td>${log.platform || '-'}</td>
            <td>${log.store_name || '-'}</td>
            <td>${log.error_type || '-'}</td>
            <td>${log.error_message || '-'}</td>
        </tr>
    `).join('');
}

// 날짜 선택 이벤트 핸들러
function setupCalendarEvents() {
    document.querySelectorAll('#calendarBody td[data-date]').forEach(td => {
        td.addEventListener('click', async function() {
            const date = this.dataset.date;
            const currentDate = new Date();
            const selectedDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                parseInt(date)
            );

            // 이전 선택 해제
            document.querySelectorAll('#calendarBody td.selected').forEach(el => {
                el.classList.remove('selected');
            });
            this.classList.add('selected');

            try {
                const logs = await fetchLogData(selectedDate);
                updateLogTable(logs);
            } catch (error) {
                console.error('Error:', error);
                alert('데이터 로드 중 오류가 발생했습니다.');
            }
        });
    });
}

// 필터 설정
function setupFilters() {
    const searchInput = document.querySelector('.search-input');
    const platformSelect = document.querySelector('.filter-select[data-filter="platform"]');
    const categorySelect = document.querySelector('.filter-select[data-filter="category"]');

    function filterLogs() {
        const rows = document.querySelectorAll('#logTableBody tr');
        const searchTerm = searchInput.value.toLowerCase();
        const selectedPlatform = platformSelect.value;
        const selectedCategory = categorySelect.value;

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const platform = row.children[2].textContent;
            const category = row.children[1].textContent.trim();
            
            const matchesSearch = text.includes(searchTerm);
            const matchesPlatform = selectedPlatform === 'all' || platform === selectedPlatform;
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

            row.style.display = matchesSearch && matchesPlatform && matchesCategory ? '' : 'none';
        });
    }

    searchInput.addEventListener('input', filterLogs);
    platformSelect.addEventListener('change', filterLogs);
    categorySelect.addEventListener('change', filterLogs);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 캘린더 생성
        generateCalendar();
        setupCalendarEvents();
        setupFilters();

        // 오늘 날짜 데이터 로드
        const today = new Date();
        const logs = await fetchLogData(today);
        updateLogTable(logs);
    } catch (error) {
        console.error('초기화 실패:', error);
        alert('페이지 로드 중 오류가 발생했습니다.');
    }
});

// export 문 수정
export { generateCalendar, fetchLogData, updateLogTable, setupCalendarEvents };