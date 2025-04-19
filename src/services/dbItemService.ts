import { itemService } from "./itemService";
import { Item } from "@/types/item";
import {
  fetchItems,
  addItem as apiAddItem,
  deleteItem as apiDeleteItem,
  updateItemQuantity as apiUpdateQuantity,
} from "@/api/itemApi";
import { useAuthStore } from "@/store/useAuthStore";

export const dbItemService: itemService = {
  // 전체 아이템 불러오기
  fetchAll: async (): Promise<Item[]> => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error("사용자 정보 없음");
    return await fetchItems(user.name);
  },

  // 아이템 추가
  add: async (item): Promise<Item[]> => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error("사용자 정보 없음");

    await apiAddItem(user.name, item);
    return await fetchItems(user.name); // 추가 후 전체 아이템 갱신
  },

  // 아이템 삭제
  delete: async (id): Promise<Item[]> => {
    await apiDeleteItem(id);
    const user = useAuthStore.getState().user;
    if (!user) throw new Error("사용자 정보 없음");
    return await fetchItems(user.name); // 삭제 후 전체 아이템 갱신
  },

  // 수량 업데이트
  updateQuantity: async (id, quantity): Promise<Item[]> => {
    await apiUpdateQuantity(id, quantity);
    const user = useAuthStore.getState().user;
    if (!user) throw new Error("사용자 정보 없음");
    return await fetchItems(user.name); // 수정 후 전체 아이템 갱신
  },
};
