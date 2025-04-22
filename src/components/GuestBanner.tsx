import { useState } from "react";

export default function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-2 bg-yellow-900/30 text-yellow-300 text-sm shadow-md backdrop-blur-md border-b border-yellow-800">
      <span className="flex-1 text-center">
        현재 <strong>게스트 모드</strong>로 데이터를 로컬스토리지에 저장하고 있습니다.
        서버에 저장하려면 <strong>로그인</strong> 해주세요.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-4 text-yellow-400 hover:text-yellow-200 text-xs"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}