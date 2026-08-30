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
