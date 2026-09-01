//=====================================================================
// 디자인 토큰 (styled-components ThemeProvider 로 전역 주입)
//  - 레이아웃(폭/위치)은 각 컴포넌트가 그대로 갖고, 여기서는 "색/경계/그림자/굴곡"만 정의한다.
//  - 기존 키(primary, secondary, background, text, gray ...)는 그대로 유지해서
//    이미 쓰고 있는 컴포넌트가 깨지지 않게 했다.
//=====================================================================

// 라이트 모드 팔레트
const light = {
  page: "#e8edf4",              // 문서 바닥색(하늘 배경 뒤)
  surface: "#ffffff",           // 카드/패널 기본면
  surfaceGlass: "rgba(255, 255, 255, 0.82)", // 하늘 배경 위에 뜨는 반투명 패널
  surfaceAlt: "#f4f6fa",        // 살짝 눌린 면(입력창, 헤더 줄 등)
  surfaceHover: "rgba(15, 23, 42, 0.045)",
  border: "rgba(15, 23, 42, 0.10)",
  borderStrong: "rgba(15, 23, 42, 0.20)",
  text: "#12181f",
  textMuted: "#5b6672",
  textFaint: "#8b95a1",
  accent: "#2f7fe0",
  accentHover: "#4a93ea",
  accentActive: "#1f68c0",
  accentSoft: "rgba(47, 127, 224, 0.10)",
  like: "#e0457b",
  toneSuccess: "#2f9e5f",      // 완료 토스트
  overlay: "rgba(15, 23, 42, 0.45)",
  shadowSm: "0 1px 2px rgba(16, 24, 40, 0.05)",
  shadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.08)",
  shadowLg: "0 4px 12px rgba(16, 24, 40, 0.08), 0 24px 48px rgba(16, 24, 40, 0.14)",
  simplebackground: "#e9e0e0",
};

// 다크 모드 팔레트
const dark = {
  page: "#0f1720",
  surface: "#1b2732",
  surfaceGlass: "rgba(27, 39, 50, 0.86)",
  surfaceAlt: "#22303c",
  surfaceHover: "rgba(255, 255, 255, 0.06)",
  border: "rgba(255, 255, 255, 0.10)",
  borderStrong: "rgba(255, 255, 255, 0.20)",
  text: "#e9eef4",
  textMuted: "#9aa8b6",
  textFaint: "#6f7f8e",
  accent: "#5aa3f0",
  accentHover: "#7bb8f5",
  accentActive: "#3d8ade",
  accentSoft: "rgba(90, 163, 240, 0.14)",
  like: "#f472a0",
  toneSuccess: "#4ec98a",      // 완료 토스트(다크에선 한 단계 밝게)
  overlay: "rgba(3, 8, 14, 0.60)",
  shadowSm: "0 1px 2px rgba(0, 0, 0, 0.35)",
  shadow: "0 1px 2px rgba(0, 0, 0, 0.30), 0 8px 24px rgba(0, 0, 0, 0.45)",
  shadowLg: "0 4px 12px rgba(0, 0, 0, 0.35), 0 24px 48px rgba(0, 0, 0, 0.55)",
  simplebackground: "#1c2935",
};

// 모드와 무관한 값들
const common = {
  error: "#ff9800",
  warning: "#ff5252",
  info: "#69f0ae",
  success: "#90caf9",
  gray: "#8b95a1",

  // 브랜드 마크(스카이라인 W)의 해 색. like 와 이어붙여 노을 그라디언트가 된다.
  brandSun: "#f2a33c",

  // 폼 치수 — 로그인/가입/찾기/정보수정 화면이 44·46·48·54px 로 제각각이라
  // 화면을 옮길 때마다 입력칸 크기가 달라 보였다. 여기 한 곳에서만 바꾼다.
  fieldHeight: "52px",
  fieldFont: "15.5px",
  fieldPadX: "16px",

  // 모서리
  radiusSm: "8px",
  radius: "14px",
  radiusLg: "20px",
  radiusPill: "999px",

  // 간격 (컴포넌트에서 theme.space(2) 형태로 사용)
  space: (n) => `${n * 4}px`,

  // 전환
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  transition: "160ms cubic-bezier(0.4, 0, 0.2, 1)",

  // 유리효과
  blur: "saturate(160%) blur(14px)",
};

const theme = (mode) => {
  const p = mode === "dark" ? dark : light;

  return {
    ...common,
    ...p,
    mode: mode,

    // ── 기존 키 호환 ───────────────────────────────
    // background 는 여러 컴포넌트에서 "패널 배경"으로 쓰이고 있어 surface 와 동일하게 둔다.
    background: p.surface,
    primary: p.surface,
    secondary: p.surfaceAlt,
  };
};

export default theme;
