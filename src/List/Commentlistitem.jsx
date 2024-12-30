import React, { useEffect } from "react";
import { useState } from "react";
import Commentform from "../Noticepage/Commentform";
import { useCookies } from "react-cookie";
import Button from "../UI/Button";
import axios from "axios";
import { Navigate } from "react-router-dom";
import AuthCheck from "../customhook/authCheck";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";


const Wrapper=styled.div`
  
border-bottom:1px solid;

`
function Commentlistitem(props){

  const {data,noticeid, commentcreate,commentupdate,commentdelete}=props
  const [replyclick,Setreplyclick]=useState(false);
  const [loginuser,Setloginuser,removeloginuser]=useCookies()
  const [isupdate,Setisupdate]=useState(false) 
  const [updatecomment,Setupdatecomment]=useState();
  const [islogin,Setislogin]=useState(false);
  const axiosinstance=CreateAxios();
  
  
  
  
  useEffect(()=>{
    if(loginuser.userinfo){
      Setislogin(true)
    }else{
      Setislogin(false)
    }
  },[islogin])
  
  console.log("코멘트")
  console.log(islogin)
  
 

  return (
    <Wrapper>
      {isupdate?<div className="isupdate">
        {data.nickname}님<br/>
              
            <input type="text" defaultValue={data.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} /><br/>
            {data.redtime}<br/>
                  <Button title="수정완료" onClick={(e)=>{
                    
                    Setisupdate(commentupdate(data.id,data.username,updatecomment,e))
                    
                    }}/>
                  <Button title="취소" onClick={()=>{Setisupdate(false)}}/>
        </div>
      :<div  onClick={()=>{
        Setreplyclick(!replyclick)
    }}
    >
      {data.nickname}님 <br/>
      {data.text}<br/>
      {data.redtime} <br/>
      
      {islogin &&<div>
      {loginuser.userinfo["username"]===data.username? 
      <div>
      <Button title="수정" onClick={()=>{
              Setisupdate(true)
      }}/>
      <Button title="삭제" onClick={()=>{
              alert("정말로삭제하겠습니까?")
              Setisupdate(commentdelete(data.id));
            
            }}/>
      </div>
      :""}
      </div>       
  }
</div>
}
    {replyclick?
          <Commentform 
           
           noticenum={noticeid}
           
           depth="1"
           cnum={data.id}
           commentsubmit={commentcreate}
             />
             :""}

    </Wrapper>


  )
}
export default Commentlistitem