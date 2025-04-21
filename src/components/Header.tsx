import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function Header() {
  const { user, logout, isLoading } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-900 text-gray-200 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* 로고 */}
        <Link to="/" className="text-2xl font-bold text-green-500 hover:text-green-400 transition">
          내 손의 냉장고
        </Link>

        {/* 우측 메뉴 */}
        <div className="space-x-6 flex items-center relative">
          <Link to="/settings" className="hover:text-green-400 transition">
            설정
          </Link>

          {isLoading ? (
            <div className="text-sm text-gray-400">로딩 중...</div>
          ) :
          user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
              >
                {user.name}
                <span className="ml-2 text-sm">▼</span>
              </button>

              {/* 드롭다운 메뉴 */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-700 text-white p-2 rounded-md shadow-lg transition-all duration-200">
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600 rounded"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
