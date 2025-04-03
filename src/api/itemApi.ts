import { Item } from "@/types/item";

const API_URL = "http://localhost:5000/api/items";

export const fetchItems = async (username: string): Promise<Item[]> => {
  const res = await fetch(`${API_URL}?username=${encodeURIComponent(username)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
  return res.json();
};

// ✅ 새로운 아이템 추가
export const addItem = async (username: string, item: Omit<Item, "id">): Promise<Item> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      name: item.name,
      quantity: item.quantity,
      expiryDate: item.expiryDate,
      receivingDate: item.receivingDate,
      category: item.category,
    }),
  });

  if (!res.ok) throw new Error("아이템 추가 실패");
  return res.json();
};

// ✅ 아이템 삭제
export const deleteItem = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("아이템 삭제 실패");
};

export const updateItemQuantity = async (id: number, newQuantity: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: newQuantity }),
  });

  if (!res.ok) throw new Error("수량 업데이트 실패");
};