import { Item } from "@/types/item";
import { create } from "zustand";

interface LocalItemStore {
  items: Item[];
  addItem: (item: Item) => void;
  deleteItem: (id: number) => void;
  updateItemQuantity: (id: number, newQuantity: number) => void;
}

export const useLocalItemStore = create<LocalItemStore>((set) => {
  // ✅ SSR-safe 초기값 처리
  const initialItems: Item[] =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("items") || "[]")
      : [];

  return {
    items: initialItems,

    // ✅ 아이템 추가
    addItem: (item) => {
      set((state) => {
        const updated = [...state.items, item];
        if (typeof window !== "undefined") {
          localStorage.setItem("items", JSON.stringify(updated));
        }
        return { items: updated };
      });
    },

    // ✅ 아이템 삭제
    deleteItem: (id) => {
      set((state) => {
        const updated = state.items.filter((item) => item.id !== id);
        if (typeof window !== "undefined") {
          localStorage.setItem("items", JSON.stringify(updated));
        }
        return { items: updated };
      });
    },

    // ✅ 수량 업데이트
    updateItemQuantity: (id, newQuantity) => {
      set((state) => {
        const updated = state.items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        if (typeof window !== "undefined") {
          localStorage.setItem("items", JSON.stringify(updated));
        }
        return { items: updated };
      });
    },
  };
});
