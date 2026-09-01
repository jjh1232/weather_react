//=====================================================================
// 오른쪽 패널(팔로우/팔로워/즐겨찾기)의 검색 필터.
//
// 세 파일에 같은 로직이 복사돼 있었다. 게다가 filter 콜백이 boolean 이 아니라
// 객체를 돌려주고 있어서(객체가 truthy 라 우연히 동작), 읽는 사람이 헷갈렸다.
// 한 곳으로 모으고 boolean 을 돌려주도록 정리한다.
//=====================================================================

/**
 * 닉네임이나 이메일에 키워드가 들어 있는지.
 * 키워드가 비어 있으면 전부 통과시킨다.
 */
export function matchUser(user, keyword) {
  if (!user) return false;

  const key = (keyword || "").trim().toLowerCase();
  if (key === "") return true;

  //대소문자를 가리지 않는다. 예전에는 "SOO" 로 검색하면 "soo" 가 안 걸렸다.
  const nickname = (user.nickname || "").toLowerCase();
  const username = (user.username || "").toLowerCase();

  return nickname.includes(key) || username.includes(key);
}

/**
 * 목록 전체를 걸러 배열로 돌려준다. 목록이 아직 안 왔으면(undefined) 빈 배열.
 * 빈 배열을 돌려줘야 화면 쪽에서 length 로 빈 상태를 판단할 수 있다.
 */
export function filterUsers(list, keyword) {
  if (!Array.isArray(list)) return [];
  return list.filter((user) => matchUser(user, keyword));
}
