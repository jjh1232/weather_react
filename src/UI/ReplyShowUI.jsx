import React, { useEffect, useRef, useState } from "react";
import Datefor from "../List/noticeformlist/DateCom/Datefor";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { handletext } from "../customhook/Userhandle";
import CommentMenu from "./Buttonlist/CommentMenu";
import { API_BASE } from "../config/api";

/* ─────────────────────────────────────────────────────────────
   대댓글 한 줄(읽기 모드)
   - 원댓글(Commentview)과 같은 구성이되 한 단계씩 작게 잡아서
     시각적으로 "아래 단계"라는 게 크기만으로도 읽히게 했다.
   ───────────────────────────────────────────────────────────── */

const Profilediv=styled.div`
  flex-shrink: 0;
  display: flex;
`
const Profileimg=styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  flex-shrink: 0;    // flex item이 줄어들거나 늘어나지 않게 고정
  flex-grow: 0;
  border: 1px solid ${(props)=>props.theme.border};
  background: ${(props)=>props.theme.surfaceAlt};
  transition: box-shadow ${(props)=>props.theme.transition};

  &:hover {
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
  }
`
const Maindiv=styled.div`
  display: flex;
  flex-direction:column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`
const Headerdiv=styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 6px;
  min-height: 24px;
`
const Usernamediv=styled.div`
   color: ${(props)=>props.theme.textMuted};
   font-size: 12.5px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   min-width: 0;
`
const Nicknamediv=styled.div`
  color: ${(props)=>props.theme.text};
  font-size: 13.5px;
  font-weight: 650;
  letter-spacing: -0.02em;
  white-space: nowrap;
  flex-shrink: 0;
`
const Timediv=styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${(props)=>props.theme.textFaint};
  white-space: nowrap;

  &::before { content: "·"; }
`
const Usermenudiv=styled.div`
  position: relative;
  margin-left: auto;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: ${(props)=>props.theme.textFaint};
  transition: background ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition};

  &:hover {
    background: ${(props)=>props.theme.accentSoft};
    color: ${(props)=>props.theme.accent};
  }
`
const Maintextdiv=styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.6;
  color: ${(props)=>props.theme.text};
`

export default function ReplyShowUI(props){

    
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
                <Profileimg src={API_BASE+"/userprofileimg/"+data.userprofile}/>
                
              </Profilediv>
              <Maindiv>
                <Headerdiv>
                  <Nicknamediv>
              {data.nickname}
              </Nicknamediv> 
              <Usernamediv>
                {handletext(data.profileid,data.username)}
              </Usernamediv>
              
              <Timediv>
               <Datefor inputdate={data.redtime } colors={"inherit"}/>
               
              </Timediv>
              
             <Usermenudiv ref={menuref} onClick={(e)=>{e.stopPropagation(),setIsmenu(!ismenu)}}>
              <FontAwesomeIcon icon={faEllipsis} size="lg" />
              {ismenu&&
              <CommentMenu commentid={data.id} noticeid={noticeid} page={page} 
                ismenu={setIsmenu} isupdate={Setisupdate} cid={data.cid} cusername={data.username} cprofileid={data.profileid}
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
