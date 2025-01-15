import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ReviewDashboard = () => {
    // 상태 관리
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

    // 사용자 권한 확인 및 초기 데이터 로드
    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (userInfo) {
            setUserRole(userInfo.role);
            loadStores(userInfo.role, userInfo.id);
        }
    }, []);

    // 가게 목록 로드
    const loadStores = async (role, userId) => {
        try {
            let query = supabase.from('customer_data').select('store_code, store_name');

            switch (role) {
                case 'admin':
                    query = query.eq('admin_id', userId);
                    break;
                case 'franchise':
                    query = query.eq('franchise_id', userId);
                    break;
                case 'owner':
                    query = query.eq('store_code', userId);
                    break;
            }

            const { data, error } = await query.order('store_name');
            if (error) throw error;
            setStores(data || []);
        } catch (error) {
            console.error('가게 목록 로드 실패:', error);
        }
    };

    // 리뷰 데이터 로드
    const loadReviews = async () => {
        try {
            setLoading(true);
            
            let query = supabase.from('review_data')
                .select('store_code, review_date, platform, star_rating, review_text, order_menu, store_name')
                .order('review_date', { ascending: false });

            // 필터 적용
            if (selectedStore !== 'all') {
                query = query.eq('store_code', selectedStore);
            }

            if (selectedDate) {
                const dateStr = selectedDate.toISOString().split('T')[0];
                query = query.eq('review_date', dateStr);
            }

            if (selectedPlatform !== 'all') {
                query = query.eq('platform', selectedPlatform);
            }

            const { data, error } = await query;
            if (error) throw error;

            setReviews(data || []);
            updateStatistics(data || []);
        } catch (error) {
            console.error('리뷰 데이터 로드 실패:', error);
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

    // 데이터 변경시 리뷰 다시 로드
    useEffect(() => {
        loadReviews();
    }, [selectedStore, selectedDate, selectedPlatform]);

    // 달력 날짜 클릭 핸들러
    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    // 플랫폼 선택 핸들러
    const handlePlatformChange = (platform) => {
        setPlatform(platform);
    };

    return (
        <div className="dashboard-container p-6">
            {/* 가게 선택 */}
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

            {/* 통계 */}
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
                <button 
                    onClick={() => handlePlatformChange('all')}
                    className={`px-4 py-2 rounded-lg ${selectedPlatform === 'all' ? 'bg-gray-800 text-white' : 'bg-white'}`}
                >
                    전체
                </button>
                <button 
                    onClick={() => handlePlatformChange('배민')}
                    className={`px-4 py-2 rounded-lg ${selectedPlatform === '배민' ? 'bg-gray-800 text-white' : 'bg-white'}`}
                >
                    배달의민족
                </button>
                <button 
                    onClick={() => handlePlatformChange('쿠팡')}
                    className={`px-4 py-2 rounded-lg ${selectedPlatform === '쿠팡' ? 'bg-gray-800 text-white' : 'bg-white'}`}
                >
                    쿠팡이츠
                </button>
                <button 
                    onClick={() => handlePlatformChange('요기요')}
                    className={`px-4 py-2 rounded-lg ${selectedPlatform === '요기요' ? 'bg-gray-800 text-white' : 'bg-white'}`}
                >
                    요기요
                </button>
            </div>

            {/* 리뷰 목록 */}
            <div className="space-y-4">
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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewDashboard;

