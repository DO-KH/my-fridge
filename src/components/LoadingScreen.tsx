import React from "react";

export default function LoadingScreen() {
  return (
    <div className="w-full h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="text-6xl text-gray-300">🧊</div>
        <h1 className="text-2xl font-bold text-gray-200 animate-pulse">
          냉장고를 여는 중이에요...
        </h1>
        <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}