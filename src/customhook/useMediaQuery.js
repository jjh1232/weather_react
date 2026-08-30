import { useEffect, useState } from "react";

//====================================================================
// CSS 의 @media 와 똑같은 조건을 JS 에서 읽는다.
// CSS 로 숨길 수 있는 건 CSS 로 하고(그 편이 빠르다),
// "아예 렌더하지 말아야 하는 것"에만 이 훅을 쓴다.
//
//   const isMobile = useMediaQuery("(max-width: 900px)");
//====================================================================
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    //SSR/테스트 환경에는 window 가 없을 수 있다
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);

    //마운트와 구독 사이에 창 크기가 바뀌었을 수 있으니 한 번 맞춰준다
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
