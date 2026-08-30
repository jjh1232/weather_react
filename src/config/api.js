//=====================================================================
// 백엔드 주소는 여기 한 곳에서만 정한다.
//
//  - 로컬  : 아래 기본값(http://localhost:8081)이 그대로 쓰인다.
//  - 배포  : REACT_APP_API_URL 로 덮어쓴다.
//            (.env.production 또는 Cloudflare Pages 빌드 환경변수)
//
// 예전에는 이 주소가 22곳에 하드코딩돼 있었고, 그 밖의 14곳은
// package.json 의 "proxy" 에 기대어 상대경로로 호출하고 있었다.
// proxy 는 CRA 개발서버 전용이라 npm run build 결과물에는 존재하지 않는다.
// 즉 배포하면 그 14곳이 전부 프론트 도메인으로 나가 404 가 났다.
//=====================================================================

// 끝의 슬래시는 떼어낸다. `${API_BASE}/open/...` 로 이어붙일 때 //가 되는 걸 막는다.
export const API_BASE =
  (process.env.REACT_APP_API_URL || "http://localhost:8081").replace(/\/$/, "");

// WebSocket 주소. http→ws, https→wss 가 한 번에 처리된다.
// 프론트가 HTTPS 인데 ws:// 로 붙으면 브라우저가 막으므로 직접 쓰지 말 것.
export const WS_BASE = API_BASE.replace(/^http/, "ws");

// 경로를 붙여 절대 URL 을 만든다. 앞 슬래시는 있어도 없어도 된다.
export const apiUrl = (path = "") =>
  `${API_BASE}${path.startsWith("/") ? path : "/" + path}`;

export default API_BASE;
