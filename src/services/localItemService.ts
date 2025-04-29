import { itemService } from "./itemService";
import { Item } from "@/types/item";

const getItemsFromLocal = (): Item[] => {
  return JSON.parse(localStorage.getItem("items") || "[]");
};

const saveItemsToLocal = (items: Item[]) => {
  localStorage.setItem("items", JSON.stringify(items));
};

export const localItemService: itemService & { clear?: () => Promise<void> } = {
  fetchAll: async () => {
    return getItemsFromLocal();
  },

  add: async (item) => {
    const items = getItemsFromLocal();
    const newItem: Item = { ...item, id: Date.now() };
    const updated = [...items, newItem];
    saveItemsToLocal(updated);
    return updated;
  },

  delete: async (id) => {
    const items = getItemsFromLocal();
    const updated = items.filter((item) => item.id !== id);
    saveItemsToLocal(updated);
    return updated;
  },

  updateQuantity: async (id, quantity) => {
    const items = getItemsFromLocal();
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    saveItemsToLocal(updated);
    return updated;
  },

  clear: async () => {
    console.log("🧹 localItemService.clear() 호출");
    localStorage.removeItem("items");
  },
};
