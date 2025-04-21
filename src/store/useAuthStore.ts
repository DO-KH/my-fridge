import { create } from "zustand";
import { fetchCurrentUser } from "../api/auth/fetch-current-user";
import { fetchLogout } from "../api/auth/fetch-logout";
import { fetchLogin } from "../api/auth/fetch-login"; // ✅ 로그인 API 추가

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  loadUser: () => Promise<void>; // 세션 유지 확인
  login: (email: string, password: string) => Promise<void>; // 로그인
  logout: () => Promise<void>; // 로그아웃
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  // 세션 검증 및 상태 반영 
  loadUser: async () => {
    try {
      const currentUser = await fetchCurrentUser();
      set({ user: currentUser, isLoading: false });
    } catch (err) {
      console.log(err);
      set({ user: null, isLoading: false });
    }
  },

  // 로그인 함수 (로그인 후 유저 정보 즉시 업데이트)
  login: async (email, password) => {
    try {
      await fetchLogin(email, password);
      const currentUser = await fetchCurrentUser();
      set({ user: currentUser });
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
      set({ user: null });
    }
  },

  // 로그아웃
  logout: async () => {
    await fetchLogout();
    set({ user: null });
  },
}));