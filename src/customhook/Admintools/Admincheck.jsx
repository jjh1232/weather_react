import { useCookies } from "react-cookie";

export default function Admincheck(){

    const [loginuser,setloginuser,removeloginuser]=useCookies();

    if(loginuser.userinfo.userrole==="ROLE_Admin")
        return true
    else{
        return false
    }
  
}