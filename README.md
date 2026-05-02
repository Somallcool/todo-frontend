# 🎨 Today's Work (Front-end)

> **"작은 성취감이 모여 만드는 단단한 자존감"**  
> 현대 사회의 스트레스를 일상의 작은 성취를 통해 완화하고자 시작된 개인 프로젝트입니다. 메모장이나 스티커 메모 대신, 더 직관적이고 체계적인 디지털 도구를 통해 하루의 할 일을 관리하고 완료해 나가는 과정에서의 즐거움을 제공합니다.

<p align="center">
  <img width="938" height="879" alt="image" src="https://github.com/user-attachments/assets/1a3a6cc5-0f38-4b3f-b137-ae257e0f5001" />

</p>

## 🔗 관련 링크
- **Back-end Repository (API Server)**: [github.com/Somallcool/todo-backend](https://github.com/Somallcool/todo-backend.git)

## 🛠 핵심 기술 스택
- **Library**: `React.js`, `Vite`
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Styling**: `CSS3` (Flexbox, Grid, Animations, Backdrop-filter)
- **Communication**: `Fetch API` (Async/Await)

---

## 💄 Design & UI/UX Strategy
단순한 기능 구현을 넘어, 사용자가 할 일을 입력하고 완료하는 과정에서 **시각적 즐거움과 편안함**을 느낄 수 있도록 디자인했습니다.

### 1. 시각적 가독성을 위한 레이아웃 정렬
- **4구간 분할 시스템**: 각 할 일 항목을 `[체크박스 / 정보 헤더 / 본문 / 작업 버튼]`의 4개 영역으로 엄격히 분리하여, 많은 데이터 속에서도 사용자가 정보를 빠르게 훑을 수 있도록 구성했습니다.
- **Badge System**: 우선순위(높음/보통/낮음)와 카테고리를 직관적인 컬러 배지로 표현하여 중요도를 즉각적으로 파악할 수 있게 했습니다.

### 2. 부드러운 인터랙션 및 입체감
- **유리 효과(Glassmorphism)**: 수정 모달 오픈 시 `backdrop-filter: blur`를 적용하여 사용자의 시선을 현재 작업에 집중시키고 현대적인 디자인 무드를 연출했습니다.
- **상태 변화 애니메이션**: 할 일 완료 시 배경색이 연초록으로 부드럽게 변하며 취소선이 그어지는 시각적 피드백을 통해 '완료했다'는 성취감을 극대화했습니다.
- **Shadow & Depth**: 카드 형태의 컨테이너에 부드러운 그림자(`box-shadow`)를 사용하여 화면 전체에 입체감을 부여했습니다.

<!-- 디자인 포인트 이미지 배치 영역 -->

- **체크박스 체크, 마우스 hover, 미선택**
  
  <p align="center">
    <img width="804" alt="체크박스 디자인" src="https://github.com/user-attachments/assets/1ddf690d-9ba1-458d-8c02-1b4af1ec82f1" />
  </p>

- **선택 완료 항목 삭제와 전체 데이터 초기화**

  <p align="center">
    <img width="448" alt="항목 삭제" src="https://github.com/user-attachments/assets/5e32c46e-4aac-46aa-a4aa-07c3f1bd1db7" />
    <img width="447" alt="데이터 초기화" src="https://github.com/user-attachments/assets/3136b1eb-2d3b-403a-a03f-ab65716be1aa" />
  </p>

- **할 일 수정 (모달창)**

  <p align="center">
    <img width="800" alt="수정 모달" src="https://github.com/user-attachments/assets/cabee6b2-d666-48d7-95ca-39853003eb13" />
  </p>

- **검색어 입력 (제목 기반 필터링)**

  <p align="center">
    <img width="800" alt="검색 기능" src="https://github.com/user-attachments/assets/968650ff-3a6a-4de8-b4e6-453f2ef376ed" />
  </p>

---

## ✨ 주요 구현 특징

### 1. 실시간 데이터 동기화
- `useEffect`의 의존성 배열을 활용하여 검색어 입력이나 정렬 기준 변경 시 별도의 새로고침 없이 서버에서 데이터를 즉시 가져오도록 설계했습니다.
- 할 일 완료 체크, 수정, 삭제 요청 후 UI가 즉각적으로 업데이트되도록 상태 관리를 최적화했습니다.

### 2. 사용자 중심의 기능 설계
- **커스텀 모달**: 페이지 이동 없는 인라인 수정 시스템으로 사용자 경험의 끊김을 방지했습니다.
- **반응형 Flex 레이아웃**: 다양한 화면 크기에서 요소들이 겹치지 않고 정렬을 유지하도록 `flex-shrink`와 `min-width`를 전략적으로 사용했습니다.

### 3. 서버 통신 및 데이터 가공
- **CORS 대응**: 서버 측 `CORSFilter`와 연동하여 안전한 데이터 통신 환경을 구축했습니다.
- **날짜 유틸리티**: 서버에서 넘어오는 배열 형태의 날짜 데이터를 브라우저 표준 양식(`YYYY-MM-DD`)으로 변환하는 유틸리티 로직을 구현했습니다.

---

## 🚀 추후 추가 기능 고려대상 (Future Roadmap)

현재의 핵심 기능을 넘어, 사용자 편의성과 일정 관리의 효율성을 높이기 위해 다음과 같은 기능을 고도화할 예정입니다.

### 1. 스마트 상태 관리 시스템
- **마감기한 자동 감지**: 설정된 마감기한(`due-date`)이 지났을 경우, 시스템이 이를 자동으로 감지하여 '기한 초과' 상태로 변경하거나 사용자에게 알림을 주는 기능을 검토 중입니다.

### 2. 캘린더 뷰(Calendar View) 도입
- **시각적 일정 관리**: 현재의 리스트 형태뿐만 아니라 월별/주별 캘린더 화면을 추가하여 전체적인 일정 흐름을 한눈에 파악할 수 있도록 구현할 계획입니다.
- **예약 등록 및 관리**: 캘린더 내 특정 날짜를 클릭하여 해당 일자의 할 일을 미리 작성하거나, 드래그 앤 드롭을 통한 직관적인 일정 수정 기능을 고려하고 있습니다.

### 3. 사용자 경험(UX) 확장
- **반복 일정 설정**: 매일 혹은 매주 반복되는 루틴 업무를 한 번의 등록으로 자동 생성하는 기능을 추가할 예정입니다.

---

## 🚀 실행 방법
1. 프로젝트 클론 및 이동:
   ```bash
   git clone [https://github.com/Somallcool/todo-frontend.git](https://github.com/Somallcool/todo-frontend.git)
   cd todo-frontend
