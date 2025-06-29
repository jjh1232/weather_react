import { Mutation } from "@tanstack/react-query";
import React, { useState } from "react";
import styled from "styled-components";
import CommentUpdatelogic from "../List/noticeformlist/CommentLogic/CommentUpdatelogic";
import Datefor from "../List/noticeformlist/DateCom/Datefor";
import Button from "./Button";

const Wrapper=styled.div`
  display: flex;
   width: 100%;
   gap: 5px;
   
`
const Profilediv=styled.div`
    position: relative;
  min-height: 55px;
  display: flex;
    
  margin-left: 3px;
  top: 5px;
  padding: 1px;
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
  gap:5px;

`

const MainHeader=styled.div`
  display: flex;
  width: 100%;
  gap:5px;
`
const Nicknamediv=styled.div`
  color:${(props)=>props.theme.text}  ;
`
const Usernamediv=styled.div`
     color:gray;
   position: relative;
   font-size: 13px;
   top: 2px;
`
const Timediv=styled.div`
  
`
const MainButtondiv=styled.div`
  margin-left :  auto;
`
const MainBodydiv=styled.div`

  display: flex;
   width: 100%;
 
top: 25px;
left:64px;
gap: 5px;
`
const MainTextdiv=styled.div`

  width: 100%;
`
const MainTextarea=styled.textarea`
 font-size: 20px;
width: 93%;
`
const UpdateButton=styled.div`
  
`

export default function ReplyUpdateUI(props){

      const {data,Setisupdate,noticeid,page}=props
    
        const [updatecomment,Setupdatecomment]=useState(data.text)
    
        //뮤테이션로직
        const {mutate,isLoading}=CommentUpdatelogic();
        
        const updatehandler=()=>{
    
            mutate({
              commentid:data.id,
              username:data.username,
              text:updatecomment,
              noticeid:noticeid,
              page:page
            },{
              onSuccess:()=>{
                  Setisupdate(false)
              }
            })
        }

    return (
         <Wrapper>
                 <Profilediv>
                   <Profileimg src={process.env.PUBLIC_URL+"/userprofileimg/"+data.userprofile}/>
                 </Profilediv>
                 <Maindiv>
                   <MainHeader>
                   
                          <Nicknamediv>
                           {data.nickname} 
                           </Nicknamediv> 
                           <Usernamediv>
                             {data.username}
                           </Usernamediv>
                           
                           <Timediv>
                           <Datefor inputdate={data.redtime } colors={"gray"}/>
                           
                           </Timediv>
                             <MainButtondiv>
       
                        
                         <Button title="취소" onClick={(e)=>{ e.stopPropagation() 
                           Setisupdate(false)}}/>
                            <Button title="수정완료" onClick={(e)=>{
                             updatehandler();
                         //  Setisupdate(commentupdate(data.id,data.username,updatecomment,e))
                           
                           }}/>
                     </MainButtondiv>
                   </MainHeader>
                   <MainBodydiv>
                     <MainTextdiv>
                   <MainTextarea defaultValue={data.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} /><br/>
                  
                     </MainTextdiv>
                    
                   </MainBodydiv>
       
                  
                 </Maindiv>
                  {//여기플렉스로 두는게맞는듯?
                  }
                     
                   
                        
               </Wrapper>
    )
}