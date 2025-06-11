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
import Datefor from "./noticeformlist/DateCom/Datefor";


const Wrapper=styled.div`
  display: flex;
border-bottom:1px solid;

`
const Profilediv=styled.div`
border: 1px solid black;
  width: 8%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Profileimg=styled.img`
  width: 50px;
  height: 50px;
  background-color: white;
`
const Maindiv=styled.div`
  display: flex;
  flex-direction:column;
  width: 90%;
  border: 1px solid red;
`
const Headerdiv=styled.div`
  display: flex;
  width: 100%;
  
`
const Usernamediv=styled.div`
  
`
const Nicknamediv=styled.div`
    
`
const Timediv=styled.div`
 
`
const Usermenudiv=styled.div`
  margin-left: auto;
  
`
const Maintextdiv=styled.div`
  
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
    <>
      {isupdate?<Wrapper className="isupdate">
        {data.nickname}님<br/>
              
            <input type="text" defaultValue={data.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} /><br/>
            {data.redtime}<br/>
                  <Button title="수정완료" onClick={(e)=>{
                    
                    Setisupdate(commentupdate(data.id,data.username,updatecomment,e))
                    
                    }}/>
                  <Button title="취소" onClick={()=>{Setisupdate(false)}}/>
        </Wrapper>
      :<Wrapper  onClick={()=>{
        Setreplyclick(!replyclick)
    }}
    >
      <Profilediv>
        <Profileimg src={process.env.PUBLIC_URL+"/userprofileimg/"+data.userprofile}/>
        
      </Profilediv>
      <Maindiv>
        <Headerdiv>
          <Nicknamediv>
      {data.nickname}
      </Nicknamediv> 
      <Usernamediv>
        {data.username}
      </Usernamediv>
      <Timediv>
       <Datefor inputdate={data.redtime } colors={"red"}/>
      </Timediv>
      
     <Usermenudiv>
      
      {islogin &&<div>
      {loginuser.userinfo["username"]===data.username? 
      <div>
      <Button title="수정" onClick={()=>{
              Setisupdate(true)
      }}/>
      <Button title="삭제" onClick={()=>{
         if(window.confirm("정말로삭제하시겠습니까?")){
              
              Setisupdate(commentdelete(data.id));
         }
            }}/>
      </div>
      :""}
      </div>       
  }
  </Usermenudiv>
  </Headerdiv>
  <Maintextdiv>
    {data.text}
  </Maintextdiv>
  </Maindiv>
</Wrapper>
}
    {replyclick?
          <Commentform 
           
           noticenum={noticeid}
           
           depth="1"
           cnum={data.id}
           page={1}
             />
             :""}

    </>


  )
}
export default Commentlistitem