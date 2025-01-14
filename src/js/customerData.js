// customerData.js
import { createClient } from '@supabase/supabase-js';

// 환경변수 사용 전 로그로 확인
console.log('SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('SUPABASE KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

// Supabase 클라이언트 초기화
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 매장 코드 생성 함수
async function generateStoreCode() {
    try {
        const { data, error } = await supabase
            .from('customer_data')
            .select('store_code')
            .order('store_code', { ascending: false })
            .limit(1);

        if (error) throw error;

        let newCode;
        if (data && data.length > 0) {
            const lastCode = data[0].store_code;
            const lastNumber = parseInt(lastCode.substring(3));
            newCode = 'AAA' + String(lastNumber + 1).padStart(4, '0');
        } else {
            newCode = 'AAA0001';
        }
        
        return newCode;
    } catch (error) {
        console.error('매장 코드 생성 오류:', error);
        throw error;
    }
}

// 기본 비밀번호 생성 함수 (임시)
function generateDefaultPassword() {
    return Math.random().toString(36).slice(-8);
}

// 폼 데이터 수집 함수
function collectFormData(storeCode) {
    // 폼 입력값 직접 로깅
    console.log('owner_name value:', document.getElementById('owner_name').value);

    // login_data 테이블용 데이터
    const loginData = {
        store_code: storeCode,
        store_name: document.getElementById('store_name').value,
        owner_name: document.getElementById('owner_name').value, // owner_name 추가
        user_id: document.getElementById('user_id').value, // 사용자가 입력한 사용자 ID 사용
        password_hash: document.getElementById('password').value, // 사용자가 입력한 비밀번호 사용
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        business_number: document.getElementById('business_number').value,
        business_address: document.getElementById('business_address').value,
        manager_name: document.getElementById('manager_name').value,
        manager_phone: document.getElementById('manager_phone').value,
        role: 'owner',
        created_at: new Date().toISOString()
    };

    // customer_data 테이블용 데이터
    const customerData = {
        store_code: storeCode,
        store_name: document.getElementById('store_name').value,
        owner_name: document.getElementById('owner_name').value, // owner_name 추가
        baemin_id: document.getElementById('baemin_id').value,
        baemin_pw: document.getElementById('baemin_pw').value,
        coupang_id: document.getElementById('coupang_id').value,
        coupang_pw: document.getElementById('coupang_pw').value,
        yogiyo_id: document.getElementById('yogiyo_id').value,
        yogiyo_pw: document.getElementById('yogiyo_pw').value,
        baemin_code: document.getElementById('baemin_code').value,
        baemin1_code: document.getElementById('baemin1_code').value,
        coupang_code: document.getElementById('coupang_code').value,
        yogiyo_code: document.getElementById('yogiyo_code').value
    };
    // 데이터가 제대로 수집되었는지 확인
    console.log('Collected login data:', loginData);
    console.log('Collected customer data:', customerData);
    
    return { loginData, customerData };
}

// 필수 필드 검증 함수
function validateRequiredFields(data) {
    const requiredFields = [
        'store_name', 
        'owner_name', 
        'manager_name',
        'manager_phone', 
        'phone', 
        'email',
        'business_number', 
        'business_address'
    ];

    // 디버깅을 위한 로그 추가
    console.log('Validating fields:', data);

    const missingFields = requiredFields.filter(field => {
        const isEmpty = !data[field];
        if (isEmpty) {
            console.log(`Missing field: ${field}`);
        }
        return isEmpty;
    });
    
    if (missingFields.length > 0) {
        throw new Error(`다음 필수 항목을 입력해주세요:\n${missingFields.join('\n')}`);
    }
}

// 폼 제출 핸들러
function setupFormHandler() {
    document.getElementById('customerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // 입력값 디버깅
            const formData = new FormData(this);
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // 새로운 매장 코드 생성
            const newStoreCode = await generateStoreCode();
            console.log('New store code:', newStoreCode);

            // 폼 데이터 수집
            const { loginData, customerData } = collectFormData(newStoreCode);

            // 데이터 유효성 검사 전 로그
            console.log('Login Data:', loginData);
            console.log('Customer Data:', customerData);

            // 필수 필드 검증
            validateRequiredFields(loginData);

            // Supabase 연결 상태 확인
            const { data, error } = await supabase.from('login_data').select('count').single();
            if (error) {
                console.error('Supabase connection error:', error);
                throw new Error('데이터베이스 연결에 실패했습니다.');
            }

            // 데이터 저장
            const { error: loginError } = await supabase
                .from('login_data')
                .insert([loginData]);

            if (loginError) throw loginError;

            const { error: customerError } = await supabase
                .from('customer_data')
                .insert([customerData]);

            if (customerError) {
                await supabase
                    .from('login_data')
                    .delete()
                    .match({ store_code: newStoreCode });
                throw customerError;
            }

            alert(`매장이 성공적으로 등록되었습니다.\n매장 코드: ${newStoreCode}\n초기 비밀번호: ${loginData.password_hash}`);
            window.location.reload();

        } catch (error) {
            console.error('저장 오류:', error);
            alert(`저장 중 오류가 발생했습니다: ${error.message}`);
        }
    });
}

// 페이지 로드 시 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', setupFormHandler);

// 모듈 내보내기
export {
    setupFormHandler,
    generateStoreCode,
    validateRequiredFields
};