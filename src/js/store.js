// stores.js
import { supabase } from './supabaseClient.js';

class StoreManager {
    constructor() {
        this.stores = [];
        this.currentStore = null;
    }

    // 사용자 권한별 가게 목록 로드
    async loadStores(role, userId) {
        try {
            let query = supabase.from('customer_data').select(`
                store_code,
                store_name,
                owner_name,
                phone,
                email,
                business_number,
                business_address,
                baemin_code,
                baemin1_code,
                coupang_code,
                yogiyo_code
            `);

            // 권한별 필터링
            switch (role) {
                case 'admin':
                    // 관리자에게 할당된 가게만 조회
                    const { data: assignedStores } = await supabase
                        .from('admin_store_assignments')
                        .select('store_code')
                        .eq('admin_id', userId)
                        .eq('status', 'active');
                    
                    if (assignedStores) {
                        const storeCodes = assignedStores.map(store => store.store_code);
                        query = query.in('store_code', storeCodes);
                    }
                    break;

                case 'franchise':
                    // 프랜차이즈에 속한 가게만 조회
                    query = query.eq('franchise_id', userId);
                    break;

                case 'owner':
                    // 점주의 가게만 조회
                    query = query.eq('store_code', userId);
                    break;
            }

            const { data, error } = await query.order('store_name');
            
            if (error) throw error;
            
            this.stores = data || [];
            return this.stores;

        } catch (error) {
            console.error('가게 목록 로드 실패:', error);
            throw error;
        }
    }

    // 단일 가게 정보 조회
    async getStoreDetails(storeCode) {
        try {
            const { data, error } = await supabase
                .from('customer_data')
                .select(`
                    store_code,
                    store_name,
                    owner_name,
                    phone,
                    email,
                    business_number,
                    business_address,
                    baemin_code,
                    baemin1_code,
                    coupang_code,
                    yogiyo_code,
                    created_at,
                    updated_at
                `)
                .eq('store_code', storeCode)
                .single();

            if (error) throw error;
            
            this.currentStore = data;
            return data;

        } catch (error) {
            console.error('가게 정보 조회 실패:', error);
            throw error;
        }
    }

    // 가게별 리뷰 통계 조회
    async getStoreStatistics(storeCode, startDate, endDate) {
        try {
            let query = supabase
                .from('review_data')
                .select('star_rating, platform')
                .eq('store_code', storeCode);

            if (startDate) {
                query = query.gte('review_date', startDate);
            }
            if (endDate) {
                query = query.lte('review_date', endDate);
            }

            const { data, error } = await query;
            
            if (error) throw error;

            // 통계 계산
            const statistics = {
                totalReviews: data.length,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                platformDistribution: {}
            };

            let totalRating = 0;
            data.forEach(review => {
                // 별점 분포
                const rating = parseInt(review.star_rating);
                if (rating >= 1 && rating <= 5) {
                    statistics.ratingDistribution[rating]++;
                    totalRating += rating;
                }

                // 플랫폼별 분포
                if (review.platform) {
                    statistics.platformDistribution[review.platform] = 
                        (statistics.platformDistribution[review.platform] || 0) + 1;
                }
            });

            statistics.averageRating = totalRating / data.length || 0;

            return statistics;

        } catch (error) {
            console.error('가게 통계 조회 실패:', error);
            throw error;
        }
    }

    // 가게 선택 UI 업데이트
    updateStoreSelect(stores = this.stores) {
        const storeSelect = document.getElementById('storeSelect');
        if (!storeSelect) return;

        let options = '<option value="all">전체 가게</option>';
        stores.forEach(store => {
            options += `<option value="${store.store_code}">${store.store_name}</option>`;
        });

        storeSelect.innerHTML = options;
    }

    // 현재 선택된 가게 설정
    setCurrentStore(storeCode) {
        this.currentStore = this.stores.find(store => store.store_code === storeCode);
        return this.currentStore;
    }

    // 현재 선택된 가게 정보 반환
    getCurrentStore() {
        return this.currentStore;
    }

    // 가게 목록 반환
    getAllStores() {
        return this.stores;
    }
}

// 싱글톤 인스턴스 생성 및 내보내기
const storeManager = new StoreManager();
export default storeManager;