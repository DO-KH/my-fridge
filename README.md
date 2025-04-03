# My-fridge (냉장고 식재료 관리 서비스)

재고 관리를 응용하여 실제 냉장고의 식재료의 입출고를 관리할 수 있는 서비스 입니다.

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
  - 쿠팡 최저가 검색 링크(hover 시 팝업)
  - 삭제 기능
3. 식제료 추가 페이지(/add-item)
  - 식재료 추가 시 Zustand를 통해 상태 자동 동기화
  - 추가 후 toast를 통해 성공/실패 알림
4. 설정 페이지(/setting)
  - toast 알림 활성/비활성 조정 가능

## 알림 기능
- 사용자 편의를 위해 유통기한 임박 시, 식재료 추가 시 발생
- 주요 동작
  - 알림 추가(addNotification)
    - 중복 알림은 추가되지 않음
    - 알림은 5초 후 자동으로 사라짐
  - 알림 수동 제거(removeNotification)
    - 닫기 버튼을 통해 즉시 제거 가능
  - 알림 활성/비활성 설정(toggleNotification)
    - 사용자의 설정은 localStorage에 저장되어 새로고침 후에도 유지
  
## 식재료 데이터 처리 전략
식재료 데이터는 사용자별로 분리되어 관리되며,
프론트엔드에서는 전역 상태를 기반으로 UI와 연동되고,
백엔드에서는 MySQL + Prisma ORM을 통해 영속적으로 관리 됩니다.

---

### Frontend
- Zustand로 식재료 목록을 전역으로 관리
- 사용자 로그인 상태와 연동하여 유저별 데이터를 요청함
- 아이템 추가/삭제/수정 시 상태를 직접 갱신하여 즉각적으로 UI가 반영됨
- 유통기한 기준 정렬/필터링 관리

### Backend
- | 모든 아이템 조회 | `GET /api/items?username=...` | 사용자별 전체 식재료 목록 반환 |
- | 아이템 추가 | `POST /api/items` | 이름, 수량, 카테고리 등 입력 후 DB에 저장 |
- | 아이템 삭제 | `DELETE /api/items/:id` | ID 기반 삭제 |
- | 수량 변경 | `PATCH /api/items/:id` | 수량만 선택적으로 수정 |
- | 유통기한 임박 조회 | `GET /api/items/expiring-soon` | 3일 이내 만료될 항목 필터링 |

## 인증 방식 구현 전략

### FrontEnd

- Zustand로 로그인 상태 전역 관리
- 로그인 성공 후 'fetchCurrentUser' 호출로 사용자 정보 동기화
- 새로고침 시 'loadUser()'를 통해 세션 기반 사용자 정보 유지
- 로컬스토리지를 사용해 아이디 저장/자동 로그인 옵션 제공
- 로그인 후 라우팅 처리

### Backend

- express-session을 활용한 세션 기반 인증 구조
  - 로그인 성공 시 req.session.userId에 사용자 ID 저장
  - 클라이언트는 connect.sid 쿠키로 세션 유지
- bcrypt를 통해 비밀번호 해싱 저장
- httpOnly 쿠키로 클라이언트 JS 접근 차단, 보안 강화
- 프론트와 연동을 위해 CORS 설정에 'credentials: true 적용
- Prisma ORM을 통한 MySQL 연동으로 사용자 정보 관리

## Persist Strategy
 - 서비스 계층을 도입하여 추상화 인터페이스를 통해 불필요한 의존성은 제거한 후 로컬 저장소에서 DB로 전환
 - 백엔드 APi 및 DB 연동 후 프론트의 저장소 구현체만 교체
 - 추상화 전략을 통해 유지보수성과 확장성 확보



