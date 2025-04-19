export async function fetchRegister(email: string, password: string, name: string) {
  const API_URL = import.meta.env.VITE_API_URL
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return { success: true, email };
  } catch (error: unknown) {
    console.error("❌ 회원가입 실패:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
  }
}