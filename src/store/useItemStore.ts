import { create } from "zustand";
import { Item } from "@/types/item";
import { getItemService } from "@/services/itemServiceSelector";
import { localItemService } from "@/services/localItemService";
import { dbItemService } from "@/services/dbItemService";

const pendingIds = new Set<number>();

interface ItemStore {
  items: Item[];
  fetchAllItems: () => Promise<void>;
  addItem: (item: Omit<Item, "id">) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  updateItemQuantity: (id: number, newQuantity: number) => Promise<void>;
  bulkCreateFromLocalItems: () => Promise<void>;
  clearLocalItems: () => Promise<void>
}

export const useItemStore = create<ItemStore>((set) => ({
  items: [],

  fetchAllItems: async () => {
    try {
      const data = await getItemService().fetchAll();
      set({ items: data });
    } catch (error) {
      console.error("아이템 불러오기 실패", error);
    }
  },

  addItem: async (item) => {
    const optimisticItem = {
      ...item,
      id: Date.now(), // 임시 ID
    };

    set((state) => ({ items: [...state.items, optimisticItem] }));

    try {
      const updatedItems = await getItemService().add(item);
      set({ items: updatedItems });
    } catch (error) {
      set((state) => ({
        items: state.items.filter((i) => i.id !== optimisticItem.id),
      }));
      console.error(" 아이템 추가 실패", error);
    }
  },

  deleteItem: async (id) => {
    const previousItems = useItemStore.getState().items;

    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    try {
      const updatedItems = await getItemService().delete(id);
      set({ items: updatedItems });
    } catch (error) {
      console.error("❌ 아이템 삭제 실패", error);
      set({ items: previousItems });
    }
  },

  updateItemQuantity: async (id, newQuantity) => {
    if (pendingIds.has(id)) {
      console.warn(`🚧 수량 업데이트 중: ID ${id} 요청 무시됨`);
      return;
    }

    pendingIds.add(id);

    const previousItems = useItemStore.getState().items;

    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ),
    }));

    try {
      const updatedItems = await getItemService().updateQuantity(id, newQuantity);
      set({ items: updatedItems });
    } catch (error) {
      console.error("❌ 수량 업데이트 실패", error);
      set({ items: previousItems });
    } finally {
      pendingIds.delete(id);
    }
  },

  bulkCreateFromLocalItems: async () => {
    console.log("🚀 bulkCreateFromLocalItems 시작");
    const guestItems = await localItemService.fetchAll();
    console.log("🛒 게스트 아이템:", guestItems);

    if (guestItems.length > 0 && dbItemService.bulkCreate) {
      await dbItemService.bulkCreate(
        guestItems.map(({ id, ...rest }) => {
          void id;
          return rest;
        })
      );
    }
    console.log("✅ bulkCreateFromLocalItems 완료");
  },

  clearLocalItems: async () => {
    console.log("🧹 clearLocalItems() 실행");
    if (localItemService.clear) {
      await localItemService.clear();
      console.log("✅ localStorage.clear() 완료");
    }
    useItemStore.setState({ items: [] });
    console.log("✅ clearLocalItems 완료");
  },
}));
