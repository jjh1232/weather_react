import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";
import { useState } from "react";
import AuthCheck from "../customhook/authCheck";
import CreateAxios from "../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";

function Commentform(props){
  const [loginuser,Setloginuser,removeloginuser]=useCookies()
  const {noticenum,depth,cnum,commentsubmit}=props
  const logincheck=AuthCheck()
  const axiosinstance=CreateAxios();
  const [comments,setComment]=useState({
   
    text:''

  });
  const url="/commentcreate";
const navigate=useNavigate();

    

  return (
    <div>{logincheck?<div>
      
    
    {loginuser.userinfo["nickname"]}님

        <input type="text" name="text" value={comments.text} 

        onChange={(e)=>{
          setComment({...comments,text:e.target.value})
        }}
        />
        <button type="submit" onClick={()=>{
          console.log("폼에서코멘트"+comments)
          commentsubmit(loginuser.userinfo["username"],
            loginuser.userinfo["nickname"],
            comments.text,
            noticenum,
           
            depth,
            cnum

          )
            setComment({text:""})
        }
      }>댓글작성</button>

    
    </div>
    :<form>
      <input type="text" value="로그인후작성하실수있습니다"/>
      <button type="submit" >댓글작성</button>
    </form>
}
</div>

  )
}
export default Commentform;