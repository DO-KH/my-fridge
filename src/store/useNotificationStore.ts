import { create } from "zustand";

// ✅ 로컬에서 설정 가져오기 (SSR-safe)
const getInitialNotificationSetting = () => {
  if (typeof window !== "undefined") {
    const savedSetting = localStorage.getItem("isNotificationEnabled");
    return savedSetting ? JSON.parse(savedSetting) : true;
  }
  return true; // SSR 시에는 기본값 true로 설정
};

interface NotificationStore {
  notifications: string[];
  addNotification: (message: string) => void;
  removeNotification: (message: string) => void;
  isNotificationEnabled: boolean;
  toggleNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  isNotificationEnabled: getInitialNotificationSetting(),

  addNotification: (message) => {
    set((state) => {
      if (state.notifications.includes(message)) return state;
      return { notifications: [...state.notifications, message] };
    });

    // ✅ CSR에서만 setTimeout 실행
    if (typeof window !== "undefined") {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n !== message),
        }));
      }, 5000);
    }
  },

  removeNotification: (message) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n !== message),
    }));
  },

  toggleNotification: () => {
    set((state) => {
      const newSetting = !state.isNotificationEnabled;

      // ✅ CSR에서만 localStorage 반영
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "isNotificationEnabled",
          JSON.stringify(newSetting)
        );
      }

      return { isNotificationEnabled: newSetting };
    });
  },
}));
