import { create } from "zustand";

const getInitialNotificationSetting = () => {
  const savedSetting = localStorage.getItem("isNotificationEnabled");
  return savedSetting ? JSON.parse(savedSetting) : true;
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

  // 알림 발생
  addNotification: (message) => {
    set((state) => {
      if (state.notifications.includes(message)) return state;
      return { notifications: [...state.notifications, message] };
    });

    // 5초 뒤 사라짐
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n !== message),
      }));
    }, 5000);
  },

  // 버튼으로 끄기
  removeNotification: (message) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n !== message),
    }));
  },

  // 알림 기능 활성/비활성
  toggleNotification: () => {
    set((state) => {
      const newSetting = !state.isNotificationEnabled;
      localStorage.setItem("isNotificationEnabled", JSON.stringify(newSetting));
      return { isNotificationEnabled: newSetting };
    });
  },
}));
