import axios from "axios";
import React, { useRef } from "react";
import { useCookies } from "react-cookie";
import { useState } from "react";
import AuthCheck from "../customhook/authCheck";
import CreateAxios from "../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";


const Wrapper=styled.div`
  position: relative;
  width: 100%;
  display: flex;
  min-height: 60px;
  max-height: fit-content;
  border: 1px solid blue;
  word-break: break-all;
  overflow: hidden;
`
const Imgdiv=styled.div`
  border: 1px solid black;
  flex-grow: 1;
  display: flex;
  align-items: center;
    justify-content: center;  /* 가로 중앙 정렬 */

`
const Img=styled.img`
  
  top:2px;
  left:0%;
  width: 60px;
  height: 55px;
  display:inline-block;
  border: 1px solid black;
  background-color: white;
`

const Maindiv=styled.div`
border: 1px solid yellow;
flex-grow: 110;
display: flex;
flex-direction: column;
`
const Headerdiv=styled.div`
border: 1px solid red;

`
const Username=styled.span`

   left: 64px;
  font-size: 15px;
   
  
`


const Commentmaindiv=styled.div`
  display: flex;
  border: 1px solid green;
`
const Commentinput=styled.textarea`
//position: relative;
//display: inline-block;
width: 92%;
font-size: 20px;
top: 25px;
left:64px;



`

const CreateButton=styled.button`

//position: absolute;
//left: 87.2%;
top:28%;
width: 45px;
height: 40px;
margin-left: 5px;
`
const Nologininput=styled.input`
  padding: 5px;
  margin: 3px;
  width:88%;
  border-radius: 5%;
`
const Nologinbutton=styled.button`
  
`


function Commentform(props){
 //,commentsubmit
  const {noticenum,depth,cnum,page}=props
  
  const logincheck=AuthCheck()
  const axiosinstance=CreateAxios();
  const [comments,setComment]=useState({
   
    text:''

  });
  const [cookie,setcookie,removecookie]=useCookies(['userinfo'])
  const username=cookie.userinfo?.username;
  const usernickname=cookie.userinfo?.usernickname;

  const url="/commentcreate";
const navigate=useNavigate();

const queryclient=useQueryClient()
const textref=useRef()
//자연스럽게늘리기
const resize=()=>{
  textref.current.style.height=`auto`;
  textref.current.style.height=textref.current.scrollHeight+`px`;

}
const Commentcreate=async ({noticenum,depth,cnum,username,usernickname,comment})=>{
  const res=await axiosinstance.post("/commentcreate",{
      noticeid:noticenum,
      depth:depth,
      cnum:cnum,
      username:username,
      nickname:usernickname,
      text:comment,
      

    })

}
const commentmutate=useMutation({
   mutationFn:Commentcreate,
   onSuccess:(data)=>{
    queryclient.invalidateQueries({queryKey:["comments",noticeid,page]})
   }
})

const Commenthandler=()=>{
  mutation.mutate({noticenum,depth,cnum,username,usernickname,comments})
}

  return (
    <>{logincheck?<Wrapper>
    
      <Imgdiv>
      <Img src={process.env.PUBLIC_URL+"/userprofileimg"+cookie.userinfo["profileimg"]}/>
    </Imgdiv>

    <Maindiv>

      <Headerdiv>
    <Username>
    {cookie.userinfo["nickname"]}님
    </Username>
    </Headerdiv>

        <Commentmaindiv>
        <Commentinput type="text" name="text" value={comments.text} 
        onInput={resize}
        rows={1}
        ref={textref}
        onChange={(e)=>{
          setComment({...comments,text:e.target.value})
        }}
        />
       


<CreateButton type="submit" onClick={()=>{
          Commenthandler(noticenum,depth,cnum,username,usernickname,comments.text)
       
            setComment({text:""})
            textref.current.style.height="30px"

        }
      }>댓글작성
      </CreateButton>
     
      </Commentmaindiv>
      </Maindiv>
    </Wrapper>
    :<Wrapper>
    <form>
      <Nologininput type="text" value="로그인후작성하실수있습니다"/>
      <Nologinbutton type="submit" >댓글작성</Nologinbutton>
    </form>
    </Wrapper>
}
</>

  )
}
export default Commentform;