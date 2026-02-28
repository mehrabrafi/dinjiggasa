import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: { user: any; access_token: string }) => void;
    logout: () => void;
}

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return { user: null, token: null, isAuthenticated: false };
    }

    const token = Cookies.get('token');
    const userStr = Cookies.get('user');
    let user = null;

    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error('Invalid user cookie');
        }
    }

    return {
        token: token || null,
        user: user,
        isAuthenticated: !!token && !!user,
    };
};

export const useAuthStore = create<AuthState>((set) => ({
    ...getInitialState(),

    login: (data) => {
        Cookies.set('token', data.access_token, { expires: 7 }); // 7 days
        Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
        set({ user: data.user, token: data.access_token, isAuthenticated: true });
    },

    logout: () => {
        Cookies.remove('token');
        Cookies.remove('user');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
