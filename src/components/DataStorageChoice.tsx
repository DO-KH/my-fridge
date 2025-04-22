import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-xl mb-4">냉장고 데이터를 어디에 보관할까요?</h1>
      <button className="mb-2 px-4 py-2 bg-gray-700 rounded" onClick={handleGuestMode}>
        👉 게스트로 계속하기
      </button>
      <button className="px-4 py-2 bg-green-600 rounded" onClick={handleLogin}>
        🔐 로그인 또는 회원가입
      </button>
    </div>
  );
}