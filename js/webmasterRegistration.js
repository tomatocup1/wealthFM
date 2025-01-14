let supabaseClient;

// Supabase 초기화 함수
async function initSupabase() {
    try {
        const response = await fetch('http://localhost:3000/config');
        if (!response.ok) throw new Error('Failed to fetch config');
        
        const config = await response.json();
        supabaseClient = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        console.log('Supabase initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
    }
}

// 에러 메시지 표시 함수
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// 에러 메시지 숨기기 함수
function hideError(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

// 입력값 유효성 검사 함수
function validateInput(value, pattern, errorElementId, errorMessage) {
    if (!pattern.test(value)) {
        showError(errorElementId, errorMessage);
        return false;
    }
    hideError(errorElementId);
    return true;
}

// 웹마스터 계정 등록 함수
async function registerWebmaster(webmasterData) {
    try {
        if (!supabaseClient) {
            throw new Error('Supabase is not initialized');
        }

        // 이메일 중복 확인
        const { data: existingEmail } = await supabaseClient
            .from('login_data')
            .select('email')
            .eq('email', webmasterData.email)
            .single();

        if (existingEmail) {
            throw new Error('이미 등록된 이메일입니다.');
        }

        // 사용자 ID 중복 확인
        const { data: existingUserId } = await supabaseClient
            .from('login_data')
            .select('user_id')
            .eq('user_id', webmasterData.user_id)
            .single();

        if (existingUserId) {
            throw new Error('이미 사용 중인 아이디입니다.');
        }

        // 웹마스터 계정 데이터 준비
        const accountData = {
            full_name: webmasterData.full_name,
            user_id: webmasterData.user_id,
            password_hash: webmasterData.password, // 실제 환경에서는 암호화 필요
            email: webmasterData.email,
            phone: webmasterData.phone || null,
            role: 'webmaster',
            created_at: new Date().toISOString()
        };

        // 웹마스터 계정 등록
        const { error } = await supabaseClient
            .from('login_data')
            .insert([accountData]);

        if (error) throw error;

        return { success: true, message: '웹마스터 계정이 성공적으로 등록되었습니다.' };

    } catch (error) {
        console.error('웹마스터 등록 오류:', error);
        throw error;
    }
}

// 폼 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', async function() {
    await initSupabase();

    const form = document.getElementById('webmasterForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 모든 에러 메시지 초기화
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

        // 입력값 유효성 검사
        const userId = document.getElementById('user_id').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password_confirm').value;
        const email = document.getElementById('email').value;

        // 아이디 검사
        if (!validateInput(userId, /^[a-zA-Z0-9_]{5,20}$/, 'userIdError', 
            '아이디는 5~20자의 영문, 숫자, 언더스코어만 사용 가능합니다.')) return;

        // 비밀번호 검사
        if (!validateInput(password, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'passwordError',
            '비밀번호는 8자 이상의 영문과 숫자 조합이어야 합니다.')) return;

        // 비밀번호 확인
        if (password !== passwordConfirm) {
            showError('passwordConfirmError', '비밀번호가 일치하지 않습니다.');
            return;
        }

        // 이메일 검사
        if (!validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'emailError',
            '유효한 이메일 주소를 입력해주세요.')) return;

        try {
            const webmasterData = {
                full_name: document.getElementById('full_name').value,
                user_id: userId,
                password: password,
                email: email,
                phone: document.getElementById('phone').value
            };

            const result = await registerWebmaster(webmasterData);
            alert(result.message);
            form.reset();
        } catch (error) {
            alert('계정 등록 실패: ' + error.message);
        }
    });
});