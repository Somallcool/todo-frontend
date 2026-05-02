# 🎨 Today's Work (Front-end)

사용자 친화적인 인터페이스와 실시간 데이터 연동에 집중한 할 일 관리 애플리케이션의 프론트엔드 구현체입니다. **React**와 **Vite**를 사용하여 개발되었으며, **Java Servlet** API 서버와 통신합니다.

## 🔗 관련 링크
-   **Back-end Repository (API Server)**: (https://github.com/Somallcool/todo-backend.git)

## 🛠 핵심 기술 스택
-   **Library**: React.js, Vite
-   **State Management**: React Hooks (`useState`, `useEffect`)
-   **Styling**: CSS3 (Flexbox, Grid, Animations)
-   **Communication**: Fetch API (Async/Await)


## ✨ 주요 구현 특징

### 1. 실시간 데이터 동기화
-   `useEffect`의 의존성 배열을 활용하여 검색어 입력이나 정렬 기준 변경 시 별도의 새로고침 없이 서버에서 데이터를 즉시 가져오도록 설계했습니다.
-   할 일 완료 체크, 수정, 삭제 요청 후 UI가 즉각적으로 업데이트되도록 상태 관리를 최적화했습니다.

### 2. 사용자 중심의 UI/UX 설계
-   **모달(Modal) 시스템**: 페이지 이동 없이 한 화면에서 상세 내용을 수정할 수 있는 커스텀 모달을 구현했습니다.
-   **배지(Badge) 디자인**: 우선순위(🔥 높음, ✅ 보통, 💤 낮음)와 카테고리를 직관적인 배지 형태로 디자인하여 시각적 가독성을 높였습니다.
-   **반응형 레이아웃**: Flexbox를 활용하여 입력 폼과 리스트가 다양한 화면 크기에서 정렬을 유지하도록 구성했습니다.

### 3. 서버 통신 및 예외 처리
-   **CORS 대응**: 서버 측 `CORSFilter`와 연동하여 안전하게 데이터를 주고받습니다.
-   **날짜 데이터 처리**: 서버에서 넘어오는 다양한 날짜 배열 형식을 브라우저 표준 양식(`YYYY-MM-DD`)으로 변환하는 유틸리티 로직을 포함하고 있습니다.

## 🚀 실행 방법
1.  프로젝트 클론 및 이동: `git clone [레포지토리 주소]`
2.  의존성 설치: `npm install`
3.  개발 서버 실행: `npm run dev`
    *   *주의: 백엔드 API 서버가 `http://localhost:8081`에서 구동 중이어야 정상 작동합니다.*
