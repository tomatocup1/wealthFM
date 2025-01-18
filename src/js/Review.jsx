import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ReviewDashboard = () => {
    const [stores, setStores] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedStore, setSelectedStore] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPlatform, setPlatform] = useState('all');
    const [statistics, setStatistics] = useState({
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);

    // 달력을 위한 상태들
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());

    // 달력 생성 함수
    const generateCalendar = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        
        const weeks = [];
        let currentWeek = [];
        
        for (let day = new Date(startDate); day <= lastDay; day.setDate(day.getDate() + 1)) {
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(new Date(day));
        }
        
        while (currentWeek.length < 7) {
            const nextDay = new Date(currentWeek[currentWeek.length - 1]);
            nextDay.setDate(nextDay.getDate() + 1);
            currentWeek.push(nextDay);
        }
        weeks.push(currentWeek);
        
        return weeks;
    };

    // 날짜 선택 핸들러
    const handleDateSelect = (date) => {
        setSelectedDay(date);
        setSelectedDate(date);
        // 선택된 날짜로 리뷰 데이터 로드
        loadReviews(date);
    };

    // 리뷰 데이터 로드 함수
    const loadReviews = async (date = selectedDate) => {
        try {
            setLoading(true);
            const formattedDate = date.toISOString().split('T')[0];
            
            let query = supabase
                .from('review_data')
                .select('*') // ai_reply도 포함됨
                .eq('review_date', formattedDate);

            if (selectedStore !== 'all') {
                query = query.eq('store_code', selectedStore);
            }
            
            if (selectedPlatform !== 'all') {
                query = query.eq('platform', selectedPlatform);
            }

            const { data, error } = await query;
            if (error) throw error;

            setReviews(data || []);
            updateStatistics(data || []);
        } catch (error) {
            console.error('리뷰 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // 통계 업데이트
    const updateStatistics = (reviewData) => {
        const newStats = {
            ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };

        reviewData.forEach(review => {
            const rating = parseInt(review.star_rating);
            if (rating >= 1 && rating <= 5) {
                newStats.ratings[rating]++;
            }
        });

        setStatistics(newStats);
    };

    // 날짜 포맷
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="dashboard-container p-6">
            {/* 달력 섹션 */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">날짜 선택</h2>
                <div className="mb-4 flex justify-between items-center">
                    <button 
                        onClick={() => {
                            const prevMonth = new Date(currentMonth);
                            prevMonth.setMonth(prevMonth.getMonth() - 1);
                            setCurrentMonth(prevMonth);
                        }}
                        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        이전 달
                    </button>
                    <div className="text-lg font-bold">
                        {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                    </div>
                    <button 
                        onClick={() => {
                            const nextMonth = new Date(currentMonth);
                            nextMonth.setMonth(nextMonth.getMonth() + 1);
                            setCurrentMonth(nextMonth);
                        }}
                        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        다음 달
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                        <div key={day} className="text-center font-bold py-2">{day}</div>
                    ))}
                    {generateCalendar(currentMonth).flat().map((date, index) => (
                        <div
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            className={`
                                text-center p-2 cursor-pointer rounded
                                ${date.getMonth() === currentMonth.getMonth() ? 'text-gray-800' : 'text-gray-400'}
                                ${
                                    selectedDay.toDateString() === date.toDateString()
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-gray-100'
                                }
                            `}
                        >
                            {date.getDate()}
                        </div>
                    ))}
                </div>
            </div>

            {/* 가게 선택 (owner가 아닐 때만) */}
            {userRole !== 'owner' && (
                <select 
                    className="w-full p-2 mb-4 border rounded"
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
            )}

            {/* 통계 섹션 */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">별점 통계</h2>
                <div className="grid grid-cols-5 gap-4">
                    {[5,4,3,2,1].map(rating => (
                        <div key={rating} className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold">{statistics.ratings[rating]}</div>
                            <div className="text-gray-600">{rating}점</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 플랫폼 필터 */}
            <div className="flex gap-4 mb-6">
                {['all', '배민', '쿠팡', '요기요'].map(platform => (
                    <button 
                        key={platform}
                        onClick={() => setPlatform(platform)}
                        className={`px-4 py-2 rounded-lg ${
                            selectedPlatform === platform 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-white'
                        }`}
                    >
                        {platform === 'all' ? '전체' : platform}
                    </button>
                ))}
            </div>

            {/* 리뷰 목록 */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold mb-4">{formatDate(selectedDate)} 리뷰</h3>
                {loading ? (
                    <div className="text-center py-8">데이터를 불러오는 중...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8">리뷰가 없습니다.</div>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <span className="font-semibold">{review.store_name}</span>
                                    <span className="ml-2 text-gray-600">{review.platform}</span>
                                </div>
                                <span className="text-gray-600">{review.review_date}</span>
                            </div>
                            <div className="mb-2">{review.review_text}</div>
                            <div className="text-gray-600">
                                <span>주문메뉴: {review.order_menu}</span>
                                <span className="ml-4">별점: {review.star_rating}점</span>
                            </div>

                            {/* AI 답변 영역 */}
                            {review.ai_reply && (
                              <div className="mt-2 p-2 bg-gray-50">
                                <strong>사장님 답글:</strong> {review.ai_reply}
                              </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewDashboard;
