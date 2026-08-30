/* 화면과 URL에서 이메일(username)을 감추기 위한 공용 규칙.

   - profileid 는 회원가입 때 정하는 핸들이다(소셜 가입은 이메일 앞부분으로 자동 생성).
   - 옛 계정은 profileid 가 비어 있을 수 있어서, 그때만 이메일 앞부분으로 대신한다.
   - 링크에는 profileid 를 쓰되 없으면 username 을 넘긴다.
     백엔드 조회가 profileid/username 둘 다 받으므로 어느 쪽이든 열린다. */

//표시용: @핸들
export function handletext(profileid, username){
    if(profileid) return `@${profileid}`;
    if(username) return `@${String(username).split("@")[0]}`;
    return "";
}

//링크용: /userpage/{여기}
export function handleparam(profileid, username){
    return profileid || username;
}
