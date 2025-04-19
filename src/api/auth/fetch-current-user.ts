export async function fetchCurrentUser() {
  const API_URL = import.meta.env.VITE_API_URL
  try {
    const res = await fetch(`${API_URL}/api/auth/user`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    return await res.json(); // { id, name, email }
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    return null;
  }
}