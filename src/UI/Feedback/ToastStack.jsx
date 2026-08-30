import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";

//=====================================================================
// 토스트 스택 — alert() 자리를 대신하는 화면 상단 가운데 알림
//  - 상태는 전부 FeedbackProvider 가 들고 있고 여기는 그리기만 한다.
//  - 헤더 패널과 같은 유리면(surfaceGlass + blur)이라 앱 안에서 겉돌지 않는다.
//=====================================================================

const slidein = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`
const slideout = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-6px) scale(0.98); }
`
const shrink = keyframes`
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
`

// 화면 가운데 위에서 내려온다.
// 우상단은 헤더 오른쪽 패널(검색/로그인)과 겹쳐 보여서 눈에 잘 안 들어왔다.
const Stack=styled.div`
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: min(380px, calc(100vw - 32px));
    pointer-events: none;   /* 빈 영역은 아래 화면이 그대로 눌리게 */

    @media (max-width: 620px) {
      top: auto;
      bottom: 76px;         /* 하단 탭바 위 */
      width: calc(100vw - 24px);
    }
`
const tonecolor=(props)=>{
    if(props.$tone==="success") return props.theme.toneSuccess;
    if(props.$tone==="error") return props.theme.warning;   //#ff5252 - 앱 전체가 쓰는 위험색
    return props.theme.accent;
}
//유리면 위에 톤을 아주 옅게 한 겹 깐다. 실패는 붉은 기가 돌고, 완료는 초록 기가 돈다.
//color-mix 를 못 읽는 브라우저에서는 이 줄만 버려지고 평범한 유리면으로 남는다.
const tonetint=(props)=>`color-mix(in srgb, ${tonecolor(props)} 12%, transparent)`;
const toneborder=(props)=>`color-mix(in srgb, ${tonecolor(props)} 38%, ${props.theme.border})`;

const Item=styled.div`
    pointer-events: auto;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    gap: 11px;
    padding: 13px 14px;
    border: 1px solid ${(props)=>props.theme.border};
    border-color: ${toneborder};
    border-radius: ${(props)=>props.theme.radius};
    background-color: ${(props)=>props.theme.surfaceGlass};
    background-image: linear-gradient(0deg, ${tonetint}, ${tonetint});
    -webkit-backdrop-filter: ${(props)=>props.theme.blur};
    backdrop-filter: ${(props)=>props.theme.blur};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};
    cursor: pointer;
    animation: ${slidein} 200ms ${(props)=>props.theme.ease};

    ${(props)=>props.$leaving&&css`
        animation: ${slideout} 180ms ${props.theme.ease} forwards;
    `}

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
`
// 아이콘 원은 톤을 가장 진하게 쓰는 자리. 카드 배경은 12% 만 물들여 본문 가독성을 지킨다.
const Icon=styled.span`
    flex: none;
    width: 22px;
    height: 22px;
    margin-top: 1px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: ${tonecolor};
`
const Message=styled.p`
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: -0.01em;
    word-break: break-word;
    white-space: pre-wrap;
`
const Close=styled.button`
    flex: none;
    border: 0;
    background: none;
    padding: 2px;
    margin: -2px -4px 0 0;
    line-height: 0;
    color: ${(props)=>props.theme.textFaint};
    cursor: pointer;
    border-radius: ${(props)=>props.theme.radiusSm};

    &:hover { color: ${(props)=>props.theme.text}; }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 1px;
    }
`
// 남은 시간을 보여주는 얇은 선. 마우스를 올리면 같이 멈춘다.
const Timebar=styled.span`
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    transform-origin: left center;
    background: ${tonecolor};
    opacity: 0.55;
    animation: ${shrink} ${(props)=>props.$duration}ms linear forwards;
    animation-play-state: ${(props)=>props.$paused?"paused":"running"};

    @media (prefers-reduced-motion: reduce) {
      display: none;
    }
`

const Toneicon=({tone})=>{
    // 브랜드 마크와 같은 둥근 끝맺음으로 그린다.
    const common={fill:"none",stroke:"currentColor",strokeWidth:2.4,strokeLinecap:"round",strokeLinejoin:"round"};
    if(tone==="success"){
        return <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" {...common}/></svg>
    }
    if(tone==="error"){
        return <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" {...common}/></svg>
    }
    return <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.6v0.6M12 10.8v6.6" {...common}/></svg>
}

function ToastItem(props){
    const {toast,onClose}=props;
    const [leaving,setLeaving]=useState(false);
    const [paused,setPaused]=useState(false);
    const timerref=useRef(null);

    const startclose=useCallback(()=>setLeaving(true),[]);

    //자동 닫힘 타이머. 마우스를 올리고 있는 동안은 돌지 않는다.
    useEffect(()=>{
        if(paused||leaving) return undefined;
        timerref.current=setTimeout(startclose,toast.duration);
        return ()=>clearTimeout(timerref.current);
    },[paused,leaving,toast.duration,startclose])

    //퇴장 애니메이션이 끝난 뒤에 실제로 목록에서 뺀다.
    useEffect(()=>{
        if(!leaving) return undefined;
        const t=setTimeout(()=>onClose(toast.id),180);
        return ()=>clearTimeout(t);
    },[leaving,onClose,toast.id])

    return (
        <Item
            $tone={toast.tone}
            $leaving={leaving}
            role={toast.tone==="error"?"alert":"status"}
            onClick={startclose}
            onMouseEnter={()=>setPaused(true)}
            onMouseLeave={()=>setPaused(false)}
        >
            <Icon $tone={toast.tone}><Toneicon tone={toast.tone}/></Icon>
            <Message>{toast.message}</Message>
            <Close type="button" aria-label="알림 닫기" onClick={(e)=>{e.stopPropagation();startclose()}}>
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 7 17 17M17 7 7 17" fill="none" stroke="currentColor"
                          strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
            </Close>
            <Timebar $tone={toast.tone} $duration={toast.duration} $paused={paused||leaving}/>
        </Item>
    )
}

function ToastStack(props){
    const {toasts,onClose}=props;
    if(toasts.length===0) return null;

    return (
        <Stack aria-live="polite" aria-relevant="additions">
            {toasts.map((t)=><ToastItem key={t.id} toast={t} onClose={onClose}/>)}
        </Stack>
    )
}

export default ToastStack;
