import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//=====================================================================
// 관리자 화면 어디서든 닉네임/이메일을 누르면 뜨는 바로가기 메뉴.
//
// 예전엔 "이 회원의 글 보기" 같은 게 회원관리 표에만 아이콘으로 있었고,
// 댓글·게시글 목록에서 어떤 사람이 눈에 띄면 이메일을 복사해서
// 다른 화면 검색창에 직접 붙여넣어야 했다.
// 각 관리 화면이 이미 option=email 검색을 지원하므로 그 주소로 보내주면 된다.
//
// 메뉴는 body 로 포털한다. 표(Tablewrap)가 overflow:auto 라 표 안에 그리면
// 잘리거나 표와 같이 스크롤된다.
//=====================================================================

const Trigger=styled.button`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    min-width: 0;
    padding: 1px 4px;
    margin: 0 -4px;
    border: none;
    border-radius: ${(props)=>props.theme.radiusSm};
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.accentSoft};
        color: ${(props)=>props.theme.accent};
    }
    &:focus-visible{
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 1px;
    }

    span{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`
const Sheet=styled.div`
    position: fixed;
    z-index: 300;
    min-width: 208px;
    padding: 6px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadowLg};
`
const Sheethead=styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 6px 8px 8px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    margin-bottom: 4px;
`
const Sheetnick=styled.span`
    font-size: 12.5px;
    font-weight: 700;
    color: ${(props)=>props.theme.text};
`
const Sheetmail=styled.span`
    font-size: 11px;
    color: ${(props)=>props.theme.textFaint};
    word-break: break-all;
`
const Item=styled.button`
    display: block;
    width: 100%;
    padding: 7px 8px;
    border: none;
    border-radius: ${(props)=>props.theme.radiusSm};
    background: none;
    color: ${(props)=>props.theme.textMuted};
    font-size: 12.5px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.accentSoft};
        color: ${(props)=>props.theme.accent};
    }
`

/* 열려 있는 메뉴는 화면에 하나뿐이어야 한다.

   트리거는 onMouseDown 에서 전파를 끊는다(안 끊으면 바깥클릭 닫기가 먼저
   돌아 열리자마자 닫힌다). 그런데 그것 때문에 "다른 닉네임"을 눌렀을 때도
   이미 열려 있던 메뉴가 document 의 mousedown 을 못 받아 안 닫혔다.
   그래서 메뉴가 두 개, 세 개씩 겹쳐 떴다.

   전파에 기대지 말고, 지금 열려 있는 메뉴의 닫기 함수를 모듈에 하나 들고
   있다가 새로 열릴 때 직접 닫는다. */
let closeopened=null;

export default function UserMenu(props){
    //email 은 필수(검색 키), nickname 은 표시용
    const {email,nickname,children}=props;
    const navigate=useNavigate();
    const [pos,setPos]=useState(null);
    const triggerref=useRef(null);

    const open=()=>{
        //다른 곳에 열려 있던 메뉴부터 닫는다
        if(closeopened&&closeopened!==close) closeopened();

        const box=triggerref.current.getBoundingClientRect();
        //화면 오른쪽/아래로 넘치지 않게 잡아준다
        const width=208, height=230;
        setPos({
            left: Math.min(box.left, window.innerWidth-width-12),
            top: box.bottom+6+height>window.innerHeight
                ? Math.max(box.top-height-6, 12)
                : box.bottom+6,
        })
        closeopened=close;
    }
    const close=()=>{
        if(closeopened===close) closeopened=null;
        setPos(null);
    };

    //표가 다시 그려져 이 행이 사라질 때 등록이 남아 있지 않게 한다
    useEffect(()=>()=>{ if(closeopened===close) closeopened=null; },[])

    useEffect(()=>{
        if(!pos) return;
        const onkey=(e)=>{ if(e.key==="Escape") close() }
        //스크롤하면 기준점이 어긋나므로 그냥 닫는다
        const onscroll=()=>close();
        document.addEventListener("mousedown",close)
        document.addEventListener("keydown",onkey)
        window.addEventListener("scroll",onscroll,true)
        window.addEventListener("resize",onscroll)
        return ()=>{
            document.removeEventListener("mousedown",close)
            document.removeEventListener("keydown",onkey)
            window.removeEventListener("scroll",onscroll,true)
            window.removeEventListener("resize",onscroll)
        }
    },[pos])

    const go=(url)=>{ close(); navigate(url) }

    //각 관리 화면이 공통으로 지원하는 option=email 검색으로 보낸다
    const search=(base)=>`${base}?page=1&option=email&keyword=${encodeURIComponent(email)}`;

    const history=()=>{
        close();
        window.open(`/admin/loginhistory?username=${encodeURIComponent(email)}`,"로그인기록",
            "noopener,noreferrer,location=no,menubar=no,toolbar=no,width=620,height=560")
    }

    if(!email) return children||null;

    return (
        <>
            <Trigger ref={triggerref} type="button" title="이 회원 바로가기"
                onClick={(e)=>{
                    //바깥클릭 닫기(mousedown)와 겹치지 않게 전파를 끊는다
                    e.stopPropagation();
                    pos?close():open();
                }}
                onMouseDown={(e)=>e.stopPropagation()}>
                {children}
            </Trigger>

            {pos && ReactDOM.createPortal(
                <Sheet style={{left:pos.left,top:pos.top}}
                    onMouseDown={(e)=>e.stopPropagation()}>
                    <Sheethead>
                        {nickname && <Sheetnick>{nickname}</Sheetnick>}
                        <Sheetmail>{email}</Sheetmail>
                    </Sheethead>

                    <Item type="button" onClick={()=>go(search("/admin/member"))}>회원 정보 보기</Item>
                    <Item type="button" onClick={()=>go(search("/admin/notice"))}>이 회원의 게시글</Item>
                    <Item type="button" onClick={()=>go(search("/admin/comment"))}>이 회원의 댓글</Item>
                    <Item type="button" onClick={()=>go(search("/admin/chatroom"))}>이 회원의 채팅방</Item>
                    <Item type="button" onClick={history}>로그인 기록</Item>
                </Sheet>,
                document.body)}
        </>
    )
}
