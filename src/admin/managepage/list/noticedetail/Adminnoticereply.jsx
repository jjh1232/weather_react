import React, { useRef, useState } from "react";
import AdminNoticecommentupdate from "./Adminnoticecommentupdate";
import styled from "styled-components";
const Wrapper=styled.div`
  position: relative;
  border:2px solid red;
  min-height: 60px;
  
 
`

const Profilediv=styled.div`
 position: absolute;
 top: 0%;
  height: 100%;
  border:1px solid yellow;
  width: 62px;
`
const Profileimg=styled.img`
  
    
    width: 60px;
    height: 57px;
    border: 1px solid black;
`
const Firstline=styled.div`
position: absolute;

left: 65px;
top: 0%;
  width: 93%;
  border: 1px solid black;
  
`
const Textcss=styled.span`
  position: relative;
  border: 1px solid black;
  width: 93%;
  left: 65px;
  top: 30px;

  
  white-space: pre-line;
`

const Bottomdiv=styled.div`

border: 1px solid gray;

height: 30px;

`
export default function Adminnoticereply(props){
    const {comment,commentdelete}=props;
    const [isupdate,setIsupdate]=useState();
    const Textref=useRef();
    const deletecomment=(id)=>{
    
      commentdelete(id)
      
    }
   

    return (
      
              <>
              {isupdate?<>
              <AdminNoticecommentupdate comment={comment} setisupdate={setIsupdate}/>
              </>:
              <Wrapper>
                <Profilediv>
                <Profileimg src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile} />
                </Profilediv>

                <Firstline>
               {comment.nickname}
              {comment.username}
                
              {comment.redtime}
              
              <button onClick={()=>{setIsupdate(!isupdate)}} >댓글수정</button>
            <button onClick={()=>{deletecomment(comment.id)}} >댓글삭제</button>
            
            </Firstline>
           
          
            <Textcss
            ref={Textref}
            >  {comment.text}</Textcss>
            
           
              </Wrapper>}
          
              </>
            )

    
    
}