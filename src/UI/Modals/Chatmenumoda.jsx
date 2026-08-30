import React, { forwardRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen as exiticon } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus as inviteicon } from "@fortawesome/free-solid-svg-icons";
import ChatFollowlistmodal from "./ChatFollowlistmodal";
import Profilediv from "./Profilediv";
import ChatExitmodal from "../../List/noticeformlist/DateCom/Menumodal/ChatExitmodal";

//=====================================================================
// 채팅방 설정 메뉴 (오른쪽에서 밀려 들어오는 서랍)
//  - 예전엔 흰 배경에 red/green/blue/black 테두리, 바닥엔 노란 띠였다.
//    전부 테마 토큰으로 바꿔서 폰 UI(chatex)와 같은 톤이 된다.
//  - 폰 프레임(#phone-ui) 안을 덮으므로 좌표는 absolute + inset:0.
//  - 바깥클릭 닫기는 chatex 의 menuclose 가 .chatroommenu 로 판단한다.
//    closest() 로 조상까지 훑으므로 최상위 몇 곳에만 붙이면 된다.
//=====================================================================

const fadein=keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const slidein=keyframes`
  from { opacity: 0; transform: translateX(14%); }
  to   { opacity: 1; transform: translateX(0); }
`

const Modal=styled.div`
    position: absolute;
    inset: 0;
    z-index: 300;
    display: flex;
    justify-content: flex-end;
    background: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    animation: ${fadein} 140ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
//서랍 본체. float:right 대신 위 flex 가 오른쪽으로 붙인다.
const Modalbody=styled.div.attrs({className:"chatroommenu"})`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 76%;
    min-width: 208px;
    height: 100%;
    background: ${(props)=>props.theme.surface};
    border-left: 1px solid ${(props)=>props.theme.border};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};
    animation: ${slidein} 180ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Headercss=styled.div`
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 13px 14px 12px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Nametag=styled.div`
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: ${(props)=>props.theme.textFaint};
`
const Roomname=styled.div`
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Membercount=styled.div`
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};
`
//"유저목록" 이라고 맨몸으로 떠 있던 글자 + 초대 버튼 줄
const Listhead=styled.div`
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 12px 8px;
`
const Subtag=styled.div`
    font-size: 12px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
`
const InviteButton=styled.button`
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 28px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.accentSoft};
    color: ${(props)=>props.theme.accent};
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
        background: ${(props)=>props.theme.accent};
        color: #fff;
    }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
const UserDiv=styled.div`
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
//대화상대 한 줄. 예전엔 검은 테두리 상자가 줄줄이 있어 목록이 시끄러웠다.
const Userlistcss=styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 8px;
    border-radius: ${(props)=>props.theme.radius};
    transition: background ${(props)=>props.theme.transition};

    &:hover { background: ${(props)=>props.theme.surfaceHover}; }
`
const Profilecss=styled.div`
    flex: none;
    width: 34px;
    height: 34px;
`
const Username=styled.div`
    min-width: 0;
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Bottom=styled.div`
    flex: none;
    display: flex;
    justify-content: center;
    padding: 10px 12px 12px;
    border-top: 1px solid ${(props)=>props.theme.border};
`
//되돌릴 수 없는 동작이라 위험색을 쓰되, 평소엔 조용하게 두고 hover 에서만 채운다.
const Outroomdiv=styled.button`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 34px;
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
const Icon=styled(FontAwesomeIcon)`
    font-size: 12.5px;
`
//컴포넌트에 ref를 주기위해선 forwardref로 생성해야함!
const Chatmenumoda=forwardRef((props,ref)=>{

    const {roomdata,invite,setmenuopen,onexitroom}=props;

    const [invitelist,setInvitelist]=useState(false);
    const [ischatroomout,setIschatroomout]=useState(false);

    //chatex 가 안 넘겨줄 수도 있어 없으면 아무것도 안 하게 둔다
    const closemenu=setmenuopen||(()=>{});

    const isinvite=(e)=>{
        e.preventDefault()
        setInvitelist(true)
    }

    const followmodalclose=()=>{
        setInvitelist(false)
    }

    const isinvitehandler=()=>{
        setInvitelist((prev)=>!prev)
    }

    //채팅방나가기 - 확인창은 ChatExitmodal 이 맡는다(나가기 요청/캐시 갱신 포함).
    //예전엔 여기 안에 axiosinstance 도 없는 exit() 와, 버튼이 없어 아무것도
    //누를 수 없는 "정말로나가시겠습니까?" 상자만 있었다.
    const ischatoutmodal=(e)=>{
        e.stopPropagation()
        setIschatroomout(true)
    }

    return (
        <Modal>
            <Modalbody ref={ref} className="chatroommenu">
                <Headercss>
                    <Nametag>방 정보</Nametag>
                    <Roomname>{roomdata.roomname}</Roomname>
                    <Membercount>대화상대 {roomdata.memberlist.length}명</Membercount>
                </Headercss>

                <Listhead>
                    <Subtag>대화상대</Subtag>
                    <InviteButton className="chatroommenu" type="button"
                        onClick={(e)=>isinvite(e)}>
                        <Icon icon={inviteicon}/>
                        초대하기
                    </InviteButton>
                </Listhead>

                <UserDiv className="chatroommenu">
                    {roomdata.memberlist.map((data)=>(
                        <Userlistcss className="chatroommenu" key={data.userid||data.email}>
                            <Profilecss>
                                <Profilediv url={data.profileurl}/>
                            </Profilecss>
                            <Username>{data.nickname}</Username>
                        </Userlistcss>
                    ))}
                </UserDiv>

                <Bottom>
                    <Outroomdiv className="chatroommenu" type="button" onClick={ischatoutmodal}>
                        채팅방 나가기
                        <Icon icon={exiticon}/>
                    </Outroomdiv>
                </Bottom>
            </Modalbody>

            {/* roomdata.namelist 는 Roominfo 에 없는 필드라 늘 undefined 였고,
                초대창이 열리자마자 roomusers.length 에서 터졌다. 실제로 있는 건 memberlist. */}
            {invitelist&&<ChatFollowlistmodal close={followmodalclose} roomid={roomdata.roomid}
                roomusers={roomdata.memberlist} invite={invite} isinvitelist={isinvitehandler}
            />}

            {/* #phone-ui 로 포털되므로 서랍 바깥이다. .chatroommenu 를 얹어야
                확인창을 누르는 순간 바깥클릭으로 판정돼 메뉴가 닫히는 일이 없다. */}
            {ischatroomout&&
            <ChatExitmodal className="chatroommenu"
                setisexitpopup={setIschatroomout}
                setmenuopen={closemenu}
                onexited={onexitroom}
                roomid={roomdata.roomid}/>}
        </Modal>
    )
})

export default Chatmenumoda;
