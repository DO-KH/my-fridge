import { Item } from "@/types/item";

export interface itemService {
  fetchAll(): Promise<Item[]>;
  add(item: Omit<Item, "id">): Promise<Item[]>;
  delete(id: number): Promise<Item[]>;
  updateQuantity(id: number, quantity: number): Promise<Item[]>;

  // SSR 초기 상태 주입용(선택적 메서드로도 가능)
  hydrate?:(items: Item[]) => void;
}

export { dbItemService } from "./dbItemService";
export { localItemService } from "./localItemService";