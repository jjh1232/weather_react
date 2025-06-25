import React, { useState,useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import Datefor from "./DateCom/Datefor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis  } from "@fortawesome/free-solid-svg-icons";
import CommentMenu from "../../UI/Buttonlist/CommentMenu";

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
  white-space: pre-wrap;
`

export default function Commentview(props){

    const {data,Setisupdate,noticeid,page}=props;

    const [ismenu,setIsmenu]=useState(false);
     const [loginuser,Setloginuser,removeloginuser]=useCookies(`userinfo`)



    const menuref=useRef(null)

    const [islogin,setIslogin]=useState();

     useEffect(()=>{
        if(loginuser.userinfo){
          setIslogin(true)
        }else{
          setIslogin(false)
        }
      },[islogin])
      
      
      useEffect(()=>{
        const menuclickout=(event)=>{
          if(ismenu &&menuref.current && !menuref.current.contains(event.target)){
            setIsmenu(false)
          
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
        <>
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
      
     <Usermenudiv ref={menuref} onClick={(e)=>{e.stopPropagation(),setIsmenu(!ismenu)}}>
      <FontAwesomeIcon icon={faEllipsis} size="xl" />
      {ismenu&&
      <CommentMenu commentid={data.id} noticeid={noticeid} page={page} 
        ismenu={setIsmenu} isupdate={Setisupdate} cid={data.cid} cusername={data.username}
        textcopy={textcopy}
      />}

  </Usermenudiv>
  </Headerdiv>
  <Maintextdiv>
    {data.text}
  </Maintextdiv>
  </Maindiv>
        </>
    )
}