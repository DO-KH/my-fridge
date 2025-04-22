import useExpiringItems from "../hooks/useExpiringItems";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useLocation } from 'react-router-dom';
import Notification from "./Notification";
import { useEffect } from "react";
import { useItemStore } from "../store/useItemStore";
import { useAuthStore } from "../store/useAuthStore";
import DataStorageChoice from "./DataStorageChoice";

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { fetchAllItems } = useItemStore();
  const { loadUser, status, hasChosenStorage, user } = useAuthStore();

  // 특정 페이지에서 Sidebar를 숨김
  const hideSidebarRoutes = ["/settings", "/login"];
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);
  useExpiringItems();

  // 최초 상태 체크: checking -> guest(서버가 인식하기를) 
  // 서버 입장에서는 로그인 유저가 아니면 전부 guest로 판단
  useEffect(() => {
    if (status === "checking") {
      loadUser();
    }
  }, [status]);
  
  // 저장 방식을 선택하기 전까진 데이터를 요청하지 않음
  useEffect(() => { 
    if ((status === "guest" && !user) || (status === "authenticated" && user)) {
      fetchAllItems();
    }
  }, [status, user]);

  const isAuthPage = location.pathname === "/auth";

  // 첫 검증으로 인해 이미 상태는 guest
  if (!isAuthPage && status === "guest" && !hasChosenStorage) {
    return <DataStorageChoice />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      {/* 상단 네비게이션 */}
      <Header />
      <Notification />

      {/* ✅ 컨텐츠 영역 (Sidebar 포함) */}
      <div className="flex flex-1 container mx-auto">
        {showSidebar && <Sidebar />}
        <main
          className={`flex-1 p-6 ${
            showSidebar ? "ml-4" : ""
          } bg-gray-800 rounded-lg shadow-lg`}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
