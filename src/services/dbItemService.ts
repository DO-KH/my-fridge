import { useItemStore } from "@/store/useItemStore";
import { itemService } from "./itemService";

export const dbItemService: itemService = {
  // DB에서 전체 아이템 불러오기
  fetchAll: async () => {
    await useItemStore.getState().fetchAllItems();
    return useItemStore.getState().items;
  },

  // DB에 아이템 추가
  add: async (item) => {
    await useItemStore.getState().addItem(item);
    return useItemStore.getState().items;
  },

  // DB에서 아이템 삭제
  delete: async (id) => {
    await useItemStore.getState().deleteItem(id);
    return useItemStore.getState().items;
  },

  // 수량 업데이트
  updateQuantity: async (id, quantity) => {
    await useItemStore.getState().updateItemQuantity(id, quantity);
    return useItemStore.getState().items;
  },

};
