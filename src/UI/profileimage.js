import { API_BASE } from "../config/api";
//=====================================================================
// 프로필 이미지 주소 한 곳에서 만들기.
//
// 회원 대부분은 profileimg 가 null 이다(소셜 가입도, 폼 가입도 기본값을
// 넣지 않는다). 그런데 화면 곳곳에서 이렇게 이어붙이고 있었다.
//
//     API_BASE + "/userprofileimg" + data.userprofile
//
// null 이면 "/userprofileimgnull" 이 되어 404 → 깨진 이미지가 뜬다.
// null 은 "사진 없음"이라는 정상 상태이므로 기본 이미지로 바꿔주면 된다.
//
// 파일명은 반드시 대문자 N 인 Noprofile.png 다.
// (Profilediv 가 "noprofile.png" 로 적어놨는데, 윈도우는 대소문자를 안 가려서
//  개발중엔 보이지만 리눅스 서버에 올리면 404 가 된다)
//
// 주소가 두 갈래인 점에 주의.
//  - 기본 이미지는 프론트 번들에 들어가는 "정적 자산" 이다  → PUBLIC_URL
//  - 실제 프로필 사진은 서버가 내보내는 "업로드 파일" 이다   → API_BASE
// 예전엔 기본 이미지도 업로드 폴더(public/userprofileimg)에 같이 있었는데,
// 그 폴더는 사용자 업로드라 저장소에서 빠지므로 배포하면 기본 이미지가 사라진다.
// 그래서 public/img/ 로 옮겼다.
//=====================================================================

//업로드 폴더가 아니라 프론트 정적 자산이다.
export const DEFAULTPROFILE = "/img/Noprofile.png";

/**
 * 프로필 이미지 <img src> 를 만든다.
 * 값이 없으면(null/undefined/빈문자열) 기본 이미지를 돌려준다.
 *
 * 저장된 값은 "/uuid_email" 처럼 앞에 슬래시가 붙은 파일명이지만,
 * 슬래시가 없거나 이미 전체 경로인 경우도 받아준다.
 */
export default function profileimage(path){
    //업로드 파일은 서버가 내보낸다.
    const base = API_BASE;

    if(path===null || path===undefined || String(path).trim()===""){
        //기본 이미지만 프론트 정적 자산이다.
        return process.env.PUBLIC_URL + DEFAULTPROFILE;
    }

    const value = String(path);

    //이미 /userprofileimg 로 시작하는 전체 경로면 그대로 쓴다
    if(value.startsWith("/userprofileimg")){
        return base + value;
    }
    //http(s) 로 시작하는 외부 주소(소셜 프로필 등)도 건드리지 않는다
    if(value.startsWith("http://") || value.startsWith("https://")){
        return value;
    }

    return base + "/userprofileimg" + (value.startsWith("/") ? value : "/"+value);
}

/**
 * 배경 이미지 <img src> 를 만든다. 규칙은 profileimage 와 같다.
 *
 * 기본 이미지는 없다. 값이 없으면 null 을 돌려주고, 호출부가
 * "배경 없음" 스타일을 그리게 한다.
 *
 * 예전에는 호출부에서 API_BASE + "/userbackgroundimg" + 값 으로 이어붙였다.
 * 저장된 값이 "/uuid.png" 처럼 앞 슬래시를 갖고 있어서 우연히 맞았을 뿐이고,
 * 슬래시 없는 값이 하나라도 들어오면 바로 깨진다.
 */
export function backgroundimage(path){
    if(path===null || path===undefined || String(path).trim()===""){
        return null;
    }

    const value = String(path);

    if(value.startsWith("/userbackgroundimg")){
        return API_BASE + value;
    }
    if(value.startsWith("http://") || value.startsWith("https://")){
        return value;
    }

    return API_BASE + "/userbackgroundimg" + (value.startsWith("/") ? value : "/"+value);
}

/** 차단된 첨부 이미지 자리에 보여주는 안내 이미지. 프론트 번들의 정적 자산이다. */
export const BANNED_IMAGE = "/front/Subimages/chdan.png";

/**
 * 게시글 첨부 이미지(detachfiles) 의 <img src> 를 만든다.
 *
 * 경로가 두 갈래인 것이 핵심이다.
 *   업로드 파일   "/noticeimages/2026/09/01/uuid.png"  → 서버가 내보낸다   → API_BASE
 *   차단 안내이미지 "/front/Subimages/chdan.png?ban=3"  → 프론트 정적 자산 → PUBLIC_URL
 *
 * 예전에는 여섯 군데가 전부 API_BASE 를 붙이고 있었다. 그래서 이미지를 차단하면
 * 백엔드에 없는 /front/... 를 요청하게 되고, 차단 안내 이미지마저 깨져서
 * "차단됨" 딱지만 뜨고 그림은 빈칸으로 남았다.
 * (Imageformlist 한 곳만 PUBLIC_URL 로 올바르게 쓰고 있었다)
 */
export function detachimage(path){
    if(path===null || path===undefined || String(path).trim()===""){
        return null;
    }

    const value = String(path);

    //이미 전체 주소면 그대로 쓴다(originalpath 는 절대 주소로 저장된다).
    if(value.startsWith("http://") || value.startsWith("https://")){
        return value;
    }

    //프론트 정적 자산. 뒤에 ?ban=3 같은 쿼리가 붙어 있어도 그대로 통과한다.
    if(value.startsWith("/front/")){
        return process.env.PUBLIC_URL + value;
    }

    return API_BASE + (value.startsWith("/") ? value : "/"+value);
}
