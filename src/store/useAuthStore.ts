import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchCurrentUser } from "../api/auth/fetch-current-user";
import { fetchLogout } from "../api/auth/fetch-logout";
import { fetchLogin } from "../api/auth/fetch-login";

type AuthStatus = "checking" | "guest" | "authenticated";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  status: AuthStatus;
  hasChosenStorage: boolean;
  setHasChosenStorage: (value: boolean) => void;

  // methods
  loadUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "checking",
      hasChosenStorage: false,

      setHasChosenStorage: (value) => {
        set({ hasChosenStorage: value });
      },

      loadUser: async () => {
        try {
          const user = await fetchCurrentUser();
          set({ user, status: "authenticated" });
        } catch (err) {
          console.log("세션 없음 (게스트):", err);
          set({ user: null, status: "guest" });
        }
      },

      login: async (email, password) => {
        try {
          await fetchLogin(email, password); // 세션 생성
          const user = await fetchCurrentUser(); // 유저 정보 요청
          set({ user, status: "authenticated" });
        } catch (err) {
          console.error("❌ 로그인 실패:", err);
          // 로그인 실패해도 상태를 guest로 명시적으로 설정
          set({ user: null, status: "guest" });
        }
      },

      logout: async () => {
        await fetchLogout();
        set({ user: null, status: "guest" });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        hasChosenStorage: state.hasChosenStorage,
      }),
    }
  )
);
