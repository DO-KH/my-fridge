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
          
          set({ user, status: "authenticated" });
        } catch (err) {
          console.log("[LAYOUT MOUNT] 세션 없음:", err);
          set({ user: null, status: "guest" });
        }
      },

      register: async (email, password, name, withGuestData) => {
        try {
          // 회원가입 요청
          await fetchRegister(email, password, name);
          // 데이터 이전을 원하지 않는 경우
          if (!withGuestData) return false;
          // dbItemService 접근을 위해 로그인
          const loginUser = await useAuthStore.getState().login(email, password);
          if (!loginUser) {
            console.error("로그인 실패");
            return false;
          }
          // 로컬 -> DB 데이터 이전 요청
          const bulkResult = await useItemStore.getState().bulkCreateFromLocalItems();
          console.log("데이터 이전 결과:", bulkResult);
          // 로컬 스토리지 비우기
          const clearResult = await useItemStore.getState().clearLocalItems();
          console.log("로컬 데이터 클리어 결과:", clearResult);
          return true;
        } catch (err) {
          console.error("register 실패:", err);
          return false;
        }
      },
      
      

      login: async (email, password) => {
        try {
          await fetchLogin(email, password); // 세션 생성
          const user = await fetchCurrentUser({ silent: false }); // 유저 정보 요청
          console.log("[LOGIN FLOW] fetchCurrentUser:", user);
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
