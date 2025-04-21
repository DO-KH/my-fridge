import { itemService } from "./itemService";
import { dbItemService } from "./dbItemService";
import { localItemService } from "./localItemService";
import { useAuthStore } from "@/store/useAuthStore";

// 전략 주입은 삭제 (사용 안 함)
// export const setItemService = (_impl: itemService) => {
//   console.warn("setItemService는 현재 사용되지 않음");
// };

// 로그인 여부에 따라 전략 동적 반환
export const getItemService = (): itemService => {
  const { user, isLoading } = useAuthStore.getState();

  // 유저 로딩 전이면 일단 local 사용
  if (isLoading) {
    console.info("📦 유저 로딩 중 - localItemService 사용");
    return localItemService;
  }

  if (user) {
    console.info("✅ 로그인 상태 - dbItemService 사용");
    return dbItemService;
  }

  console.info("🚫 비로그인 상태 - localItemService 사용");
  return localItemService;
};