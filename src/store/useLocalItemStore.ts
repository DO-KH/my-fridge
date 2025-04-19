import { Item } from "@/types/item";
import { create } from "zustand";

interface LocalItemStore {
  items: Item[];
  addItem: (item: Item) => void;
  deleteItem: (id: number) => void;
  updateItemQuantity: (id: number, newQuantity: number) => void;
}

export const useLocalItemStore = create<LocalItemStore>((set) => ({
  items: JSON.parse(localStorage.getItem("items") || "[]"),

  addItem: (item) => {
    set((state) => {
      const updated = [...state.items, item];
      localStorage.setItem("items", JSON.stringify(updated));
      return { items: updated };
    });
  },

  deleteItem: (id) => {
    set((state) => {
      const updated = state.items.filter((item) => item.id !== id);
      localStorage.setItem("items", JSON.stringify(updated));
      return { items: updated };
    });
  },

  updateItemQuantity: (id, newQuantity) => {
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("items", JSON.stringify(updated));
      return { items: updated };
    });
  },
}));
