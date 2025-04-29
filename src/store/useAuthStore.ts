import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchCurrentUser } from "../api/auth/fetch-current-user";
import { fetchLogout } from "../api/auth/fetch-logout";
import { fetchLogin } from "../api/auth/fetch-login";
import { fetchRegister } from "@/api/auth/fetch-register";
import { useItemStore } from "./useItemStore";

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
  register: (
    email: string,
    password: string,
    name: string,
    withGuestData: boolean
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<string>;
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
          const user = await fetchCurrentUser({ silent: true });
          console.log("👤 [LAYOUT MOUNT] fetchCurrentUser:", user);
          set({ user, status: "authenticated" });
        } catch (err) {
          console.log("[LAYOUT MOUNT] 세션 없음:", err);
          set({ user: null, status: "guest" });
        }
      },

      register: async (email, password, name, withGuestData) => {
        try {
          console.log("🔵 register 시작", { email, withGuestData });
          await fetchRegister(email, password, name);
          console.log("✅ fetchRegister 완료");
      
          if (!withGuestData) {
            console.log("🟡 withGuestData: false → 회원가입만 진행 후 끝");
            return false;
          }
      
          const loginUser = await useAuthStore.getState().login(email, password);
          console.log("✅ login 결과:", loginUser);
      
          if (!loginUser) {
            console.error("❌ 로그인 실패 → 강제 종료");
            return false;
          }
      
          const bulkResult = await useItemStore.getState().bulkCreateFromLocalItems();
          console.log("✅ bulkCreateFromLocalItems 결과:", bulkResult);
      
          const clearResult = await useItemStore.getState().clearLocalItems();
          console.log("✅ clearLocalItems 결과:", clearResult);
      
          return true;
        } catch (err) {
          console.error("❌ register 실패:", err);
          return false;
        }
      },
      
      

      login: async (email, password) => {
        try {
          await fetchLogin(email, password); // 세션 생성
          const user = await fetchCurrentUser({ silent: false }); // 유저 정보 요청
          console.log("👤 [LOGIN FLOW] fetchCurrentUser:", user);
          set({ user, status: "authenticated" });
          return user
        } catch (err) {
          console.error("[LOGIN FLOW] 로그인 실패:", err);
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
