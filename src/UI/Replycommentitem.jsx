import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useEffect } from "react";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
import { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown as downbutton } from "@fortawesome/free-solid-svg-icons";
import { faCaretUp as upbutton } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import CommentMenu from "./Buttonlist/CommentMenu";
import Datefor from "../List/noticeformlist/DateCom/Datefor";
import ReplyUpdateUI from "./ReplyUpdateUI";
import ReplyShowUI from "./ReplyShowUI";


/* 대댓글 줄.
   예전엔 padding-left 를 %로 줘서 화면 폭에 따라 들여쓰기가 들쭉날쭉했다.
   px 로 고정하고, 왼쪽에 세로선을 그어 "어느 댓글에 달린 답글인지" 보이게 한다. */
const Wrapper=styled.div`
  position: relative;
  display: flex;
  padding: 4px 0 4px 44px;

  /* 부모 댓글의 프로필 중앙(약 28px)에 맞춘 스레드 라인 */
  &::before {
    content: "";
    position: absolute;
    left: 27px;
    top: 0;
    bottom: 0;
    width: 2px;
    border-radius: 2px;
    background: ${(props)=>props.theme.border};
  }
`
const ChildWrapper=styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  background: ${(props)=>props.theme.surfaceAlt};
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radius};
  transition: background ${(props)=>props.theme.transition},
              border-color ${(props)=>props.theme.transition};

  &:hover {
    border-color: ${(props)=>props.theme.borderStrong};
  }
`

function Replycommentitem(props){
const {comment,noticeid,page}=props
const [isupdate,Setisupdate]=useState(false);

const menuref=useRef(null)
const [ismenu,setisMenu]=useState(false)

//접기늘리기버튼
const commentref=useRef(null);
const [isoverflow,setIsoverflow]=useState(false);
const [expanded,setExpanded]=useState(false);


useEffect(()=>{
if(commentref.current){
    //비교
    setIsoverflow(commentref.current.scrollHeight>commentref.current.clientHeight);

}


},[isoverflow,expanded])


useEffect(()=>{
  const menuhandler=(e)=>{
      if(ismenu&&menuref.current&&!menuref.current.contains(e.target)){
        setisMenu(false)
      }
    }
      document.addEventListener("mousedown",menuhandler)
      return ()=>{
        document.removeEventListener("mousedown",menuhandler)
      }
  


},[ismenu])
  
 const textcopy=async ()=>{
    await navigator.clipboard.writeText(comment.text)
    alert("댓글이 복사되었습니다")
  }

  return(
            <Wrapper>
            {isupdate?
               <ChildWrapper>
            {/*업데이트트루구간 */}
           <ReplyUpdateUI data={comment} Setisupdate={Setisupdate} noticeid={noticeid} page={page}/>
           
            {/*업데이트트루종료 */}
          </ChildWrapper>
            :
            
            <ChildWrapper ref={commentref}>
           <ReplyShowUI data={comment} Setisupdate={Setisupdate} noticeid={noticeid} page={page}/>
          {/*로그인구간종료 */}
          </ChildWrapper>
          
}
            
          </Wrapper>
  )
}
export default Replycommentitem
