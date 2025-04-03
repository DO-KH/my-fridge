import { itemService } from "./itemService";
import { useLocalItemStore } from "@/store/useLocalItemStore";


export const localItemService: itemService = {
  // 전체 아이템 불러오기
  fetchAll: async () => {
    return useLocalItemStore.getState().items;
  },

  // ✅ 아이템 추가
  add: async (item) => {
    useLocalItemStore.getState().addItem({
      ...item,
      id: Date.now(), // local 환경에선 임시 id 생성 (timestamp 등)
    });
    return useLocalItemStore.getState().items;
  },

  // ✅ 아이템 삭제
  delete: async (id) => {
    useLocalItemStore.getState().deleteItem(id);
    return useLocalItemStore.getState().items;
  },

  // ✅ 수량 업데이트
  updateQuantity: async (id, quantity) => {
    useLocalItemStore.getState().updateItemQuantity(id, quantity);
    return useLocalItemStore.getState().items;
  },
};