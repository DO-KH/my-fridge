import { useEffect, useRef } from "react";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useItemStore } from "@/store/useItemStore";

export default function useExpiringItems() {
  const { addNotification, isNotificationEnabled } = useNotificationStore();
  const { user } = useAuthStore();
  const { items } = useItemStore();
  const prevNotificationsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!isNotificationEnabled) return;

    async function checkExpiringItems() {
      let expiringItems = [];

      if (user) {
        // ✅ 로그인 상태 - 서버에서 요청
        try {
          const API_URL = import.meta.env.VITE_API_URL;
          const response = await fetch(`${API_URL}/api/items/expiring-soon`, {
            credentials: "include",
          });
          if (!response.ok) throw new Error("서버 요청 실패");
          expiringItems = await response.json();
        } catch (err) {
          console.error("유통기한 알림 실패 (서버)", err);
          return;
        }
      } else {
        // 비로그인 상태 - 로컬 상태에서 유통기한 계산
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);

        expiringItems = items.filter((item) => {
          if (!item.expiryDate) return false;
          const expiry = new Date(item.expiryDate);
          return expiry >= today && expiry <= threeDaysLater;
        });
      }

      expiringItems.forEach((item: { name: string; expiryDate: string }) => {
        const message = `🚨 ${item.name}의 유통기한이 ${item.expiryDate}까지입니다!`;

        if (!prevNotificationsRef.current.has(message)) {
          prevNotificationsRef.current.add(message);
          addNotification(message);
        }
      });
    }

    checkExpiringItems();
    const interval = setInterval(checkExpiringItems, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [addNotification, isNotificationEnabled, user, items]);
}
