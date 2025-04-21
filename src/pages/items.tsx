import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  PlusCircle,
  MinusCircle,
  Clock,
  PackageCheck,
  Boxes,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useItemStore } from "@/store/useItemStore";

export default function Items() {
  const { items, deleteItem, updateItemQuantity } = useItemStore();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    await deleteItem(id);
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    await updateItemQuantity(id, newQuantity);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-200 min-h-screen">
      <Helmet>
        <title>식재료 관리 | 내 손의 냉장고</title>
        <meta name="description" content="보관 중인 식재료의 수량을 확인하고 유통기한을 관리하세요." />
        <meta property="og:title" content="식재료 관리 | 내 손의 냉장고" />
        <meta property="og:description" content="보관 중인 식재료의 수량을 확인하고 유통기한을 관리하세요." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-400 flex items-center">
          <Boxes className="w-7 h-7 mr-2" /> 식재료 관리
        </h1>
        <Link
          to="/add-item"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> 추가
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => {
            const receivingDate = new Date(item.receivingDate);
            const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;
            const today = new Date();
            const daysLeft = expiryDate
              ? Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div
                key={item.id}
                className="relative bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md"
              >
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md"
                  aria-label="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <h2
                  className="text-lg font-bold text-green-300 relative cursor-pointer w-[200px]"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.name}

                  {hoveredItem === item.id && (
                    <div className="absolute bottom-[100%] mt-1 w-40 bg-gray-700 text-white p-2 rounded-lg shadow-lg text-sm">
                      <a
                        href={`https://www.coupang.com/np/search?q=${encodeURIComponent(item.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center hover:text-yellow-400"
                      >
                        쿠팡 최저가 보러가기
                      </a>
                    </div>
                  )}
                </h2>

                <div className="flex items-center mt-3">
                  <p className="text-gray-300 font-semibold text-base mr-3">
                    수량: {item.quantity}개
                  </p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 flex items-center mt-2">
                  <PackageCheck className="w-4 h-4 mr-1" /> 입고 날짜: {receivingDate.toLocaleDateString()}
                </p>

                <p
                  className={`text-sm font-semibold flex items-center mt-1 ${
                    daysLeft !== null && daysLeft <= 3 ? "text-red-400" : "text-gray-300"
                  }`}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  {expiryDate
                    ? daysLeft !== null
                      ? daysLeft < 0
                        ? `유통기한 ${Math.abs(daysLeft)}일 지남 (${expiryDate.toLocaleDateString()})`
                        : `${expiryDate.toLocaleDateString()} (${daysLeft}일 남음)`
                      : "유통기한 정보 없음"
                    : "해당 없음"}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center col-span-3">❌ 저장된 식품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
