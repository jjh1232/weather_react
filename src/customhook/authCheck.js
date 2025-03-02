import React from "react";

import { useCookies } from "react-cookie";
import { useState } from "react";
import axios from "axios";
 function AuthCheck(){

 
const [cookies,Setcookie,removeCookie]=useCookies();
  if(!cookies.Acesstoken){
  console.log("유저없음")
  return false
  }
  else{
    console.log("유저있음")
    return true
  }



  
}

export default AuthCheck;