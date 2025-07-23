import React from "react";
import Admincheck from "./Admincheck";
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import ParseJwt from "../ParseJwt";


//리액트내부에서 use안붙이면 일반함수로인식한다함;
export const usegettoken=()=>{

    const [cookie]=useCookies();
    //리액트훅은  쿠키를 아직읽는중일때 undefined를 준다고한다
    //그리고훅은 상태가 바뀌면 자동으로실행하기때문에 나중에 다시실행이됨
    
     const accessToken = cookie.Acesstoken;

     
       
  if (!accessToken) return null; // ✅ 토큰 없음 → 바로 null 반환

  const jsontoken = ParseJwt(accessToken);
  //널리시콜레싱 왼쪽값이 null또는 undefined일경우 오른쪽값사용 

  return jsontoken?.role ?? null; // ✅ 안전하게 role 반환

}
//관리자권한
export const PrivateRoute=()=>{
    
    return Admincheck() ?<Outlet/>:<Navigate to="/noaccess"/>
}
//비로그인저만
export const NoLoginRoute=()=>{
    const role=usegettoken();

    console.log("유저롤:",role)
          if (role === undefined) {
    // ✅ 쿠키 로딩 중 — 아무것도 렌더하지 말고 기다림
    return <div>...유저확인중</div>;
  }


    return role === null? <Outlet/> :<Navigate to ="/"/>
}
//로그인유저만
export const LoginRoute=()=>{

        const role=usegettoken();

    console.log("유저롤:",role)
          if (role === undefined) {
    // ✅ 쿠키 로딩 중 — 아무것도 렌더하지 말고 기다림
    return <div>...유저확인중</div>;
  }

    return role === "ROLE_User" || "ROLE_Admin"?<Outlet/> :<Navigate to ="/"/>
}