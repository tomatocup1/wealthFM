// error_logs.js
async function fetchErrorLogs(date, platform = 'all', category = 'all') {
    try {
        let query = supabase
            .from('error_logs')
            .select('*')
            .order('occurred_at', { ascending: false });

        // 날짜 필터링 (해당 날짜의 데이터만 가져오기)
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query = query.gte('occurred_at', startDate.toISOString())
                        .lt('occurred_at', endDate.toISOString());
        }

        if (platform !== 'all') {
            query = query.eq('platform', platform);
        }
        if (category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('에러 로그 조회 실패:', error);
        throw error;
    }
}

// 로그 테이블 업데이트 함수
function updateLogTable(logs) {
    const tbody = document.getElementById('logTableBody');
    tbody.innerHTML = logs.map(log => `
        <tr>
            <td>${new Date(log.occurred_at).toLocaleString('ko-KR', { 
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })}</td>
            <td><span class="badge badge-${log.category === '오류' ? 'error' : 'warning'}">${log.category}</span></td>
            <td>${log.platform || '-'}</td>
            <td>${log.store_name || '-'}</td>
            <td>${log.error_type || '-'}</td>
            <td>${log.error_message || '-'}</td>
        </tr>
    `).join('');
}

// 필터링 및 검색 설정
function setupFilters() {
    const searchInput = document.querySelector('.search-input');
    const platformSelect = document.querySelector('.filter-select[data-filter="platform"]');
    const categorySelect = document.querySelector('.filter-select[data-filter="category"]');

    const handleFilter = async () => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const platform = platformSelect.value;
        const category = categorySelect.value;
        const logs = await fetchErrorLogs(dateStr, platform, category);
        
        // 검색어로 추가 필터링
        const searchTerm = searchInput.value.toLowerCase();
        const filteredLogs = searchTerm ? logs.filter(log => 
            (log.store_name && log.store_name.toLowerCase().includes(searchTerm)) ||
            (log.error_message && log.error_message.toLowerCase().includes(searchTerm))
        ) : logs;
        
        updateLogTable(filteredLogs);
    };

    searchInput.addEventListener('input', handleFilter);
    platformSelect.addEventListener('change', handleFilter);
    categorySelect.addEventListener('change', handleFilter);
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 초기 데이터 로드
        const today = new Date().toISOString().split('T')[0];
        const logs = await fetchErrorLogs(today);
        updateLogTable(logs);
        
        // 필터 설정
        setupFilters();
        
        // 캘린더 설정
        generateCalendar();
        setupCalendarEvents();
    } catch (error) {
        console.error('초기화 실패:', error);
        alert('페이지 로드 중 오류가 발생했습니다.');
    }
});

function setupCalendarEvents() {
    document.querySelectorAll('#calendarBody td[data-date]').forEach(td => {
        td.addEventListener('click', async function() {
            const date = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                parseInt(this.dataset.date)
            );
            
            // UI 업데이트
            document.querySelectorAll('#calendarBody td.selected').forEach(el => 
                el.classList.remove('selected'));
            this.classList.add('selected');
            
            // 데이터 로드
            try {
                const logs = await fetchErrorLogs(date.toISOString().split('T')[0]);
                updateLogTable(logs);
            } catch (error) {
                alert('데이터 로드 실패: ' + error.message);
            }
        });
    });
}