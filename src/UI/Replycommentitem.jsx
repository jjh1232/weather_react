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

const Wrapper=styled.div`
    display: flex;
    padding-left: 5%;
    border: 1px solid red;
    max-height: ${(props)=>props.over?"none":"120px"};
    width: 95%;
    transition: max-height 0.3s;
    
`

const Profilediv=styled.div`
    border: 1px solid blue;
    width: 50px;
`
const MainDiv=styled.div`
    display: flex;
    flex-direction: column;
    border:1px solid black;
    flex:1;

    position: relative;
`
const MainHeader=styled.div`
    display: flex;
  
    border: 1px solid blue;
    gap: 5px;
`
const Usernamediv=styled.div`
    font-size: 17px;
    color: black;
`
const Useremaildiv=styled.div`
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#353535f4;
`
const Timediv=styled.div`
   
`
const Replediv=styled.div`
    margin-left: auto;
    border: 1px solid red;
`
const Upanddeletediv=styled.div`
    
    border: 1px solid red;
`
const MainText=styled.div`
    border: 1px solid green;
   
   // overflow: hidden;
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
    )
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

function Replycommentitem(props){
const {comment,commentupdate,commentdelete,formstyle}=props
const [isupdate,Setisupdate]=useState(false);
const[loginuser,Setloginuser,removeloginuser]=useCookies();
  const [updatecomment,Setupdatecomment]=useState();
  const navigate=useNavigate();
  const [islogin,Setislogin]=useState(false);
  const url=`/commentupdate`
const axiosinstance=CreateAxios();


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
    if(loginuser.userinfo){
      Setislogin(true)
    }else{
      Setislogin(false)
     
    }
  },[islogin])
  

  return(
            <>
            {isupdate?<div>{/*업데이트트루구간 */}
            <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%"}}  />
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
             <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%",background:"white"}}  />
               </Profileview>
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
            {comment.redtime}
            </Timediv>
            {islogin && <div> {/*로그인트루구간 */}
            {loginuser.userinfo.username===comment.username? 
            <Upanddeletediv>{/*쿠키검사트루구간 */}
            <Button title="수정" onClick={()=>{
                    Setisupdate(true)
            }}/>
             <Button title="삭제" onClick={()=>{
              if(window.confirm("정말로삭제하시겠습니까")){
              Setisupdate(commentdelete(comment.id));
              }
            }}/>
            {/*쿠키검사트루구간종료 */}
             </Upanddeletediv>                       
             :""}  {/*쿠키폴스구간종료 */}
             </div>
            }
             </MainHeader>
             <MainText>
             {comment.text}
             </MainText>
              {isoverflow&&!expanded &&<Overflowdiv onClick={()=>setExpanded(true)}>
                 <FontAwesomeIcon icon={downbutton} size="2x"/>
                 </Overflowdiv>}
                 {expanded &&<Overlayblow onClick={()=>setExpanded(false)}>
                 <FontAwesomeIcon icon={upbutton} size="2x"/>
                 </Overlayblow>}
             </MainDiv>
          {/*로그인구간종료 */}</Wrapper >
}
            
          </ >
  )
}
export default Replycommentitem