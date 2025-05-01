# My-fridge (냉장고 식재료 관리 서비스)

재고 관리를 응용한 실제 냉장고의 식재료의 입출고를 관리할 수 있는 서비스.

---

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js (express)
- **Language**: Typescript
- **Database**: MySQL (via Prisma ORM)
- **Auth**: Express Session + Cookie (Custom Auth)
- **Style**: Tailwind CSS
- **Etc**: Zustand, ESLint, Prettier

## 페이지별 주요 기능
1. 홈 화면('/')
  - 유통기한 지난 식품, 임박한 식품, 최근 입고된 식품 자동 분류 및 시각화
  - 최초 진입 시 toast를 통해 유통기한 임박 알림
2. 식재료 관리 페이지('/itms')
  - 전체 식품 목록 조회, 수량 실시간 조정 가능
  - 식재료 카드 타이틀 hover시 쿠팡 최저가 사이트 이동 링크 발생
  - 삭제 기능
3. 식제료 추가 페이지(/add-item)
  - 식재료 추가 시 Zustand를 통해 상태 자동 동기화
  - 추가 후 toast를 통해 성공/실패 알림
4. 설정 페이지(/setting)
  - toast 알림 활성/비활성 조정 가능

## 알림 기능
1. 사용자 편의를 위해 유통기한 임박 시, 식재료 추가 시 발생
2. 주요 동작
  - 알림 추가(addNotification)
    - 중복 알림은 추가되지 않음
    - 알림은 5초 후 자동으로 사라짐
  - 알림 수동 제거(removeNotification)
    - 닫기 버튼을 통해 즉시 제거 가능
  - 알림 활성/비활성 설정(toggleNotification)
    - 사용자의 설정은 localStorage에 저장되어 새로고침 후에도 유지

## 날짜, 유통기한별 식재료 분류
1. 백엔드에서 유통기한이 0~3일 남은 식재료를 조회해 프론트에 제공하여 데이터를 실시간으로 관리
2. 프론트에서 식재료 데이터를 유통기한별로 분류하여 시각화
   - 최근 추가된 식품(최근 입고날짜별 5개만 보여줌)
   - 유통기한 임박 식품(유통기한까지 0~3일 남은 데이터)
   - 유통기한 지난 식품(유통기한이 오늘 날짜보다 과거인 데이터)

## 식재료 저장소 선택 
1. 저장소 선택을 3가지 모드를 통해 관리
  - checking : 불특정 상태
  - guest : 게스트 모드(로컬스토리지)
  - authenticated : 회원(DB)
2. 서비스 최초 진입시 게스트 및 회원가입 전환 여부
3. 게스트 -> 회원 전환 시 로컬 데이터 이전
  - 회원가입시 원하는 유저는 게스트 모드에서 생성된 식재료 데이터를 DB로 이전할수 있도록 선택 가능
  - 회원 데이터는 MySQL 서버에 저장되며 Railway 호스팅 서버에서 관리 됨(체험용)

## API 엔드포인트
1. item
  - | 모든 아이템 조회 | `GET /api/items?username=...` | 사용자별 전체 식재료 목록 반환 |
  - | 아이템 추가 | `POST /api/items` | 이름, 수량, 카테고리 등 입력 후 DB에 저장 |
  - | 아이템 삭제 | `DELETE /api/items/:id` | ID 기반 삭제 |
  - | 수량 변경 | `PATCH /api/items/:id` | 수량만 선택적으로 수정 |
  - | 유통기한 임박 조회 | `GET /api/items/expiring-soon` | 3일 이내 만료될 항목 필터링 |
  - | 데이터 이전 | `POST api/items/bulk` | 게스트 유저 회원 가입 시 로컬 데이터 DB에 저장 |
2. auth
  - | 회원가입 | `POST /api/auth/register ` | 회원 정보 저장 |
  - | 로그인 | `GET /api/auth/login` | 회원 확인 및 세션 발급 |
  - | 검증 | `GET /api/auth/user` | 세션 검증 |
  - | 로그아웃 | `GET /api/auth/logout` | 쿠키 삭제 |




