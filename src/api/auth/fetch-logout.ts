export async function fetchLogout() {
  const API_URL = import.meta.env.VITE_API_URL
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("❌ 로그아웃 실패:", error);
  }
}
