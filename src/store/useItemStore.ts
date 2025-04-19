import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { Item } from "@/types/item";
import { getItemService } from "@/services/itemServiceSelector"; // ✅ 서비스 접근

interface ItemStore {
  items: Item[];
  fetchAllItems: () => Promise<void>;
  addItem: (item: Omit<Item, "id">) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  updateItemQuantity: (id: number, newQuantity: number) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set) => ({
  items: [],

  fetchAllItems: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const data = await getItemService().fetchAll(); // 🔁 전략 서비스 호출
      set({ items: data });
    } catch (error) {
      console.error("❌ 아이템 불러오기 실패", error);
    }
  },

  addItem: async (item) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      console.error("🚨 유저 정보 없음. 아이템 추가 불가.");
      return;
    }

    const optimisticItem = {
      ...item,
      id: Date.now(), // 임시 ID
    };

    set((state) => ({ items: [...state.items, optimisticItem] }));

    try {
      const updatedItems = await getItemService().add(item); // 🔁 서비스 사용
      set({ items: updatedItems });
    } catch (error) {
      set((state) => ({
        items: state.items.filter((i) => i.id !== optimisticItem.id),
      }));
      console.error("❌ 아이템 추가 실패", error);
    }
  },

  deleteItem: async (id) => {
    const previousItems = useItemStore.getState().items;

    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    try {
      const updatedItems = await getItemService().delete(id); // 🔁 서비스 사용
      set({ items: updatedItems });
    } catch (error) {
      console.error("❌ 아이템 삭제 실패", error);
      set({ items: previousItems });
    }
  },

  updateItemQuantity: async (id, newQuantity) => {
    const previousItems = useItemStore.getState().items;

    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ),
    }));

    try {
      const updatedItems = await getItemService().updateQuantity(id, newQuantity); // 🔁 서비스 사용
      set({ items: updatedItems });
    } catch (error) {
      console.error("❌ 수량 업데이트 실패", error);
      set({ items: previousItems });
    }
  },
}));
