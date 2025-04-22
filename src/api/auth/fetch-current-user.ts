export async function fetchCurrentUser({silent = false}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/auth/user`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error(`Unauthorized: ${res.status}`);
    if (!silent) console.error("❌ 인증 실패:", error);
    throw error;
  }

  return await res.json(); // { id, name, email }
}