import React from "react";

import { useCookies } from "react-cookie";
import { useState } from "react";
import axios from "axios";
 function AuthCheck(){

 
const [cookies,Setcookie,removeCookie]=useCookies();
  if(!cookies.Acesstoken){
  
  return false
  }
  else{
   
    return true
  }



  
}

export default AuthCheck;