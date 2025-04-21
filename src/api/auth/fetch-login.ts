export async function fetchLogin(email: string, password: string) {
  const API_URL = import.meta.env.VITE_API_URL
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password}),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json()
    console.log(data)

    return data;
  } catch (error: unknown) {
    console.error("❌ 로그인 실패:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
  }
}