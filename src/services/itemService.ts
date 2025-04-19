import { Item } from "@/types/item";

export interface itemService {
  fetchAll(): Promise<Item[]>;
  add(item: Omit<Item, "id">): Promise<Item[]>;
  delete(id: number): Promise<Item[]>;
  updateQuantity(id: number, quantity: number): Promise<Item[]>;

}

