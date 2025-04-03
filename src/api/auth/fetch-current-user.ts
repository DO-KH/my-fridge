export async function fetchCurrentUser() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/user", {
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