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

const Wrapper=styled.div`
 
    padding-left: 5%;
   
    max-height: ${(props)=>props.over?"none":"120px"};
    width: 95%;
    transition: max-height 0.3s;
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
const MainDiv=styled.div`
    display: flex;
    flex-direction: column;
   
    flex:1;

    position: relative;
`

const MainHeader=styled.div`
    display: flex;
  
      width: 100%;
    gap: 5px;
`
const Usernamediv=styled.div`
  color:${(props)=>props.theme.text}  ;
`
const Useremaildiv=styled.div`
     color:gray;
   position: relative;
   font-size: 13px;
   top: 2px;
`
const Timediv=styled.div`
   
`
const Usermenudiv=styled.div`
  margin-left: auto;
  margin-right:5px;
  
`


const Maintextdiv=styled.div`
  
`
const Overflowdiv=styled.div`
    
    border: 1px solid blue;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    //pointer-events: none ;//클릭방해;
    color: white;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 16%;
    background: linear-gradient(
    
    rgba(0, 0, 0, 0.7) 100%
  );
`
const Overlayblow=styled.div`
        width: 100%;
    //pointer-events: none ;//클릭방해;
    color: white;
    
    z-index: 1;
    display: flex;
    //flex:1;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 12%;
    margin-top: auto;
    background: linear-gradient(
    
    rgba(0, 0, 0, 0.7) 100%
    );
`

const Profileview=styled.div`
    border:1px solid;
  
    height:45px;
`

const Wrappers=styled.div`

border:0.1px solid;
position: relative;
left: 5%;


${(props)=>{
  switch(props.formstyle){
    case "twitform":
      return css`
      width:95%;
      background: blue;
  `;
    case "noticeform":
      return css`
      width:95%;
      background: yellow;
  `;
  }

}}

`;

const Replediv=styled.div`
    margin-left: auto;
    border: 1px solid red;
`
const Upanddeletediv=styled.div`
    
    border: 1px solid red;
`


function Replycommentitem(props){
const {comment,commentupdate,noticeid,page}=props
const [isupdate,Setisupdate]=useState(false);
const[loginuser,Setloginuser,removeloginuser]=useCookies();
  const [updatecomment,Setupdatecomment]=useState();
  const navigate=useNavigate();
  const [islogin,Setislogin]=useState(false);
  const url=`/commentupdate`
const axiosinstance=CreateAxios();
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
            <>
            {isupdate?<div>{/*업데이트트루구간 */}
            <Profileview>
    <Profileimg   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}/>
               </Profileview>
     
              {comment.nickname}님 @{comment.username}<br/>
            <input type="text" defaultValue={comment.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} /><br/>
            {comment.redtime}<br/>
                  <Button title="수정완료" onClick={(e)=>{
                    
                    Setisupdate(commentupdate(comment.id,comment.username,updatecomment,e))
                  
                  }}
                    />
                  <Button title="취소" onClick={()=>{Setisupdate(false)}}/>
            {/*업데이트트루종료 */}</div>

            :<Wrapper ref={commentref}>{/*업데이트폴스구간 */}
            <Profilediv>
             
    <Profileimg   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}/>
               
               </Profilediv>
               <MainDiv>
               <MainHeader>
               <Usernamediv>
            {comment.nickname}
            </Usernamediv>
            <Useremaildiv>
            {comment.username}
            </Useremaildiv>
            
            
            <Timediv>
              <Datefor inputdate={comment.redtime}/>
            
            </Timediv>
         <Usermenudiv ref={menuref} onClick={(e)=>{e.stopPropagation(),setisMenu(!ismenu)}}>
              <FontAwesomeIcon icon={faEllipsis} size="xl" />
              
              {ismenu&&<CommentMenu  noticeid={noticeid} page={page} commentid={comment.id}
              ismenu={setisMenu} isupdate={Setisupdate} cusername={comment.username}
              textcopy={textcopy} cid={comment.cid}
              />}               
          </Usermenudiv>
            
             </MainHeader>
             <Maintextdiv>
             {comment.text}
             </Maintextdiv>
              
             </MainDiv>
          {/*로그인구간종료 */}</Wrapper >
}
            
          </ >
  )
}
export default Replycommentitem