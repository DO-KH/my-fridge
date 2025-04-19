import { itemService } from "./itemService"; // 인터페이스
import { dbItemService } from "./dbItemService"; // 구현체 1
import { localItemService } from "./localItemService"; // 구현체 2

// 현재 사용 중인 전략 (초기값: db)
let current: itemService

if (import.meta.env.DEV) {
  current = localItemService;
  console.info("🛠 [itemService] 개발 모드 - localItemService 적용");
} else {
  current = dbItemService;
  console.info("🚀 [itemService] 운영 모드 - dbItemService 적용");
}

// 외부에서 전략을 주입할 수 있게 함
export const setItemService = (impl: itemService) => {
  current = impl;
};

// 현재 전략을 반환함 (스토어나 컴포넌트에서 사용)
export const getItemService = (): itemService => current;

