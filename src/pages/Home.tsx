import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Clock,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { dbItemService as itemService } from "@/services/itemService";
import { Item } from "@/types/item";

// 전역으로 전달된 SSR 데이터가 있다면 접근
declare global {
  interface Window {
    __INITIAL_ITEMS__?: Item[];
  }
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [expiringSoon, setExpiringSoon] = useState(items);
  const [recentlyAdded, setRecentlyAdded] = useState(items);
  const [expiredItems, setExpiredItems] = useState(items);

  useEffect(() => {
    console.log("✅ CSR Hydration 시작", window.__INITIAL_ITEMS__);

    const ssrItems = window.__INITIAL_ITEMS__;

    if (ssrItems) {
      // 서비스에서 하이드레이션 처리
      itemService.hydrate?.(ssrItems);
      setItems(ssrItems);
    } else {
      // CSR 시점 fetch
      itemService.fetchAll().then(setItems);
    }
  }, []);

  useEffect(() => {
    const today = new Date();

    const soonExpiring = items.filter((item) => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      const daysLeft =
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return daysLeft > 0 && daysLeft <= 3;
    });

    const alreadyExpired = items.filter((item) => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return expiryDate.getTime() < today.getTime();
    });

    const recentItems = [...items]
      .sort(
        (a, b) =>
          new Date(b.receivingDate).getTime() -
          new Date(a.receivingDate).getTime()
      )
      .slice(0, 5);

    setExpiringSoon(soonExpiring);
    setExpiredItems(alreadyExpired);
    setRecentlyAdded(recentItems);
  }, [items]);

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-200 min-h-screen">
      <Helmet>
        <title>내 손의 냉장고 - 현황</title>
        <meta
          name="description"
          content="유통기한이 임박한 식품과 최근 추가된 식품을 한눈에 확인하세요."
        />
        <meta property="og:title" content="내 손의 냉장고 - 현황" />
        <meta
          property="og:description"
          content="냉장고 속 식품의 유통기한과 최근 입고 현황을 확인해보세요."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://yourdomain.com/og-image.png"
        />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <h1 className="text-3xl font-bold text-green-400 flex items-center">
        <ClipboardList className="w-7 h-7 mr-2" /> 냉장고 현황
      </h1>

      {expiredItems.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center text-red-400">
            <XCircle className="w-5 h-5 mr-2" /> 유통기한 지난 식품
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredItems.map((item) => {
              const expiryDate = new Date(item.expiryDate ?? "");
              const today = new Date();
              const daysOverdue = Math.floor(
                (today.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={item.id}
                  className="p-4 bg-gray-800 border border-red-500 rounded-lg shadow-md"
                >
                  <h3 className="font-bold text-red-300">{item.name}</h3>
                  <p className="text-gray-400">수량: {item.quantity}개</p>
                  <p className="text-red-400 font-semibold">
                    ❌ 유통기한 {daysOverdue}일 지남
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2 flex items-center text-yellow-400">
          <AlertTriangle className="w-5 h-5 mr-2" /> 유통기한 임박
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expiringSoon.length > 0 ? (
            expiringSoon.map((item) => {
              const expiryDate = new Date(item.expiryDate ?? "");
              const today = new Date();
              const daysLeft = Math.floor(
                (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={item.id}
                  className="p-4 bg-gray-800 border border-yellow-500 rounded-lg shadow-md"
                >
                  <h3 className="font-bold text-yellow-300">{item.name}</h3>
                  <p className="text-gray-400">수량: {item.quantity}개</p>
                  <p className="font-semibold text-yellow-400">
                    ⏳ 유통기한: {expiryDate.toLocaleDateString()} ({daysLeft}일
                    남음)
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">
              ⚡ 유통기한이 임박한 식품이 없습니다.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2 flex items-center text-blue-400">
          <Clock className="w-5 h-5 mr-2" /> 최근 추가된 식품
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyAdded.length > 0 ? (
            recentlyAdded.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-md"
              >
                <h3 className="font-bold text-blue-300">{item.name}</h3>
                <p className="text-gray-400">수량: {item.quantity}개</p>
                <p className="text-blue-400 flex items-center">
                  <PackageCheck className="w-5 h-5 mr-2" /> 입고 날짜:{" "}
                  {new Date(item.receivingDate).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">최근 추가된 식품이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
