import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateAxios from "../../../customhook/CreateAxios";
import styled from "styled-components";
import AdminCalander from "../../../customhook/Admintools/AdminCss/AdminCalander";
import Profilediv from "../../../UI/Modals/Profilediv";
import { Page, Pagehead, Pagetitle, Pagemeta, Headright, Panel, Button, Badge }
    from "../../AdminUI";
import UserMenu from "../../UserMenu";
import { useToast } from "../../../UI/Feedback/FeedbackProvider";

//=====================================================================
// 채팅방 상세(대화 기록 열람).
//
// 예전엔 Sidebar 가 position:fixed(right:24px, bottom:100px)로 화면에 붙어
// 본문과 따로 놀았고, 개설일 h3 에 border:1px solid blue 가, 페이지 맨 아래엔
// 파란 테두리 빈 div 가 디버그 흔적으로 남아 있었다.
// 게시글 상세와 같은 [본문 + 사이드] 2단 grid 로 맞춘다.
//=====================================================================

const Columns=styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 14px;
    align-items: start;

    @media (max-width: 1100px) {
        grid-template-columns: minmax(0, 1fr);
    }
`
const Roominfo=styled(Panel)`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px 16px;
    margin-bottom: 14px;
`
const Roomname=styled.h3`
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    word-break: break-word;
    min-width: 0;
`
const Roommeta=styled.span`
    margin-left: auto;
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
    white-space: nowrap;
`
//대화 기록
const Log=styled(Panel)`
    padding: 12px 14px;
    max-height: calc(100vh - 220px);
    overflow-y: auto;
    min-width: 0;

    @media (max-width: 1100px) {
        max-height: 640px;
    }
`
const Datesection=styled.div`
    & + & { margin-top: 6px; }
`
//날짜 구분선 - 양옆 실선, 가운데 알약
const Dateline=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 12px 0 8px;

    &::before,&::after{
        content: "";
        flex: 1;
        border-bottom: 1px solid ${(props)=>props.theme.border};
    }
`
const Datepill=styled.span`
    flex-shrink: 0;
    padding: 2px 10px;
    border-radius: ${(props)=>props.theme.radiusPill};
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
    font-size: 11.5px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
`
const Chatrow=styled.div`
    display: flex;
    gap: 9px;
    padding: 7px 4px;
    border-radius: ${(props)=>props.theme.radiusSm};
    min-width: 0;

    &:hover{ background: ${(props)=>props.theme.surfaceHover}; }
`
const Avatarbox=styled.div`
    flex: none;
    width: 36px;
    height: 36px;
`
const Chatbody=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
`
const Chathead=styled.div`
    display: flex;
    align-items: baseline;
    gap: 7px;
    min-width: 0;
`
const Sender=styled.span`
    font-size: 12.5px;
    font-weight: 700;
    color: ${(props)=>props.theme.text};
`
const Sendtime=styled.span`
    flex-shrink: 0;
    font-size: 11px;
    color: ${(props)=>props.theme.textFaint};
`
const Message=styled.div`
    font-size: 13.5px;
    line-height: 1.6;
    color: ${(props)=>props.theme.text};
    white-space: pre-wrap;
    word-break: break-word;
`
//입장/퇴장 안내는 대화가 아니라 시스템 메세지다. 가운데 정렬로 구분한다.
const Systemrow=styled.div`
    display: flex;
    justify-content: center;
    padding: 4px 0;
`
const Systemtext=styled.span`
    padding: 3px 12px;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surfaceHover};
    color: ${(props)=>props.theme.textFaint};
    font-size: 11.5px;
`

//사이드 - 참가자 + 달력
const Side=styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;

    position: sticky;
    top: 16px;

    @media (max-width: 1100px) {
        position: static;
    }
`
const Sidehead=styled.div`
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 12px 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    font-size: 13px;
    font-weight: 700;
`
const Memberlist=styled.div`
    max-height: 260px;
    overflow-y: auto;
`
const Memberrow=styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 14px;
    min-width: 0;

    & + & { border-top: 1px solid ${(props)=>props.theme.border}; }
`
const Memberavatar=styled.div`
    flex: none;
    width: 32px;
    height: 32px;
`
const Membermeta=styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
`
const Membernick=styled.span`
    font-size: 12.5px;
    font-weight: 700;
    color: ${(props)=>props.theme.text};
`
const Membermail=styled.span`
    font-size: 11px;
    color: ${(props)=>props.theme.textFaint};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Calendarbox=styled(Panel)`
    padding: 12px 14px;
`
const Statebox=styled.div`
    padding: 40px 16px;
    text-align: center;
    font-size: 13px;
    color: ${(props)=>props.theme.textMuted};
`

//섹션으로 날짜나누기
const makeSection=(chatdata)=>{
    if(!Array.isArray(chatdata)) return {};
    const chatmonth={}
    chatdata.forEach((chat)=>{
        const red=typeof chat?.red==="string"?chat.red:"";
        //들어오는 형식이 "2026.08.28..." 인 경우도 있어 달력 키(YYYY-MM-DD)에 맞춘다
        const monthDate=red?red.substr(0,10).replaceAll(".","-"):"날짜없음";
        if(Array.isArray(chatmonth[monthDate])) chatmonth[monthDate].push(chat)
        else chatmonth[monthDate]=[chat]
    })
    return chatmonth;
}

export default function ChatroomDetail(props){

    const [roomdata,setRoomdata]=useState();
    const [monthchat,setMonthchat]=useState();
    const {roomid}=useParams();
    const axiosintance=CreateAxios();
    const navigate=useNavigate();
    const toast=useToast();

    useEffect(()=>{
        roomdetailget()
    },[roomid])

    const roomdetailget=()=>{
        axiosintance.get(`/admin/room/${roomid}`).then((res)=>{
            setRoomdata(res.data)
            setMonthchat(makeSection(res.data.chatdata))
        }).catch((err)=>{
            toast.error(err)
        })
    }

    /* 달력에서 날짜를 고르면 그 날 첫 메세지로 스크롤한다.
       예전엔 여기서 document.createElement("button") 으로 버튼을 하나 만들고
       onclick 을 붙인 뒤 .click() 을 불러 우회했다. 그냥 바로 부르면 된다. */
    const movetodate=(datekey)=>{
        document.getElementById(datekey)?.scrollIntoView({behavior:"smooth",block:"start"})
    }

    const members=roomdata?.memberlist||[];
    const sections=monthchat?Object.entries(monthchat):[];

    return (
        <Page>
            <Pagehead>
                <Pagetitle>채팅방 상세</Pagetitle>
                <Pagemeta>{roomid}번 방</Pagemeta>
                <Headright>
                    <Button type="button" onClick={()=>navigate("/admin/chatroom")}>목록</Button>
                </Headright>
            </Pagehead>

            {!roomdata
                ? <Statebox>불러오는 중…</Statebox>
                : <Columns>
                    <div style={{minWidth:0}}>
                        <Roominfo>
                            <Roomname>{roomdata.roomname}</Roomname>
                            <Badge>{members.length}명</Badge>
                            <Roommeta>개설 {roomdata.createred}</Roommeta>
                        </Roominfo>

                        <Log>
                            {sections.length===0
                                ? <Statebox>주고받은 대화가 없습니다.</Statebox>
                                : sections.map(([date,chats])=>(
                                    <Datesection key={date} id={date}>
                                        <Dateline><Datepill>{date}</Datepill></Dateline>

                                        {chats.map((chat,key)=>(
                                            chat.messagetype==="System"
                                            ? <Systemrow key={chat.chatid??key}>
                                                <Systemtext>{chat.message}</Systemtext>
                                              </Systemrow>
                                            : <Chatrow key={chat.chatid??key}>
                                                <Avatarbox>
                                                    <Profilediv url={chat.sender.profileurl}/>
                                                </Avatarbox>
                                                <Chatbody>
                                                    <Chathead>
                                                        <UserMenu email={chat.sender.email}
                                                            nickname={chat.sender.nickname}>
                                                            <Sender>{chat.sender.nickname}</Sender>
                                                        </UserMenu>
                                                        <Sendtime>{chat.red.substr(11,5)}</Sendtime>
                                                    </Chathead>
                                                    <Message>{chat.message}</Message>
                                                </Chatbody>
                                              </Chatrow>
                                        ))}
                                    </Datesection>
                                ))}
                        </Log>
                    </div>

                    <Side>
                        <Panel>
                            <Sidehead>참가자 <Badge>{members.length}</Badge></Sidehead>
                            <Memberlist>
                                {members.map((data,key)=>(
                                    <Memberrow key={data.email??key}>
                                        <Memberavatar>
                                            <Profilediv url={data.profileurl}/>
                                        </Memberavatar>
                                        <Membermeta>
                                            <UserMenu email={data.email} nickname={data.nickname}>
                                                <Membernick>{data.nickname}</Membernick>
                                            </UserMenu>
                                            <UserMenu email={data.email} nickname={data.nickname}>
                                                <Membermail>{data.email}</Membermail>
                                            </UserMenu>
                                        </Membermeta>
                                    </Memberrow>
                                ))}
                            </Memberlist>
                        </Panel>

                        <Calendarbox>
                            <AdminCalander currentdate={new Date()}
                                movemethod={movetodate}
                                chatdata={monthchat}/>
                        </Calendarbox>
                    </Side>
                  </Columns>}
        </Page>
    )
}
