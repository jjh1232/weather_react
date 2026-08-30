import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import CreateAxios from "../customhook/CreateAxios";

//=====================================================================
// 알림 목록 (종 아이콘 드롭다운)
//
//  - 로그인 카드(Cardbase)에 overflow:hidden 이 걸려 있어서, 그 안에서 그리면
//    패널이 잘려 보인다. #modal-root 로 포털하고 종 위치를 기준으로 띄운다.
//  - 색·굴곡은 전부 테마 토큰. 예전에는 흰 배경 + 검은/파란 테두리였다.
//=====================================================================

const popin = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Panel=styled.div`
    position: fixed;
    z-index: 9998;
    width: 340px;
    max-width: calc(100vw - 24px);
    max-height: 440px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${(props)=>props.theme.surface};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};
    animation: ${popin} 150ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Header=styled.div`
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 13px 12px 12px 16px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Title=styled.span`
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
`
const Countchip=styled.span`
    font-size: 11.5px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.accentSoft};
    color: ${(props)=>props.theme.accent};
`
const Closebutton=styled.button`
    margin-left: auto;
    flex: none;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: none;
    color: ${(props)=>props.theme.textFaint};
    cursor: pointer;

    &:hover { background: ${(props)=>props.theme.surfaceHover}; color: ${(props)=>props.theme.text}; }
    &:focus-visible { outline: 2px solid ${(props)=>props.theme.accent}; outline-offset: 1px; }
`
const List=styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
`
//안 읽은 알림은 왼쪽에 점 하나로 표시한다. 배경을 물들이면 목록이 시끄러워진다.
const Row=styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition};

    &:last-child { border-bottom: 0; }
    &:hover { background: ${(props)=>props.theme.surfaceHover}; }
`
const Unreaddot=styled.span`
    flex: none;
    width: 7px;
    height: 7px;
    margin-top: 7px;
    border-radius: 50%;
    background: ${(props)=>props.$unread?props.theme.accent:"transparent"};
`
const Rowbody=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
`
const Message=styled.span`
    font-size: 13.5px;
    line-height: 1.5;
    color: ${(props)=>props.$unread?props.theme.text:props.theme.textMuted};
    font-weight: ${(props)=>props.$unread?600:400};
    word-break: break-word;

    /* 이미 쌓인 알림들은 제목이 통째로 들어 있어 네 줄씩 차지한다.
       서버에서 자르는 건 앞으로 생길 것부터라, 화면에서도 두 줄로 막는다. */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`
const Timetext=styled.span`
    font-size: 11.5px;
    color: ${(props)=>props.theme.textFaint};
`
const Statebox=styled.div`
    padding: 44px 20px;
    text-align: center;
    font-size: 13.5px;
    line-height: 1.6;
    color: ${(props)=>props.theme.textMuted};
`
const Footer=styled.div`
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 9px;
    border-top: 1px solid ${(props)=>props.theme.border};
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};
`
const Pagebutton=styled.button`
    height: 26px;
    padding: 0 10px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.textMuted};
    font-size: 12px;
    cursor: pointer;

    &:hover:not(:disabled) { background: ${(props)=>props.theme.surfaceHover}; color: ${(props)=>props.theme.text}; }
    &:disabled { opacity: 0.4; cursor: default; }
`

//저장된 시각 문자열을 상대 시간으로 바꾼다.
//DB 에 두 가지 형식이 섞여 있다.
//  현재  : "2026.08.27/18:14:5"   (BaseTime 의 포맷, 초가 한 자리)
//  예전  : "2025-04-26 18:14:55"  (그 전에 쌓인 데이터)
//둘 다 읽어야 옛 알림도 "1년 전"으로 보인다.
function parsestamp(red){
    const text=String(red).trim();

    let m=text.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})\/(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if(!m) m=text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{1,2}):(\d{1,2})/);
    if(!m) return null;

    return new Date(+m[1], +m[2]-1, +m[3], +m[4], +m[5], +m[6]);
}

function relativetime(red){
    if(!red) return "";
    const when=parsestamp(red);
    if(!when || isNaN(when.getTime())) return red;

    const diff=(Date.now()-when.getTime())/1000;

    if(diff<60) return "방금";
    if(diff<3600) return `${Math.floor(diff/60)}분 전`;
    if(diff<86400) return `${Math.floor(diff/3600)}시간 전`;
        if(diff<86400*7) return `${Math.floor(diff/86400)}일 전`;
    if(diff<86400*365) return `${when.getMonth()+1}월 ${when.getDate()}일`;
    return `${when.getFullYear()}년 ${when.getMonth()+1}월 ${when.getDate()}일`;
}

export default function UserNotification(props){
    const {anchorref,onClose}=props;

    const axiosinstance=CreateAxios();
    const navigate=useNavigate();
    const queryclient=useQueryClient();
    const panelref=useRef(null);

    const [currentpage,setCurrentpage]=useState(1);
    const [pos,setPos]=useState({top:0,right:0});

    //종 아이콘 바로 아래, 오른쪽 끝을 맞춰서 띄운다.
    useLayoutEffect(()=>{
        const el=anchorref?.current;
        if(!el) return;
        const rect=el.getBoundingClientRect();
        setPos({
            top:rect.bottom+10,
            right:Math.max(12, window.innerWidth-rect.right)
        });
    },[anchorref])

    //바깥 클릭 / Esc 로 닫기
    useEffect(()=>{
        const onmousedown=(e)=>{
            if(panelref.current && panelref.current.contains(e.target)) return;
            if(anchorref?.current && anchorref.current.contains(e.target)) return; //종은 토글이 직접 처리
            onClose && onClose();
        }
        const onkey=(e)=>{ if(e.key==="Escape") onClose && onClose(); }
        document.addEventListener("mousedown",onmousedown);
        window.addEventListener("keydown",onkey);
        return ()=>{
            document.removeEventListener("mousedown",onmousedown);
            window.removeEventListener("keydown",onkey);
        }
    },[anchorref,onClose])

    const {data:notifidata,isLoading,error,isSuccess}=useQuery({
        queryKey:["notificationdata",currentpage],
        queryFn:async() =>{
          //예전에는 page 를 안 보내서 2페이지 이후가 늘 1페이지였다.
          const res= await axiosinstance.get("/notification",{params:{page:currentpage}})
          return res.data;
        }
    })

    const notifiRead=useMutation({
        mutationFn:async()=>{
            await axiosinstance.post("/notification/readall");
        },
        onSuccess:()=>{
            //헤더의 안 읽음 배지도 같이 0 으로 맞춘다.
            queryclient.invalidateQueries({queryKey:["notificount"]});
        }
    })

    useEffect(()=>{
        if(isSuccess&&notifidata){
            notifiRead.mutate();
        }
        //목록을 열어 본 순간 읽음 처리한다. 한 번만 돌면 된다.
    },[isSuccess,notifidata])

    const gotonotice=(noticeid)=>{
        if(!noticeid) return;
        onClose && onClose();
        navigate(`/notice/detail/${noticeid}`);
    }

    const list=notifidata?.content||[];
    const totalpages=notifidata?.totalpages||1;
    const unreadcount=list.filter((d)=>!d.isread).length;

    const portaltarget=document.getElementById("modal-root")||document.body;

    return ReactDom.createPortal(
        <Panel ref={panelref} style={{top:pos.top,right:pos.right}}
               role="dialog" aria-label="알림">

            <Header>
                <Title>알림</Title>
                {unreadcount>0 && <Countchip>새 알림 {unreadcount}</Countchip>}
                <Closebutton type="button" aria-label="닫기" onClick={()=>onClose&&onClose()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 7 17 17M17 7 7 17" fill="none" stroke="currentColor"
                              strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                </Closebutton>
            </Header>

            <List>
                {isLoading && <Statebox>불러오는 중...</Statebox>}
                {error && <Statebox>알림을 불러오지 못했습니다.</Statebox>}
                {isSuccess && list.length===0 &&
                    <Statebox>아직 받은 알림이 없습니다.<br/>새 댓글이 달리면 여기에 표시됩니다.</Statebox>}

                {list.map((data)=>(
                    <Row key={data.id} onClick={()=>gotonotice(data.noticeid)}>
                        <Unreaddot $unread={!data.isread}/>
                        <Rowbody>
                            <Message $unread={!data.isread}>{data.message}</Message>
                            <Timetext>{relativetime(data.red)}</Timetext>
                        </Rowbody>
                    </Row>
                ))}
            </List>

            {totalpages>1 &&
            <Footer>
                <Pagebutton type="button" disabled={currentpage<=1}
                    onClick={()=>setCurrentpage((p)=>Math.max(1,p-1))}>이전</Pagebutton>
                <span>{currentpage} / {totalpages}</span>
                <Pagebutton type="button" disabled={currentpage>=totalpages}
                    onClick={()=>setCurrentpage((p)=>Math.min(totalpages,p+1))}>다음</Pagebutton>
            </Footer>}

        </Panel>
    , portaltarget)
}
