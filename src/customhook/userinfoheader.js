//=====================================================================
// 백엔드가 응답 헤더로 내려주는 userinfo 를 꺼내 쿠키에 저장한다.
//
// 예전에는 백엔드가 userinfo 를 "쿠키로 직접" 심었다. 로컬에서는 8081 과 3001 이
// 둘 다 localhost 라(쿠키는 포트를 구분하지 않는다) 프론트가 읽을 수 있었지만,
// 배포해서 api.도메인 과 프론트 도메인으로 갈라지면 그 쿠키는 API 도메인 소유가 되어
// 프론트의 document.cookie 에서 아예 보이지 않는다.
// 로그인은 성공하는데 앱은 누가 로그인했는지 모르는 상태가 된다.
//
// 그래서 토큰과 같은 방식(응답 헤더)으로 통일했다. 백엔드는
//   userinfo: <URL 인코딩된 JSON>
// 을 내려주고(CORS exposedHeaders 에 등록돼 있다), 프론트가 자기 도메인 쿠키에 넣는다.
// 저장하는 이름·모양은 예전과 같으므로 이 값을 읽는 화면들은 손대지 않았다.
//=====================================================================

export const USERINFO_HEADER = "userinfo";

/** axios 1.x 의 headers 는 AxiosHeaders 객체다. fetch 응답도 받아준다. */
function readheader(headers, name) {
  if (!headers) return null;
  if (typeof headers.get === "function") return headers.get(name);
  return headers[name] ?? headers[name.toLowerCase()] ?? null;
}

/**
 * 응답에 userinfo 헤더가 있으면 쿠키에 저장한다.
 * @param res axios 응답
 * @param setCookie react-cookie 의 setter
 * @returns 저장했으면 true
 */
export function saveuserinfo(res, setCookie) {
  const raw = readheader(res?.headers, USERINFO_HEADER);
  if (!raw) return false;

  try {
    //백엔드가 URLEncoder 로 인코딩해 보낸다(닉네임·주소에 한글이 들어간다).
    //URLEncoder 는 공백을 '+' 로 바꾸므로 decodeURIComponent 전에 되돌린다.
    const decoded = decodeURIComponent(String(raw).replace(/\+/g, "%20"));
    //react-cookie 는 객체를 넣으면 JSON 으로 직렬화해 저장하고 읽을 때 되돌려준다.
    //path 를 반드시 준다. 안 주면 지금 화면 주소를 기준으로 심겨서
    //로그아웃할 때 path:"/" 로 지우는 쿠키와 서로 다른 쿠키가 된다.
    setCookie("userinfo", JSON.parse(decoded), { path: "/" });
    return true;
  } catch (e) {
    //화면 표시용 정보라 여기서 실패해도 로그인 자체를 막지는 않는다.
    console.log("userinfo 헤더 파싱 실패", e);
    return false;
  }
}
