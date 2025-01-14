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
// ID 중복 검사 함수
async function checkUserId() {
    const userId = document.getElementById('user_id').value;
    const resultElement = document.getElementById('idCheckResult');
    
    if (!userId) {
        alert("ID를 입력해주세요.");
        return;
    }

    try {
        const { data, error } = await supabase
            .from('login_data')
            .select('user_id')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (data) {
            resultElement.style.color = 'red';
            resultElement.innerHTML = '이미 사용중인 ID입니다.';
        } else {
            resultElement.style.color = 'green';
            resultElement.innerHTML = '사용 가능한 ID입니다.';
        }
    } catch (error) {
        console.error('ID 중복 검사 오류:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 폼 데이터 수집 함수
function collectFormData(storeCode) {
    // 폼 입력값 직접 로깅
    console.log('owner_name value:', document.getElementById('owner_name').value);
    // 공통 필드 먼저 수집
    const commonFields = {
        store_code: storeCode,
        store_name: document.getElementById('store_name').value.trim(),
        owner_name: document.getElementById('owner_name').value.trim()
    };

    // login_data 테이블용 데이터
        const loginData = {
            ...commonFields,
            user_id: document.getElementById('user_id').value.trim(),
            password_hash: document.getElementById('password').value,
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim() || null,
            created_at: new Date().toISOString(),
            business_number: document.getElementById('business_number').value.trim(),
            business_address: document.getElementById('business_address').value.trim(),
            manager_name: document.getElementById('manager_name').value.trim(),
            manager_phone: document.getElementById('manager_phone').value.trim() || null,
            role: 'owner'
        };

        // customer_data 테이블용 데이터
        const customerData = {
            ...commonFields,
            baemin_id: document.getElementById('baemin_id').value.trim() || null,
            baemin_pw: document.getElementById('baemin_pw').value.trim() || null,
            coupang_id: document.getElementById('coupang_id').value.trim() || null,
            coupang_pw: document.getElementById('coupang_pw').value.trim() || null,
            yogiyo_id: document.getElementById('yogiyo_id').value.trim() || null,
            yogiyo_pw: document.getElementById('yogiyo_pw').value.trim() || null,
            baemin_code: document.getElementById('baemin_code').value.trim() || null,
            baemin1_code: document.getElementById('baemin1_code').value.trim() || null,
            coupang_code: document.getElementById('coupang_code').value.trim() || null,
            yogiyo_code: document.getElementById('yogiyo_code').value.trim() || null
        };

        console.log('Collected login data:', loginData);
        console.log('Collected customer data:', customerData);

        return { loginData, customerData };
    }

    // 필수 필드 검증 함수 수정
    function validateRequiredFields(data) {
        const requiredFields = [
            { field: 'store_name', label: '매장명' },
            { field: 'owner_name', label: '사장님 성함' },
            { field: 'user_id', label: '부의 정석 아이디' },
            { field: 'password_hash', label: '부의 정석 비밀번호' },
            { field: 'email', label: '이메일' },
            { field: 'phone', label: '연락처' },
            { field: 'business_number', label: '사업자 번호' },
            { field: 'business_address', label: '사업자 주소' },
            { field: 'manager_name', label: '영업 담당자' },
            { field: 'manager_phone', label: '영업 담당자 연락처' }
        ];

        // 디버깅을 위한 로그 추가
        console.log('Validating fields:', data);

        const missingFields = requiredFields.filter(({ field, label }) => {
            const isEmpty = !data[field] || data[field].trim() === '';
            if (isEmpty) {
                console.log(`Missing required field: ${field} (${label})`);
            }
            return isEmpty;
        });

        if (missingFields.length > 0) {
            throw new Error(`다음 필수 항목을 입력해주세요:\n${missingFields.map(f => f.label).join('\n')}`);
        }
    }

    // 폼 제출 핸들러 수정
    function setupFormHandler() {
        document.getElementById('customerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // 새 매장 코드 생성
                const newStoreCode = await generateStoreCode();
                console.log('Generated store code:', newStoreCode);

                // 폼 데이터 수집
                const { loginData, customerData } = collectFormData(newStoreCode);

                // 필수 필드 검증
                validateRequiredFields(loginData);

                // login_data 테이블에 데이터 삽입
                const { error: loginError } = await supabase
                    .from('login_data')
                    .insert([loginData]);

                if (loginError) {
                    console.error('Login data insertion error:', loginError);
                    throw loginError;
                }

                // customer_data 테이블에 데이터 삽입
                const { error: customerError } = await supabase
                    .from('customer_data')
                    .insert([customerData]);

                if (customerError) {
                    // 롤백: login_data 삭제
                    console.error('Customer data insertion error:', customerError);
                    await supabase
                        .from('login_data')
                        .delete()
                        .match({ store_code: newStoreCode });
                    throw customerError;
                }

                alert(`매장이 성공적으로 등록되었습니다.\n매장 코드: ${newStoreCode}`);
                this.reset();

            } catch (error) {
                console.error('저장 오류:', error);
                alert(`저장 중 오류가 발생했습니다: ${error.message}`);
            }
        });
        document.getElementById('checkUserIdBtn').addEventListener('click', checkUserId);
    }

// 페이지 로드 시 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', setupFormHandler);

// 모듈 내보내기
export {
    setupFormHandler,
    generateStoreCode,
    validateRequiredFields,
    checkUserId
};