import React, { useId } from "react";
import { useTheme } from "styled-components";

//=====================================================================
// 브랜드 마크 — 스카이라인 W
//  - W 를 능선처럼 꺾어 그리고 그 위에 해를 얹었다. 획 하나 + 원 하나가 전부라
//    16px 까지 줄여도 뭉개지지 않는다.
//  - 색은 전부 테마 토큰(accent / brandSun / like)에서 가져오므로
//    다크모드 전환이 알아서 따라온다. 여기에 색을 직접 박지 말 것.
//  - 한 화면에 여러 번 그려도 그라디언트 id 가 안 겹치게 useId 를 붙였다.
//=====================================================================
function BrandMark(props) {
  const { size = 26, className, title = "Weave" } = props;

  const theme = useTheme();
  // useId 는 ":r0:" 처럼 콜론이 섞여 나와서 url(#...) 참조가 지저분해진다. 걷어낸다.
  const uid = useId().replace(/:/g, "");
  const skyId = `weave-sky-${uid}`;
  const sunId = `weave-sun-${uid}`;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      focusable="false"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.accentHover} />
          <stop offset="1" stopColor={theme.accent} />
        </linearGradient>
        <linearGradient id={sunId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={theme.brandSun} />
          <stop offset="1" stopColor={theme.like} />
        </linearGradient>
      </defs>

      {/* 해 */}
      <circle cx="24" cy="9.5" r="4.6" fill={`url(#${sunId})`} />
      {/* 능선 W */}
      <path
        d="M7 19.5 15.5 37 24 24.5 32.5 37 41 19.5"
        fill="none"
        stroke={`url(#${skyId})`}
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BrandMark;
