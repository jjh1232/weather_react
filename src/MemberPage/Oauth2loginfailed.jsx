import React, { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";


function Oauth2loginfailed(){
const [query,setQuery]=useSearchParams();
const navigate=useNavigate();

useEffect=(()=>{
   messagecheck();
    
},[])
const messagecheck=()=>{
    if(query.get("msg")===null){
        alert("서버오류입니다!메인화면으로이동합니다")
        navigate("/main")
    }
    else{
    console.log("이거")
    alert("사이트에 이미 이메일이존재합니다!사이트로그인을이용해주세요")
    console.log("왜지")
    navigate("/main")
    }
}

return (<>
    <div>
       ㅋㅋ
    </div>
</>)
}

export default Oauth2loginfailed