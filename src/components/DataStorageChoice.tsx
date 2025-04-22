import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Snowflake, LogIn, User } from "lucide-react";

export default function DataStorageChoice() {
  const navigate = useNavigate();
  const { logout, setHasChosenStorage } = useAuthStore();

  const handleGuestMode = () => {
    logout(); // guest 상태로 전환
    setHasChosenStorage(true);
  };

  const handleLogin = () => {
    setHasChosenStorage(true);
    navigate("/auth");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-4 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6">
        <Snowflake className="mx-auto w-10 h-10 text-blue-300" />

        <h1 className="text-2xl font-bold text-gray-100">
          냉장고 데이터를 어디에 보관할까요?
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed">
          <span className="block">게스트 모드는 브라우저에만 저장돼요.</span>
          <span className="block">언제 어디서나 데이터를 불러오려면 로그인하세요.</span>
        </p>

        <div className="space-y-3 pt-4">
          <button
            onClick={handleGuestMode}
            className="w-full px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            게스트로 계속하기
          </button>

          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white font-semibold transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            로그인 또는 회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
