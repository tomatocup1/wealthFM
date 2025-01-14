import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Review.js
const ReviewDashboard = () => {
    const [stores, setStores] = React.useState([]);
    const [selectedStore, setSelectedStore] = React.useState('all');
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [selectedPlatform, setPlatform] = React.useState('all');
    const [statistics, setStatistics] = React.useState({
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        platforms: {
            baemin: { ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
            coupang: { ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
            yogiyo: { ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
        }
    });

    React.useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (!userInfo) {
            window.location.href = 'login.html';
            return;
        }
        loadStores(userInfo.role, userInfo.id);
    }, []);

    const loadStores = async (role, userId) => {
        try {
            let query = { table: 'customer_data', selects: ['store_code', 'store_name'] };
            
            // 권한별 조회 조건 설정
            switch (role) {
                case 'admin':
                    query.where = { admin_id: userId };
                    break;
                case 'franchise':
                    query.where = { franchise_id: userId };
                    break;
                case 'owner':
                    query.where = { owner_id: userId };
                    break;
                // webmaster는 조건 없이 전체 조회
            }

            // Supabase 쿼리 실행 (실제 구현 시에는 supabase 클라이언트 사용)
            const response = await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query)
            });
            
            if (!response.ok) throw new Error('Failed to fetch stores');
            
            const data = await response.json();
            setStores(data);
        } catch (error) {
            console.error('가게 목록 로드 실패:', error);
        }
    };

    const generateCalendar = () => {
        const today = selectedDate;
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        const weeks = [];
        let currentDay = new Date(firstDay);
        
        while (currentDay <= lastDay) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                if (currentDay.getMonth() === today.getMonth() && currentDay <= lastDay) {
                    week.push(new Date(currentDay));
                } else {
                    week.push(null);
                }
                currentDay.setDate(currentDay.getDate() + 1);
            }
            weeks.push(week);
        }
        
        return weeks;
    };

    const updateStatistics = async (date) => {
        try {
            const response = await fetch('/api/statistics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: date.toISOString(),
                    store: selectedStore,
                    platform: selectedPlatform
                })
            });
            
            if (!response.ok) throw new Error('Failed to fetch statistics');
            
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('통계 업데이트 실패:', error);
        }
    };

    return (
        <div className="dashboard-container">
            {/* 가게 선택 드롭다운 */}
            <select 
                className="store-select"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
            >
                <option value="all">전체 가게</option>
                {stores.map(store => (
                    <option key={store.store_code} value={store.store_code}>
                        {store.store_name}
                    </option>
                ))}
            </select>

            {/* 캘린더 */}
            <div className="calendar">
                <table>
                    <thead>
                        <tr>
                            <th>일</th>
                            <th>월</th>
                            <th>화</th>
                            <th>수</th>
                            <th>목</th>
                            <th>금</th>
                            <th>토</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generateCalendar().map((week, i) => (
                            <tr key={i}>
                                {week.map((day, j) => (
                                    <td 
                                        key={j}
                                        className={day?.toDateString() === selectedDate.toDateString() ? 'selected' : ''}
                                        onClick={() => day && setSelectedDate(day)}
                                    >
                                        {day?.getDate()}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 통계 */}
            <div className="stats-grid">
                {[5,4,3,2,1].map(rating => (
                    <div key={rating} className="stat-card">
                        <div className="stat-number">
                            {selectedPlatform === 'all' 
                                ? statistics.ratings[rating]
                                : statistics.platforms[selectedPlatform].ratings[rating]}
                        </div>
                        <div className="stat-label">{rating}점</div>
                    </div>
                ))}
            </div>

        {/* 플랫폼 탭 */}
        <div className="platform-tabs">
            <button 
                className={`platform-tab ${selectedPlatform === 'all' ? 'active' : ''}`}
                onClick={() => setPlatform('all')}
            >
                전체
            </button>
            <button 
                className={`platform-tab ${selectedPlatform === 'baemin' ? 'active' : ''}`}
                onClick={() => setPlatform('baemin')}
            >
                배민
            </button>
            <button 
                className={`platform-tab ${selectedPlatform === 'coupang' ? 'active' : ''}`}
                onClick={() => setPlatform('coupang')}
            >
                쿠팡
            </button>
            <button 
                className={`platform-tab ${selectedPlatform === 'yogiyo' ? 'active' : ''}`}
                onClick={() => setPlatform('yogiyo')}
            >
                요기요
            </button>
        </div>
                </div>
            );
        };

        // ReviewDashboard 컴포넌트를 전역에서 사용할 수 있도록 window 객체에 할당
        window.ReviewDashboard = ReviewDashboard;
            