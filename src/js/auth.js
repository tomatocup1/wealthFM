// src/js/auth.js
import { supabase } from './supabaseClient.js';

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

export function checkSession() {
    const userInfo = sessionStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}

export function saveSession(userInfo) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export function logout() {
    sessionStorage.removeItem('userInfo');
    window.location.href = 'login.html';
}

// 역할에 따른 메뉴 업데이트 함수
export function updateMenuByRole(role) {
    console.log(`현재 역할: ${role}`);
    const navMenu = document.getElementById('navMenu');

    if (!navMenu) return;

    // 역할별 메뉴 설정
    let menuHtml = '';
    switch (role) {
        case 'admin':
            menuHtml = `
                <a href="/dashboard.html" class="nav-link">대시보드</a>
                <a href="/users.html" class="nav-link">사용자 관리</a>
            `;
            break;
        case 'franchise':
            menuHtml = `
                <a href="/stores.html" class="nav-link">가게 관리</a>
                <a href="/orders.html" class="nav-link">주문 관리</a>
            `;
            break;
        case 'owner':
            menuHtml = `
                <a href="/reviews.html" class="nav-link">리뷰</a>
            `;
            break;
        default:
            menuHtml = `
                <a href="/home.html" class="nav-link">홈</a>
            `;
    }

    navMenu.innerHTML = menuHtml;
}
