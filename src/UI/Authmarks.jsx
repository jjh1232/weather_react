import React from "react";
import { API_BASE } from "../config/api";

//소셜 로그인 버튼의 아이콘.
//사이드바 위젯과 로그인 페이지가 같이 쓰므로 여기 한 곳에 둔다.

export const GoogleMark=()=>(
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

export const NaverMark=()=>(
  <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden="true">
    <path fill="currentColor" d="M13.5615 10.7014L6.15827 0H0V20H6.43836V9.29857L13.8418 20H20V0H13.5615V10.7014Z"/>
  </svg>
)

//OAuth 로그인으로 보내기. 돌아올 위치를 남겨둔다.
export function oauthredirect(provider){
  const prevpath=window.location.pathname;
  localStorage.setItem("oauthbeforepath",prevpath);
  const v=(provider||"").toLowerCase();
  /* 예전엔 ?state= 로 돌아갈 경로를 같이 보냈다.
     그런데 state 는 스프링 시큐리티가 CSRF 방어용으로 직접 생성해 덮어쓰기 때문에
     백엔드에서 읽으면 경로가 아니라 시큐리티의 랜덤 문자열이 나온다.
     실제로 경로를 나르는 건 바로 위의 localStorage 다. */
  document.location.href=`${API_BASE}/oauth2/authorization/${v}`;
}
