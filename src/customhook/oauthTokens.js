//=====================================================================
// OAuth 로그인 후 백엔드가 리다이렉트 주소의 프래그먼트(# 뒤)에 실어 보낸
// 토큰을 꺼내 저장한다.
//
//  백엔드가 보내는 형태:
//    https://프론트도메인/oauthsuccess#token=...&refresh=...&userinfo=...
//
// 예전에는 백엔드가 쿠키로 심어줬다. 로컬에서는 8081 과 3001 이 둘 다
// localhost 라(쿠키는 포트를 구분하지 않는다) 읽을 수 있었지만,
// 배포해서 도메인이 갈라지면 그 쿠키는 API 도메인 소유가 되어
// 프론트에서 아예 보이지 않는다.
//=====================================================================

/**
 * 주소의 프래그먼트에서 토큰을 꺼내 쿠키에 저장한다.
 * @param setCookie react-cookie 의 setter
 * @returns 토큰을 실제로 받았으면 true
 */
export function consumeOauthTokens(setCookie) {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return false;

  //맨 앞 '#' 을 떼고 파싱한다. 값은 백엔드에서 URLEncoder 로 인코딩해 보낸다.
  const params = new URLSearchParams(hash.slice(1));
  const token = params.get("token");
  const refresh = params.get("refresh");
  const userinfo = params.get("userinfo");

  if (!token) return false;

  //일반 로그인(useLogin.js)과 같은 이름·같은 path 로 저장해야
  //이후 화면들이 동일하게 읽는다.
  setCookie("Acesstoken", token, { path: "/" });
  if (refresh) setCookie("Refreshtoken", refresh, { path: "/" });
  if (userinfo) {
    try {
      setCookie("userinfo", JSON.parse(userinfo), { path: "/" });
    } catch (e) {
      //JSON 이 아니면 원문 그대로 둔다. 화면 표시용이라 로그인 자체를 막지는 않는다.
      console.log("userinfo 파싱 실패", e);
      setCookie("userinfo", userinfo, { path: "/" });
    }
  }

  //주소창에서 토큰을 즉시 지운다.
  //안 지우면 사용자가 주소를 복사해 공유했을 때 토큰이 그대로 넘어가고,
  //브라우저 히스토리에도 남는다.
  window.history.replaceState({}, "", window.location.pathname + window.location.search);

  return true;
}
