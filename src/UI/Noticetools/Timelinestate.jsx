import React from "react";
import styled, { keyframes } from "styled-components";

//=====================================================================
// 타임라인의 "글이 아닌" 상태들 — 로딩 / 비어 있음 / 끝
//  - 예전에는 셋 다 화면에 아무것도 없거나 "마지막부분" 이라는 디버그 문구만 있었다.
//  - 카드 치수(padding 14px 18px, 프로필 45px)는 Twitformlist 와 맞춰 두었다.
//=====================================================================

const shimmer = keyframes`
  from { background-position: -220px 0; }
  to   { background-position: 220px 0; }
`

const Skeletonrow=styled.div`
    display: flex;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Bone=styled.div`
    border-radius: ${(props)=>props.$circle?"50%":props.theme.radiusSm};
    width: ${(props)=>props.$w||"100%"};
    height: ${(props)=>props.$h||"12px"};
    flex: none;
    background: ${(props)=>props.theme.surfaceAlt};
    background-image: linear-gradient(
        90deg,
        ${(props)=>props.theme.surfaceAlt} 0%,
        ${(props)=>props.theme.surfaceHover} 50%,
        ${(props)=>props.theme.surfaceAlt} 100%
    );
    background-size: 220px 100%;
    background-repeat: no-repeat;
    animation: ${shimmer} 1.2s linear infinite;

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Bonelines=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding-top: 4px;
`

//목록을 처음 받아오는 동안 자리를 잡아준다. 화면이 덜컥 뛰지 않는다.
export function TimelineSkeleton({rows=3}){
    return (
        <div aria-hidden="true">
            {Array.from({length:rows}).map((_,i)=>(
                <Skeletonrow key={i}>
                    <Bone $circle $w="45px" $h="45px"/>
                    <Bonelines>
                        <Bone $w="38%" $h="12px"/>
                        <Bone $w="92%" $h="12px"/>
                        <Bone $w="64%" $h="12px"/>
                    </Bonelines>
                </Skeletonrow>
            ))}
        </div>
    )
}

const Emptybox=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    padding: 56px 24px 64px;
    color: ${(props)=>props.theme.textMuted};
`
const Emptyicon=styled.div`
    width: 52px;
    height: 52px;
    margin-bottom: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.theme.border};
    color: ${(props)=>props.$tone==="like"?props.theme.like:props.theme.textFaint};
`
const Emptytitle=styled.p`
    margin: 0;
    font-size: 15.5px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.text};
`
const Emptytext=styled.p`
    margin: 0;
    font-size: 13.5px;
    line-height: 1.6;
    max-width: 30ch;
`

//variant: "liked" | "following" | "image" | "notice"
export function TimelineEmpty({variant="notice"}){
    if(variant==="liked"){
        return (
            <Emptybox>
                <Emptyicon $tone="like">
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 3A11.6 11.6 0 0 1 12 20z"
                              fill="none" stroke="currentColor" strokeWidth="1.8"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Emptyicon>
                <Emptytitle>아직 좋아요한 글이 없습니다</Emptytitle>
                <Emptytext>마음에 드는 글에 하트를 누르면 여기에 모입니다.</Emptytext>
            </Emptybox>
        )
    }
        if(variant==="following"){
        return (
            <Emptybox>
                <Emptyicon>
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="9" cy="8.5" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="none"
                              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M17.5 8.5v5M20 11h-5" fill="none"
                              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                </Emptyicon>
                <Emptytitle>팔로우한 사람의 글이 없습니다</Emptytitle>
                <Emptytext>관심 있는 사람을 팔로우하면 그 사람들의 글만 여기에 모입니다.</Emptytext>
            </Emptybox>
        )
    }
    if(variant==="image"){
        return (
            <Emptybox>
                <Emptyicon>
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5"
                              fill="none" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M4 16.5 9 11.5l4 4 2.5-2.5 4.5 4.5" fill="none"
                              stroke="currentColor" strokeWidth="1.8"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Emptyicon>
                <Emptytitle>이미지 글이 없습니다</Emptytitle>
                <Emptytext>사진이 담긴 글이 올라오면 여기에서 볼 수 있습니다.</Emptytext>
            </Emptybox>
        )
    }
    return (
        <Emptybox>
            <Emptyicon>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.5 6.5A2 2 0 0 1 6.5 4.5h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3.5v-3.5H6.5a2 2 0 0 1-2-2z"
                          fill="none" stroke="currentColor" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </Emptyicon>
            <Emptytitle>아직 올라온 글이 없습니다</Emptytitle>
            <Emptytext>첫 글을 남겨보세요.</Emptytext>
        </Emptybox>
    )
}

const Endline=styled.div`
    padding: 22px 0 28px;
    text-align: center;
    font-size: 12.5px;
    letter-spacing: -0.01em;
    color: ${(props)=>props.theme.textFaint};
`
const spin = keyframes`
  to { transform: rotate(360deg); }
`
const Spinner=styled.span`
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid ${(props)=>props.theme.border};
    border-top-color: ${(props)=>props.theme.accent};
    animation: ${spin} 700ms linear infinite;

    @media (prefers-reduced-motion: reduce) { animation-duration: 2.4s; }
`

//목록 맨 아래. 예전에는 여기에 "마지막부분" 이라는 개발용 문구가 그대로 보였다.
export function TimelineEnd({loading,done}){
    if(loading) return <Endline><Spinner aria-label="더 불러오는 중"/></Endline>
    if(done) return <Endline>마지막 글까지 다 봤습니다</Endline>
    return <Endline/>
}
