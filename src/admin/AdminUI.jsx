import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

//=====================================================================
// 관리자 화면 공용 조각.
//
// 예전에는 화면마다 position:absolute + width:1000px + border:1px solid black
// 을 각자 적어놔서, 창 크기를 바꾸면 표가 화면 밖으로 나가고 화면마다
// 여백·글씨 크기가 다 달랐다. 여기 있는 것만 조합해서 쓴다.
//
// 색은 전부 테마 토큰이라 시간대에 따라 다크모드가 그대로 따라온다.
//=====================================================================

//화면 하나. 좌측 네비를 뺀 나머지 영역을 채운다.
export const Page=styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
`
//제목줄. 제목 + 건수 왼쪽, 버튼·검색 오른쪽.
export const Pagehead=styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
`
export const Pagetitle=styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.text};
`
//"총 128건 · 13페이지" 같은 부가 정보
export const Pagemeta=styled.span`
    font-size: 12.5px;
    color: ${(props)=>props.theme.textMuted};
`
//제목줄 안에서 오른쪽으로 밀어내는 자리
export const Headright=styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`
//카드. 표나 폼을 담는다.
export const Panel=styled.div`
    background: ${(props)=>props.theme.surface};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    box-shadow: ${(props)=>props.theme.shadowSm};
    color: ${(props)=>props.theme.text};
    overflow: hidden;
`
//표는 열이 많아 좁은 화면에서 반드시 넘친다.
//페이지 전체가 가로로 밀리지 않도록 표만 따로 스크롤시킨다.
export const Tablewrap=styled.div`
    width: 100%;
    overflow-x: auto;

    &::-webkit-scrollbar { height: 10px; }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props)=>props.theme.borderStrong};
        border-radius: 999px;
        border: 3px solid transparent;
        background-clip: padding-box;
    }
`
export const Table=styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    color: ${(props)=>props.theme.text};
`
//머리줄. 예전엔 rgb(44,44,44) 에 흰 글씨라 다크모드에서 붕 떠 보였다.
export const Th=styled.th`
    padding: 11px 12px;
    text-align: ${(props)=>props.$align||"left"};
    white-space: nowrap;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${(props)=>props.theme.textMuted};
    background: ${(props)=>props.theme.surfaceAlt};
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
export const Tr=styled.tr`
    transition: background ${(props)=>props.theme.transition};

    &:hover { background: ${(props)=>props.theme.surfaceHover}; }
`
//칸마다 테두리를 두르면 눈이 아프다. 줄 구분선만 남긴다.
export const Td=styled.td`
    padding: 10px 12px;
    text-align: ${(props)=>props.$align||"left"};
    vertical-align: ${(props)=>props.$valign||"middle"};
    border-bottom: 1px solid ${(props)=>props.theme.border};
    line-height: 1.45;
`
//길어질 수 있는 칸(제목·본문). 지정한 줄 수에서 자른다.
export const Clamp=styled.div`
    display: -webkit-box;
    -webkit-line-clamp: ${(props)=>props.$lines||2};
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
`
//눌러서 이동하는 칸
export const Linkcell=styled.span`
    cursor: pointer;
    color: ${(props)=>props.theme.text};
    transition: color ${(props)=>props.theme.transition};

    &:hover { color: ${(props)=>props.theme.accent}; text-decoration: underline; }
`
//날짜처럼 폭이 일정해야 읽기 쉬운 값
export const Mono=styled.span`
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;
`
//=====================================================================
// 버튼 - 예전엔 backcolor="red" / "blue" / "green" 을 직접 넘겨서
// 다크모드든 라이트든 원색 그대로였다. 역할별로 정리한다.
//   primary : 주요 동작(추가·저장)
//   ghost   : 보조 동작(수정·보기)  - 평소엔 조용하다
//   danger  : 삭제. 평소엔 조용하고 hover 에서만 붉게 찬다.
//=====================================================================
export const Button=styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: ${(props)=>props.$small?"28px":"32px"};
    padding: 0 ${(props)=>props.$small?"10px":"14px"};
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: ${(props)=>props.$small?"12px":"13px"};
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    ${(props)=>{
        if(props.$variant==="primary") return `
            border: 1px solid transparent;
            background: ${props.theme.accent};
            color: #fff;
            &:hover { background: ${props.theme.accentHover}; }
        `;
        if(props.$variant==="danger") return `
            border: 1px solid ${props.theme.border};
            background: ${props.theme.surface};
            color: ${props.theme.textMuted};
            &:hover {
                border-color: ${props.theme.warning};
                background: rgba(255, 82, 82, 0.10);
                color: ${props.theme.warning};
            }
        `;
        return `
            border: 1px solid ${props.theme.border};
            background: ${props.theme.surface};
            color: ${props.theme.textMuted};
            &:hover {
                background: ${props.theme.surfaceHover};
                color: ${props.theme.text};
            }
        `;
    }}

    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
    &:disabled { opacity: 0.5; cursor: default; }
`
//표 안의 작은 아이콘 버튼(검색으로 넘어가기 등)
export const Iconbutton=styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: ${(props)=>props.theme.radiusSm};
    background: none;
    color: ${(props)=>props.theme.textFaint};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
        background: ${(props)=>props.theme.accentSoft};
        color: ${(props)=>props.theme.accent};
    }
`
//숫자 + 바로가기 아이콘을 한 칸에 담을 때
export const Countcell=styled.div`
    display: inline-flex;
    align-items: center;
    gap: 4px;
`
//권한·가입경로 같은 짧은 분류값
export const Badge=styled.span`
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 8px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;

    ${(props)=>props.$tone==="accent"
        ? `background:${props.theme.accentSoft}; color:${props.theme.accent};`
        : `background:${props.theme.surfaceAlt}; color:${props.theme.textMuted};
           border:1px solid ${props.theme.border};`}
`
const Emptycell=styled.td`
    padding: 44px 12px;
    text-align: center;
    font-size: 13px;
    color: ${(props)=>props.theme.textMuted};
`
//목록이 비었을 때. 예전엔 아무것도 안 그려서 표 머리줄만 덩그러니 남았다.
export function Emptyrow({colspan,children}){
    return (
        <tbody>
            <tr><Emptycell colSpan={colspan}>{children||"표시할 내용이 없습니다"}</Emptycell></tr>
        </tbody>
    )
}
//=====================================================================
// 페이지 이동
// 공용 Pagenation 은 게시글 화면(Noticedetailre)도 같이 쓰고 있어서 건드리지 않고,
// 관리자용으로 따로 둔다. 예전 것은 검색 중에 페이지를 넘기면
// keyword 를 searchtext 라는 이름으로 붙여보내서 검색어가 통째로 날아갔다.
//=====================================================================
const Paging=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding: 4px 0 8px;
`
const Pagebutton=styled.button`
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border-radius: ${(props)=>props.theme.radiusSm};
    font-size: 13px;
    font-weight: ${(props)=>props.$current?700:500};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    ${(props)=>props.$current
        ? `border:1px solid transparent; background:${props.theme.accent}; color:#fff;`
        : `border:1px solid ${props.theme.border}; background:${props.theme.surface};
           color:${props.theme.textMuted};
           &:hover{ background:${props.theme.surfaceHover}; color:${props.theme.text}; }`}

    &:disabled { opacity: 0.4; cursor: default; }
`
export function Adminpaging({totalpage,querydata,url}){

    const navigate=useNavigate();
    const total=totalpage||1;
    const current=querydata.page||1;

    //현재 페이지를 가운데 두고 최대 9개.
    const half=4;
    let start=Math.max(1,current-half);
    let end=Math.min(total,start+half*2);
    start=Math.max(1,end-half*2);

    const pages=[];
    for(let i=start;i<=end;i++) pages.push(i);

    const go=(page)=>{
        //검색 조건은 그대로 들고 간다. 이름도 화면이 읽는 이름(keyword)과 맞춘다.
        const params=new URLSearchParams();
        params.set("page",page);
        if(querydata.option) params.set("option",querydata.option);
        if(querydata.keyword) params.set("keyword",querydata.keyword);
        navigate(`${url}?${params.toString()}`);
    }

    if(total<=1) return null;

    return (
        <Paging>
            <Pagebutton type="button" onClick={()=>go(1)} disabled={current===1}>처음</Pagebutton>
            <Pagebutton type="button" onClick={()=>go(current-1)} disabled={current===1}>이전</Pagebutton>

            {pages.map((p)=>(
                <Pagebutton key={p} type="button" $current={p===current} onClick={()=>go(p)}>
                    {p}
                </Pagebutton>
            ))}

            <Pagebutton type="button" onClick={()=>go(current+1)} disabled={current>=total}>다음</Pagebutton>
            <Pagebutton type="button" onClick={()=>go(total)} disabled={current>=total}>끝</Pagebutton>
        </Paging>
    )
}
