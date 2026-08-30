import { useCookies } from "react-cookie";

export default function Admincheck(){

    const [loginuser]=useCookies(['userinfo']);
    //이거 json토큰써도되는데 몰랐었음 파스함수도만듬..

    //비로그인 상태면 userinfo 쿠키 자체가 없다. 예전엔 여기서 바로
    //undefined.userrole 을 읽어 TypeError 가 났고, /admin 이 흰 화면이 됐다.
    //(Navigate 로 넘어가지도 못했다)
    return loginuser.userinfo?.userrole==="ROLE_Admin";
  
}