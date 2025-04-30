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

const Wrapper=styled.div`
    display: flex;
    padding-left: 6%;
    border: 1px solid red;
    width: 95%;
    
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
const Upanddeletediv=styled.div`
    margin-left: auto;
`
const MainText=styled.div`
    border: 1px solid green;
`

const Profileview=styled.div`
    border:1px solid;
    width:45px;
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
      return 
      css`
      width:95%;
      background: yellow;
  `;
  }

}}

`

function Replycommentitem(props){
const {comment,commentupdate,commentdelete,formstyle}=props
const [isupdate,Setisupdate]=useState(false);
const[loginuser,Setloginuser,removeloginuser]=useCookies();
  const [updatecomment,Setupdatecomment]=useState();
  const navigate=useNavigate();
  const [islogin,Setislogin]=useState(false);
  const url=`/commentupdate`
const axiosinstance=CreateAxios();


  useEffect(()=>{
    if(loginuser.userinfo){
      Setislogin(true)
    }else{
      Setislogin(false)
     
    }
  },[islogin])
  

  return(
            <Wrapper formstyle={formstyle}>
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

            :<div>{/*업데이트폴스구간 */}
             <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%"}}  />
               </Profileview>
            {comment.nickname}님
            @{comment.username}<br/>
            {comment.text}<br/>
            {comment.redtime}<br/>
            
            {islogin && <div> {/*로그인트루구간 */}
            {loginuser.userinfo.username===comment.username? 
            <div>{/*쿠키검사트루구간 */}
            <Button title="수정" onClick={()=>{
                    Setisupdate(true)
            }}/>
             <Button title="삭제" onClick={()=>{
              if(window.confirm("정말로삭제하시겠습니까")){
              Setisupdate(commentdelete(comment.id));
              }
            }}/>
            {/*쿠키검사트루구간종료 */}
             </div>                       
             :""}  {/*쿠키폴스구간종료 */}
             </div>
            }
          {/*로그인구간종료 */}</div>
}
            
          </Wrapper >
  )
}
export default Replycommentitem