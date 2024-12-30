import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

function UserTest(){
const [loginuser,Setloginuser]=useCookies("userinfo");

    const [message,setMessage]=useState({
        username:"없음",
        userid:"없음",
        usernickname:"없음"
    })

    const userteston=()=>{
    axios.get("/usertest",{
        headers:{
            Authorization:  loginuser.Acesstoken,
            Refreshtoken: loginuser.Refreshtoken
        }
    })
    .then((tes)=>{
        console.log(tes.data);
       

    })
    }
    return (
     <div>
                  {message.username}<br/> 
                  {message.userid}<br/> 
                  {message.usernickname}<br/> 
                    
                    <br/> 

            <button onClick={userteston}>유저테스트on</button>
      
        </div>
    )

    
}
export default UserTest;