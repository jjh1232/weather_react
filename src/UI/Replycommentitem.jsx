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



const Wrapper=styled.div`
   padding-left: 5%;
  display: flex;
//border-bottom:1px solid gray;
//gap: 5px;
//padding-top: 5px;
//padding-bottom: 8px;

`
const ChildWrapper=styled.div`
  border: 1px solid gray;
  width: 100%;
  display: flex;
  gap: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
 
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