import { create } from "zustand";
import { fetchItems, addItem, deleteItem, updateItemQuantity } from "../api/itemApi";
import { useAuthStore } from "./useAuthStore";
import { Item } from "@/types/item";

interface ItemStore {
  items: Item[];
  fetchAllItems: () => Promise<void>;
  addItem: (item: Omit<Item, "id">) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  updateItemQuantity: (id: number, newQuantity: number) => Promise<void>;
}

// ✅ Zustand 스토어 생성
export const useItemStore = create<ItemStore>((set) => ({
  items: [], // 초기값 빈 배열

  // ✅ 모든 아이템 가져오기
  fetchAllItems: async () => {
    const user = useAuthStore.getState().user;
    console.log(user)
    if (!user) return;
    try {
      const data = await fetchItems(user.name);
      set({ items: data });
    } catch (error) {
      console.error("아이템을 불러오는데 실패했습니다.", error);
    }
  },

  // ✅ 아이템 추가 (서버 연동)
  addItem: async (item) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      console.error("🚨 유저 정보가 없거나 이름이 없습니다. 아이템 추가 불가.");
      return;
    }
    try {
      const newItem = await addItem(user.name, item);
      set((state) => ({ items: [...state.items, newItem] }));
    } catch (error) {
      console.error("아이템 추가 실패", error);
    }
  },

  // ✅ 아이템 삭제 (서버 연동)
  deleteItem: async (id) => {
    try {
      await deleteItem(id);
      set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    } catch (error) {
      console.error("아이템 삭제 실패", error);
    }
  },
  updateItemQuantity: async (id, newQuantity) => {
    try {
      await updateItemQuantity(id, newQuantity);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ),
      }));
    } catch (error) {
      console.error("수량 업데이트 실패", error);
    }
  },
}));
