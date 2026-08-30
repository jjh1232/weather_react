import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import ReactDOM from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen as exit } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare as upda } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import Roomnamemodal from "./Roomnamemodal";
import ChatExitmodal from "./Menumodal/ChatExitmodal";
import profileimage from "../../../UI/profileimage";

//=====================================================================
// 채팅방 정보 (방 이름 / 대화상대 / 나가기)
//  - 색·굴곡은 전부 테마 토큰. 예전에는 #525e79 배경에 검은 테두리,
//    border-radius:10% (비율이라 창 크기마다 곡률이 달라짐) 였다.
//  - 폰 프레임(#phone-ui) 안에 그려지므로 absolute + inset 으로 덮는다.
//=====================================================================

const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const popin = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

const Outdiv=styled.div`
    position: absolute;
    inset: 0;
    z-index: 300;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 18px;
    background: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    animation: ${fadein} 140ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Menuwrapper=styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 100%;
    overflow: hidden;
    background: ${(props)=>props.theme.surface};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};
    animation: ${popin} 170ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Header=styled.div`
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px 16px 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Nametag=styled.div`
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: ${(props)=>props.theme.textFaint};
`
//방 이름 + 이름 바꾸기 아이콘
const Roomnamecss=styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    max-width: 100%;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.text};
    text-align: center;
    word-break: break-all;
`
const Roomnameinput=styled.input``

const Nameupdateicon=styled(FontAwesomeIcon)`
    flex: none;
    cursor: pointer;
    font-size: 13px;
    color: ${(props)=>props.theme.textFaint};
    transition: color ${(props)=>props.theme.transition};

    &:hover { color: ${(props)=>props.theme.accent}; }
`
const Body=styled.div`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
`
const Subtag=styled.div`
    flex: none;
    padding: 12px 16px 8px;
    font-size: 12px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
`
const ListTable=styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 8px 8px;

    &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props)=>props.theme.borderStrong};
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;
    }
`
//대화상대 한 줄. 예전에는 회색 테두리 상자가 줄줄이 있어 목록이 시끄러웠다.
const Memberitem=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: ${(props)=>props.theme.radius};
    transition: background ${(props)=>props.theme.transition};

    &:hover { background: ${(props)=>props.theme.surfaceHover}; }
`
const Memberprodiv=styled.div`
    flex: none;
    display: flex;
`
const Memberprofile=styled.img`
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const MemberNamediv=styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
`
const MemberNickname=styled.div`
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const MemberUsername=styled.div`
    font-size: 11.5px;
    color: ${(props)=>props.theme.textMuted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Bottom=styled.div`
    flex: none;
    display: flex;
    justify-content: center;
    padding: 10px 14px 14px;
    border-top: 1px solid ${(props)=>props.theme.border};
`
//되돌릴 수 없는 동작이라 위험색을 쓰되, 평소엔 조용하게 두고 hover 에서만 채운다.
const Outroomdiv=styled.button`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 36px;
    padding: 0 16px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.textMuted};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
        border-color: ${(props)=>props.theme.warning};
        background: rgba(255, 82, 82, 0.08);
        color: ${(props)=>props.theme.warning};
    }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
const Exiticon=styled(FontAwesomeIcon)`
    font-size: 13px;
`
export default function Chatroomlistmenu({setmenuopen,roomdata}){


    const [isroomname,setisroomname]=useState(false);
     const container = document.getElementById("phone-ui");
    
    const rect = container.getBoundingClientRect(); // phone-ui의 화면상 위치/크기
    //즉 뷰포트에서의 절대위치를 줌  이걸뺴면 마우스좌표가 화면내부기준이되는것
    const [isExitpopup,setIsexitpopup]=useState(false);
  // 아직 DOM이 없으면 렌더링하지 않음
  if (!container) return null;


  //멤버목록보기로직


 //채팅방나가기
    const exithandler=(e)=>{
        e.stopPropagation()
        setIsexitpopup(true)
    }

    return ReactDOM.createPortal( //
        <Outdiv onClick={(e)=>{e.stopPropagation(), setmenuopen(false)}}>
        <Menuwrapper>
            <Header>
                <Nametag>
                    방정보
                </Nametag>
                <Roomnamecss>
                   
                   
                    
                     {roomdata.roomtitle}
                    
                    
               
                     <Nameupdateicon icon={upda} onClick={(e)=>{
                        e.stopPropagation()
                        setisroomname(true)}}/>
                </Roomnamecss>
              {isroomname &&<Roomnamemodal beforename={roomdata.roomtitle} memberroomid={roomdata.memberroomid}
                    setisroomname={setisroomname}
              />}
            </Header>
            <Body>
                <Subtag>대화상대 {roomdata.members.length}</Subtag>
                <ListTable>
                                {roomdata.members.map((data)=>
                <Memberitem key={data.email||data.nickname}>
                    <Memberprodiv>
                        {/* 기본 이미지 처리가 profileimage() 안에 이미 있다.
                            여기서 직접 이어붙이면 기본 이미지 경로가 갈라진다. */}
                        <Memberprofile src={profileimage(data.profileurl)}/>
                    </Memberprodiv>
                    <MemberNamediv>
                        <MemberNickname>
                        {data.nickname}
                        </MemberNickname>
                        <MemberUsername>
                         {data.email} 
                        </MemberUsername>
                        
                         
                
                    </MemberNamediv>
              
                
                </Memberitem>)}
                
             
                </ListTable>
            </Body>
                        <Bottom>
                <Outroomdiv type="button" onClick={exithandler}>

                채팅방 나가기
                <Exiticon icon={exit} />

                {isExitpopup &&<ChatExitmodal setisexitpopup={setIsexitpopup}
                 setmenuopen={setmenuopen}
                 roomid={roomdata.roomid}/>}
                </Outroomdiv>
            </Bottom>
        </Menuwrapper>
</Outdiv>
    ,document.getElementById('phone-ui')
    )
}