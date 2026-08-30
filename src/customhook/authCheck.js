import React from "react";

import { useCookies } from "react-cookie";
import { useState } from "react";
import axios from "axios";
 function AuthCheck(){

 
//인자 없이 부르면 아무 쿠키나 바뀔 때마다 이 훅을 쓰는 화면이 전부 다시 그려진다.
//여기서 보는 건 액세스 토큰 하나뿐이다.
const [cookies,Setcookie,removeCookie]=useCookies(['Acesstoken']);
  if(!cookies.Acesstoken){
  
  return false
  }
  else{
   
    return true
  }



  
}

export default AuthCheck;