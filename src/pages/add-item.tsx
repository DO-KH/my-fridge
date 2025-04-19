import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { categories } from "@/constants/categories";
import { ShoppingCart } from "lucide-react";
import { Helmet } from "react-helmet";
import { useItemStore } from "@/store/useItemStore";

export default function AddItem() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");
  const [receivingDate, setReceivingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState(categories[0]);
  const [hasExpiry, setHasExpiry] = useState(true);

  const { addItem } = useItemStore(); // ✅ Zustand 함수 직접 사용

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newItem = {
        name,
        quantity,
        expiryDate: hasExpiry ? expiryDate : "",
        receivingDate,
        category: category.key,
      };

      await addItem(newItem); // ✅ 서비스 대신 스토어 함수 호출

      toast.success("✅ 물품이 추가되었습니다!", {
        position: "top-center",
        autoClose: 3000,
      });

      resetForm(); // ✅ 입력 초기화
    } catch (error) {
      console.error("❌ 아이템 추가 실패", error);
      toast.error("❌ 아이템 추가에 실패했습니다.");
    }
  };

  const resetForm = () => {
    setName("");
    setQuantity(1);
    setExpiryDate("");
    setReceivingDate(new Date().toISOString().split("T")[0]);
    setCategory(categories[0]);
    setHasExpiry(true);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-700 border border-gray-500 rounded-lg shadow-lg text-gray-200">
      <Helmet>
        <title>식재료 추가 | 내 손의 냉장고</title>
        <meta
          name="description"
          content="새로운 식재료를 냉장고에 추가해보세요. 수량, 유통기한, 카테고리를 쉽게 입력할 수 있습니다."
        />
        <meta property="og:title" content="식재료 추가 | 내 손의 냉장고" />
        <meta
          property="og:description"
          content="냉장고에 식재료를 추가하고 스마트하게 관리해보세요."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <ToastContainer />

      <h1 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
        <ShoppingCart className="w-7 h-7 mr-2" /> 식재료 추가
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 font-medium">상품명</label>
            <input
              type="text"
              placeholder="예: 우유"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 border border-gray-600 p-3 rounded-lg bg-gray-900 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium">카테고리</label>
            <select
              value={category.key}
              onChange={(e) =>
                setCategory(
                  categories.find((cat) => cat.key === e.target.value) || categories[0]
                )
              }
              className="w-full mt-1 border border-gray-600 p-3 rounded-lg bg-gray-900 focus:ring-2 focus:ring-green-400"
            >
              {categories.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 font-medium">수량</label>
          <input
            type="number"
            placeholder="예: 3"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            className="w-full mt-1 border border-gray-600 p-3 rounded-lg bg-gray-900 focus:ring-2 focus:ring-green-400"
          />
        </div>

        <fieldset className="border border-gray-500 rounded-lg p-4">
          <legend className="text-green-400 font-semibold px-2">유통기한</legend>
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="expiryOption"
                checked={hasExpiry}
                onChange={() => setHasExpiry(true)}
                className="mr-2"
              />
              입력하기
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="expiryOption"
                checked={!hasExpiry}
                onChange={() => setHasExpiry(false)}
                className="mr-2"
              />
              해당 없음
            </label>
          </div>

          <div className="mt-3">
            <label className="block text-gray-300 font-medium">유통기한 입력</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required={hasExpiry}
              disabled={!hasExpiry}
              className="w-full mt-1 border border-gray-600 p-3 rounded-lg bg-gray-900 focus:ring-2 focus:ring-green-400 disabled:bg-gray-700"
            />
          </div>
        </fieldset>

        <div>
          <label className="block text-gray-300 font-medium">입고 날짜</label>
          <input
            type="date"
            value={receivingDate}
            onChange={(e) => setReceivingDate(e.target.value)}
            required
            className="w-full mt-1 border border-gray-600 p-3 rounded-lg bg-gray-900 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full md:max-w-sm bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4"
          >
            ✅ 저장
          </button>
        </div>
      </form>
    </div>
  );
}
