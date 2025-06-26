import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../UI/Button";
import Datefor from "./DateCom/Datefor";

const Wrapper=styled.div`
  display: flex;
   width: 100%;
`
const Profilediv=styled.div`
    position: relative;
  min-height: 55px;
  display: flex;
    
  margin-left: 3px;
  top: 5px;
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
const MainBodydiv=styled.div`

  display: flex;
   width: 100%;
 
top: 25px;
left:64px;
`
const MainTextdiv=styled.div`

  width: 100%;
`
const MainTextarea=styled.textarea`
 font-size: 20px;
width: 100%;
`
const MainButtondiv=styled.div`
  
`



export default function Commentupdateitem(props){
    const {data,Setisupdate,noticeid,page}=props

    const [updatecomment,Setupdatecomment]=useState(data.text)


    
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
            </MainHeader>
            <MainBodydiv>
              <MainTextdiv>
            <MainTextarea defaultValue={data.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} /><br/>
           
              </MainTextdiv>
              <MainButtondiv>

                  <Button title="수정완료" onClick={(e)=>{
                    
                  //  Setisupdate(commentupdate(data.id,data.username,updatecomment,e))
                    
                    }}/>
                  <Button title="취소" onClick={(e)=>{ e.stopPropagation() 
                    Setisupdate(false)}}/>
              </MainButtondiv>
            </MainBodydiv>
          </Maindiv>
           
              
            
                 
        </Wrapper>
    )
}