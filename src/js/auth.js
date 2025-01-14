// src/js/auth.js
import { supabase } from './supabaseClient.js';  // 경로 수정

// 로그인 함수
export async function loginUser(userId, password) {
    try {
        const { data, error } = await supabase
            .from('login_data')
            .select('*')
            .eq('user_id', userId)
            .eq('password_hash', password)
            .single();

        if (error) throw error;
        if (!data) throw new Error('사용자를 찾을 수 없습니다.');

        return {
            success: true,
            user: {
                id: data.id,
                role: data.role,
                storeName: data.store_name,
                storeCode: data.store_code,
                name: data.full_name
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// 세션 검사 함수
export function checkSession() {
    const userInfo = sessionStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}

// 세션 저장 함수
export function saveSession(userInfo) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}

// 로그아웃 함수
export function logout() {
    sessionStorage.removeItem('userInfo');
    window.location.href = 'login.html';
}