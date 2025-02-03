import React, { useRef, useState } from "react";
import AdminNoticecommentupdate from "./Adminnoticecommentupdate";
import styled from "styled-components";
const Wrapper=styled.div`
  position: relative;
  border:2px solid red;
  min-height: 80px;
  height: auto;
  margin: 1px solid red;
  box-sizing: border-box;
  
`

const Profilediv=styled.div`
 position: relative;
 top: 0%;
  height: 100%;
  margin:1px solid yellow;
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
  height: 30px;
  border: 1px solid black;
  overflow: hidden;
  float: left;
  box-sizing: border-box;
`
const Textcss=styled.span`
  position: relative;
  border: 1px solid black;
  width: 93%;
  left: 68px;
  bottom: 32px;
  white-space: pre-wrap;
  
  
`
const Nickcss=styled.h3`
  position: relative;
  bottom: 0px;
 // float: left;
  border: 1px solid yellow;
  display:inline;


`
const Usernamecss=styled.h4`
position: relative;
border: 1px solid green;
  width: fit-content;
 // float: left;
  display:inline;

`
const Statecss=styled.div`
position: relative;
  float: right;
  width: fit-content;
`

const Timecss=styled.div`
  position: relative;
  text-align: right;
  bottom: 0%;
  border: 1px solid blue;
  
  
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
                  <Nickcss>
               {comment.nickname}
               </Nickcss>
               <Usernamecss>
              {comment.username}
              </Usernamecss>
              
              <Statecss>
              <button onClick={()=>{setIsupdate(!isupdate)}} >댓글수정</button>
            <button onClick={()=>{deletecomment(comment.id)}} >댓글삭제</button>
            </Statecss>

            </Firstline>
           
          
            <Textcss
            ref={Textref}
            >  {comment.text}</Textcss>
            
            <Timecss>
              {comment.redtime}
              </Timecss>


              </Wrapper>}
          
              </>
            )

    
    
}