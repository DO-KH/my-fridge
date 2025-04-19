import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRegister } from "@/api/auth/fetch-register";
import { Lock, User, Mail } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(""); // 초기에는 빈 문자열
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // CSR 전용: localStorage에서 이메일을 가져옴
  useEffect(() => {
    const saved = localStorage.getItem("savedEmail");
    if (saved) setEmail(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await fetchRegister(email, password, name);
        alert("회원가입 성공! 로그인 해주세요.");
        setIsLogin(true);
        return;
      }

      // 로그인 시 localStorage에 이메일 저장
      if (rememberMe) localStorage.setItem("savedEmail", email);
      else localStorage.removeItem("savedEmail");

      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`오류 발생: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-md p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
          {isLogin ? "로그인" : "회원가입"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 pl-10 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-green-400"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 pl-10 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 pl-10 border border-gray-600 rounded-lg bg-gray-900 text-gray-200 focus:ring-2 focus:ring-green-400"
            />
          </div>

          {isLogin && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label className="text-gray-300">
                아이디 저장 및 자동 로그인
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
          >
            {isLogin ? "로그인" : "회원가입"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
          <button
            className="text-green-400 ml-2 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "회원가입" : "로그인"}
          </button>
        </p>
      </div>
    </div>
  );
}
