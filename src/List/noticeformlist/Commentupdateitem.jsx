import React, { useState } from "react";
import styled from "styled-components";
import Datefor from "./DateCom/Datefor";
import { handletext } from "../../customhook/Userhandle";
import CommentUpdatelogic from "./CommentLogic/CommentUpdatelogic";
import profileimage from "../../UI/profileimage";

/* ─────────────────────────────────────────────────────────────
   댓글 수정 모드
   - 읽기 모드(Commentview)와 위치가 어긋나지 않게 프로필/헤더 크기를 맞췄다.
   - 예전엔 공용 Button(흰 배경 회색 글씨)을 썼는데 "수정완료"가 눌러야 할
     버튼처럼 보이지 않아서, 여기서만 쓰는 버튼 두 개를 따로 뒀다.
   ───────────────────────────────────────────────────────────── */

const Wrapper=styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
`
const Profilediv=styled.div`
  flex-shrink: 0;
  display: flex;
`
const Profileimg=styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  flex-shrink: 0;    // flex item이 줄어들거나 늘어나지 않게 고정
  flex-grow: 0;
  border: 1px solid ${(props)=>props.theme.border};
  background: ${(props)=>props.theme.surfaceAlt};
`
const Maindiv=styled.div`
  display: flex;
  flex-direction:column;
  width: 100%;
  min-width: 0;
  gap: 6px;
`

const MainHeader=styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 6px;
  min-height: 26px;
`
const Nicknamediv=styled.div`
  color: ${(props)=>props.theme.text};
  font-size: 14px;
  font-weight: 650;
  letter-spacing: -0.02em;
  white-space: nowrap;
`
const Usernamediv=styled.div`
   color: ${(props)=>props.theme.textMuted};
   font-size: 13px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   min-width: 0;
`
const Timediv=styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: ${(props)=>props.theme.textFaint};
  white-space: nowrap;

  &::before { content: "·"; }
`
const MainButtondiv=styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`
const MainBodydiv=styled.div`
  display: flex;
  width: 100%;
`
const MainTextdiv=styled.div`
  width: 100%;
`
const MainTextarea=styled.textarea`
  width: 100%;
  min-height: 80px;
  resize: vertical;
  padding: 10px 12px;
  font-size: 14.5px;
  line-height: 1.6;
  color: ${(props)=>props.theme.text};
  background: ${(props)=>props.theme.surfaceAlt};
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusSm};
  outline: none;
  transition: border-color ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition};

  &:focus {
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
  }
`
/* 취소 - 테두리만 있는 보조 버튼 */
const Cancelbutton=styled.button`
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusPill};
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props)=>props.theme.textMuted};
  background: ${(props)=>props.theme.surface};
  transition: background ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition};

  &:hover {
    background: ${(props)=>props.theme.surfaceHover};
    color: ${(props)=>props.theme.text};
  }
`
/* 수정완료 - 이 화면의 주 행동 */
const Submitbutton=styled.button`
  border: none;
  border-radius: ${(props)=>props.theme.radiusPill};
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: ${(props)=>props.theme.accent};
  transition: background ${(props)=>props.theme.transition},
              opacity ${(props)=>props.theme.transition};

  &:hover:not(:disabled) { background: ${(props)=>props.theme.accentHover}; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`



export default function Commentupdateitem(props){
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
            <Profileimg src={profileimage(data.userprofile)}/>
          </Profilediv>
          <Maindiv>
            <MainHeader>
            
                   <Nicknamediv>
                    {data.nickname} 
                    </Nicknamediv> 
                    <Usernamediv>
                      {handletext(data.profileid,data.username)}
                    </Usernamediv>
                    
                    <Timediv>
                    <Datefor inputdate={data.redtime } colors={"inherit"}/>
                    
                    </Timediv>
                      <MainButtondiv>

                 
                  <Cancelbutton type="button" onClick={(e)=>{ e.stopPropagation() 
                    Setisupdate(false)}}>취소</Cancelbutton>
                     <Submitbutton type="button"
                      disabled={!updatecomment||updatecomment.trim().length===0}
                      onClick={(e)=>{
                      e.stopPropagation();
                      updatehandler();
                    
                    }}>수정완료</Submitbutton>
              </MainButtondiv>
            </MainHeader>
            <MainBodydiv>
              <MainTextdiv>
            <MainTextarea defaultValue={data.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} />
           
              </MainTextdiv>
             
            </MainBodydiv>

           
          </Maindiv>
              
            
                 
        </Wrapper>
    )
}
