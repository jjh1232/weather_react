import React, { useEffect, useRef } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis  } from "@fortawesome/free-solid-svg-icons";
import CommentMenu from "../UI/Buttonlist/CommentMenu";
import Replycomment from "../UI/Replycomment";

const Wrapper=styled.div`
  display: flex;
border-bottom:1px solid gray;
gap: 5px;
padding-top: 5px;
padding-bottom: 8px;

`
const Profilediv=styled.div`

  position: relative;
  min-height: 55px;
  display: flex;
  
  margin-left: 3px;
  top: 2px;
`
const Profileimg=styled.img`
  width: 50px;
  height: 50px;
  background-color: white;
  border: 1px solid black;
  object-fit: cover;
   flex-shrink: 0;    // flex item이 줄어들거나 늘어나지 않게 고정
  flex-grow: 0;
    display: block;    
`
const Maindiv=styled.div`
  display: flex;
  flex-direction:column;
  width: 100%;
 
`
const Headerdiv=styled.div`
  display: flex;
  width: 100%;
  gap:5px;
  
`
const Usernamediv=styled.div`
   color:gray;
   position: relative;
   font-size: 13px;
   top: 2px;
`
const Nicknamediv=styled.div`
  color:${(props)=>props.theme.text}  ;
`
const Timediv=styled.div`
 
`
const Usermenudiv=styled.div`
  margin-left: auto;
  margin-right:5px;
  
`
const Maintextdiv=styled.div`
  
`
function Commentlistitem(props){

  const {data,noticeid, page,commentcreate,commentupdate,commentdelete}=props
  const [replyclick,Setreplyclick]=useState(false);
  const [loginuser,Setloginuser,removeloginuser]=useCookies()
  const [isupdate,Setisupdate]=useState(false) 
  const [updatecomment,Setupdatecomment]=useState();
  const [islogin,Setislogin]=useState(false);
  const axiosinstance=CreateAxios();
  const [ismenu,setisMenu]=useState(false);
  const menuref=useRef(false)
  
  
  useEffect(()=>{
    if(loginuser.userinfo){
      Setislogin(true)
    }else{
      Setislogin(false)
    }
  },[islogin])
  
  
  useEffect(()=>{
    const menuclickout=(event)=>{
      if(ismenu &&menuref.current && !menuref.current.contains(event.target)){
        setisMenu(false)
      
    }
  }
  document.addEventListener("mousedown",menuclickout);
  return ()=>{
    document.removeEventListener("mousedown",menuclickout)
  }

  },[ismenu])
  
  const textcopy=async ()=>{
    await navigator.clipboard.writeText(data.text)
    alert("댓글이 복사되었습니다")
  }
 

  return (
    <React.Fragment>
      {isupdate?<Wrapper className="isupdate">
        {data.nickname}님<br/>
              
            <input type="text" defaultValue={data.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} /><br/>
            {data.redtime}<br/>
                  <Button title="수정완료" onClick={(e)=>{
                    
                    Setisupdate(commentupdate(data.id,data.username,updatecomment,e))
                    
                    }}/>
                  <Button title="취소" onClick={(e)=>{ e.stopPropagation() 
                    Setisupdate(!ismenu)}}/>
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
       <Datefor inputdate={data.redtime } colors={"gray"}/>
       
      </Timediv>
      
     <Usermenudiv ref={menuref} onClick={(e)=>{e.stopPropagation(),setisMenu(!ismenu)}}>
      <FontAwesomeIcon icon={faEllipsis} size="xl" />
      {ismenu&&<CommentMenu commentid={data.id} noticeid={noticeid} page={page} 
        ismenu={setisMenu} isupdate={Setisupdate} cid={data.cid} cusername={data.username}
        textcopy={textcopy}
      />}
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

          {data.childs&&data.childs.map((coment)=>{
           
            return (
    <Replycomment parentid={coment.id} 
                     noticeid={noticeid}
                   page={page}
                comment={coment}
                 />
            )
          }

          )
     
          }
    </React.Fragment>


  )
}
export default Commentlistitem;