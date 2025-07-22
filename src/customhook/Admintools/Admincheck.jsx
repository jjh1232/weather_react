import { useCookies } from "react-cookie";

export default function Admincheck(){

    const [loginuser,setloginuser,removeloginuser]=useCookies();
    //이거 json토큰써도되는데 몰랐었음 파스함수도만듬..

    if(loginuser.userinfo.userrole==="ROLE_Admin")
        return true
    else{
        return false
    }
  
}