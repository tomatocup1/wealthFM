// customerData.js

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
    // login_data 테이블용 데이터
    const loginData = {
        store_code: storeCode,
        store_name: document.getElementById('store_name').value,
        full_name: document.getElementById('owner_name').value,
        user_id: document.getElementById('email').value.split('@')[0],
        password_hash: generateDefaultPassword(),
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
        baemin_id: document.getElementById('baemin_id').value,
        baemin_pw: document.getElementById('baemin_pw').value,
        coupang_id: document.getElementById('coupang_id').value,
        coupang_pw: document.getElementById('coupang_pw').value,
        yogiyo_id: document.getElementById('yogiyo_id').value,
        yogiyo_pw: document.getElementById('yogiyo_pw').value,
        owner_name: document.getElementById('owner_name').value,
        baemin_code: document.getElementById('baemin_code').value,
        baemin1_code: document.getElementById('baemin1_code').value,
        coupang_code: document.getElementById('coupang_code').value,
        yogiyo_code: document.getElementById('yogiyo_code').value
    };

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

    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`다음 필수 항목을 입력해주세요:\n${missingFields.join('\n')}`);
    }
}

// 폼 제출 핸들러
function setupFormHandler() {
    document.getElementById('customerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // 새로운 매장 코드 생성
            const newStoreCode = await generateStoreCode();
            console.log('New store code:', newStoreCode);

            // 폼 데이터 수집
            const { loginData, customerData } = collectFormData(newStoreCode);

            // 필수 필드 검증
            validateRequiredFields(loginData);

            // login_data 테이블에 데이터 저장
            const { error: loginError } = await supabase
                .from('login_data')
                .insert([loginData]);

            if (loginError) throw loginError;

            // customer_data 테이블에 데이터 저장
            const { error: customerError } = await supabase
                .from('customer_data')
                .insert([customerData]);

            if (customerError) {
                // customer_data 저장 실패시 login_data 롤백
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