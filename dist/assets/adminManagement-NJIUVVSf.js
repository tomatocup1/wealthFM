let supabaseClient;

// Supabase 초기화 함수
async function initSupabase() {
    try {
        const response = await fetch('http://localhost:3000/config');
        if (!response.ok) throw new Error('Failed to fetch config');
        
        const config = await response.json();
        supabaseClient = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        console.log('Supabase initialized successfully');
        return supabaseClient;
    } catch (error) {
        console.error('Supabase 초기화 실패:', error);
        throw error;
    }
}

// 웹마스터 권한 확인
async function checkWebmasterPermission() {
    try {
        const userInfo = sessionStorage.getItem('userInfo');
        if (!userInfo) {
            throw new Error('로그인이 필요합니다.');
        }

        const { role } = JSON.parse(userInfo);
        if (role !== 'webmaster') {
            throw new Error('웹마스터 권한이 필요합니다.');
        }

        return true;
    } catch (error) {
        console.error('권한 확인 실패:', error);
        throw error;
    }
}

// 영업 관리자 등록
async function registerAdmin(adminData) {
    try {
        // 웹마스터 권한 확인
        await checkWebmasterPermission();

        // 입력값 검증
        if (!adminData.full_name || !adminData.user_id || !adminData.password || !adminData.email) {
            throw new Error('필수 입력 항목이 누락되었습니다.');
        }

        // 이메일 중복 확인
        const { data: existingEmail } = await supabaseClient
            .from('login_data')
            .select('email')
            .eq('email', adminData.email)
            .single();

        if (existingEmail) {
            throw new Error('이미 등록된 이메일입니다.');
        }

        // 사용자 ID 중복 확인
        const { data: existingUserId } = await supabaseClient
            .from('login_data')
            .select('user_id')
            .eq('user_id', adminData.user_id)
            .single();

        if (existingUserId) {
            throw new Error('이미 사용 중인 아이디입니다.');
        }

        // 관리자 계정 데이터 생성
        const newAdminData = {
            full_name: adminData.full_name,
            user_id: adminData.user_id,
            password_hash: adminData.password, // 실제 환경에서는 암호화 필요
            email: adminData.email,
            phone: adminData.phone || null,
            role: 'admin',
            created_at: new Date().toISOString()
        };

        // 관리자 계정 등록
        const { data: newAdmin, error } = await supabaseClient
            .from('login_data')
            .insert([newAdminData])
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            message: '관리자 계정이 성공적으로 등록되었습니다.',
            data: newAdmin
        };
    } catch (error) {
        console.error('관리자 등록 실패:', error);
        throw error;
    }
}

// 관리자에게 가게 할당
async function assignStoreToAdmin(adminId, storeCodes) {
    try {
        await checkWebmasterPermission();

        const assignments = storeCodes.map(storeCode => ({
            admin_id: adminId,
            store_code: storeCode,
            status: 'active'
        }));

        const { error } = await supabaseClient
            .from('admin_store_assignments')
            .insert(assignments);

        if (error) throw error;

        return {
            success: true,
            message: '가게가 성공적으로 할당되었습니다.'
        };
    } catch (error) {
        console.error('가게 할당 실패:', error);
        throw error;
    }
}

// 관리자의 담당 가게 목록 조회
async function getAdminStores(adminId) {
    try {
        const { data, error } = await supabaseClient
            .from('admin_store_assignments')
            .select(`
                store_code,
                customer_data (
                    store_name,
                    owner_name,
                    phone,
                    email
                )
            `)
            .eq('admin_id', adminId)
            .eq('status', 'active');

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('담당 가게 목록 조회 실패:', error);
        throw error;
    }
}

// 관리자 목록 조회 (담당 가게 정보 포함)
async function getAdminList() {
    try {
        await checkWebmasterPermission();

        const { data: admins, error } = await supabaseClient
            .from('login_data')
            .select(`
                id,
                full_name,
                user_id,
                email,
                phone,
                created_at,
                admin_store_assignments (
                    store_code,
                    customer_data (
                        store_name
                    )
                )
            `)
            .eq('role', 'admin')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return admins;
    } catch (error) {
        console.error('관리자 목록 조회 실패:', error);
        throw error;
    }
}

// 관리자 정보 수정
async function updateAdmin(adminId, updateData) {
    try {
        await checkWebmasterPermission();

        const allowedUpdates = {
            full_name: updateData.full_name,
            phone: updateData.phone,
            email: updateData.email,
            status: updateData.status
        };

        if (updateData.email) {
            const { data: existingEmail } = await supabaseClient
                .from('login_data')
                .select('email')
                .eq('email', updateData.email)
                .neq('id', adminId)
                .single();

            if (existingEmail) {
                throw new Error('이미 사용 중인 이메일입니다.');
            }
        }

        const { error } = await supabaseClient
            .from('login_data')
            .update(allowedUpdates)
            .eq('id', adminId)
            .eq('role', 'admin');

        if (error) throw error;

        return {
            success: true,
            message: '관리자 정보가 성공적으로 수정되었습니다.'
        };

    } catch (error) {
        console.error('관리자 정보 수정 실패:', error);
        throw error;
    }
}

// 관리자 계정 삭제
async function deleteAdmin(adminId) {
    try {
        await checkWebmasterPermission();

        // 먼저 가게 할당 정보 삭제
        await supabaseClient
            .from('admin_store_assignments')
            .delete()
            .eq('admin_id', adminId);

        // 관리자 계정 삭제
        const { error } = await supabaseClient
            .from('login_data')
            .delete()
            .eq('id', adminId)
            .eq('role', 'admin');

        if (error) throw error;

        return {
            success: true,
            message: '관리자 계정이 성공적으로 삭제되었습니다.'
        };

    } catch (error) {
        console.error('관리자 계정 삭제 실패:', error);
        throw error;
    }
}

// 모듈 내보내기
export {
    initSupabase,
    registerAdmin,
    assignStoreToAdmin,
    getAdminStores,
    getAdminList,
    updateAdmin,
    deleteAdmin
};