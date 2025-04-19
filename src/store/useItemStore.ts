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

// Zustand 스토어 생성
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

  addItem: async (item) => {
    const user = useAuthStore.getState().user;
  
    if (!user) {
      console.error("🚨 유저 정보가 없거나 이름이 없습니다. 아이템 추가 불가.");
      return;
    }
  
    // 1. 낙관적으로 먼저 UI에 표시 (가짜 id 부여)
    const optimisticItem = {
      ...item,
      id: Date.now(), // 임시 ID (실제로는 서버에서 정해짐)
    };
  
    // 2. UI에 먼저 반영
    set((state) => ({ items: [...state.items, optimisticItem] }));
  
    try {
      // 3. 서버에 실제 요청
      const newItem = await addItem(user.name, item);
  
      // 4. 서버 응답 받은 실제 아이템으로 교체
      set((state) => ({
        items: state.items.map((i) =>
          i.id === optimisticItem.id ? newItem : i
        ),
      }));
    } catch (error) {
      // 5. 실패 시 낙관적으로 추가한 항목 제거 (롤백)
      set((state) => ({
        items: state.items.filter((i) => i.id !== optimisticItem.id),
      }));
      console.error("❌ 아이템 추가 실패", error);
    }
  },

  // 아이템 삭제 (서버 연동)
  deleteItem: async (id) => {
    // 1. 기존 상태 저장 (실패 시 롤백용)
    const previousItems = useItemStore.getState().items;
  
    // 2. 먼저 UI에서 제거
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  
    try {
      // 3. 서버에 삭제 요청
      await deleteItem(id);
    } catch (error) {
      // 4. 실패하면 롤백
      console.error("❌ 아이템 삭제 실패", error);
      set({ items: previousItems });
    }
  },
  
  updateItemQuantity: async (id, newQuantity) => {
    // 1. 이전 상태 저장 (롤백용)
    const previousItems = useItemStore.getState().items;
  
    // 2. 먼저 상태를 UI에 반영
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ),
    }));
  
    try {
      // 3. 서버에 업데이트 요청
      await updateItemQuantity(id, newQuantity);
    } catch (error) {
      // 4. 실패 시 롤백
      console.error("❌ 수량 업데이트 실패", error);
      set({ items: previousItems });
    }
  },
  
}));
