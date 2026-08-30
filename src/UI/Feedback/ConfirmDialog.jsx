import React, { useEffect, useId, useRef } from "react";
import styled, { keyframes } from "styled-components";

//=====================================================================
// 확인 다이얼로그 — window.confirm 자리를 대신한다.
//  - window.confirm 과 달리 실행을 멈추지 않으므로 호출부에서 await 해야 한다.
//  - 삭제/차단처럼 되돌릴 수 없는 동작은 $danger 로 띄운다.
//=====================================================================

const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const popin = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

const Backdrop=styled.div`
    position: fixed;
    inset: 0;
    z-index: 9990;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    animation: ${fadein} 140ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Card=styled.div`
    width: min(380px, 100%);
    padding: 24px 24px 18px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};
    animation: ${popin} 180ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Title=styled.h2`
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.4;
`
const Desc=styled.p`
    margin: 8px 0 0;
    font-size: 14px;
    line-height: 1.6;
    color: ${(props)=>props.theme.textMuted};
    white-space: pre-wrap;
`
const Buttons=styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 22px;
`
const Btn=styled.button`
    min-width: 78px;
    height: 36px;
    padding: 0 16px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                filter ${(props)=>props.theme.transition};

    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
const Cancel=styled(Btn)`
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
    color: ${(props)=>props.theme.textMuted};

    &:hover {
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
`
const Ok=styled(Btn)`
    border: 1px solid transparent;
    color: #fff;
    background: ${(props)=>props.$danger?props.theme.warning:props.theme.accent};

    &:hover { filter: brightness(1.08); }
    &:active { filter: brightness(0.94); }
`

function ConfirmDialog(props){
    const {options,onAnswer}=props;
    const {
        title="계속할까요?",
        description="",
        confirmText="확인",
        cancelText="취소",
        danger=false,
    }=options||{};

    const okref=useRef(null);
    const lastfocusref=useRef(null);
    const titleid=`confirm-title-${useId().replace(/:/g,"")}`;

    //열릴 때 확인 버튼으로 포커스를 옮기고, 닫히면 원래 있던 곳으로 되돌린다.
    useEffect(()=>{
        lastfocusref.current=document.activeElement;
        okref.current?.focus();
        return ()=>{
            if(lastfocusref.current instanceof HTMLElement) lastfocusref.current.focus();
        }
    },[])

    //Esc 는 취소. 다이얼로그가 떠 있는 동안은 뒤쪽 스크롤을 막는다.
    useEffect(()=>{
        const onkey=(e)=>{ if(e.key==="Escape"){ e.stopPropagation(); onAnswer(false); } }
        const prevoverflow=document.body.style.overflow;
        document.body.style.overflow="hidden";
        window.addEventListener("keydown",onkey);
        return ()=>{
            window.removeEventListener("keydown",onkey);
            document.body.style.overflow=prevoverflow;
        }
    },[onAnswer])

    return (
        <Backdrop onMouseDown={(e)=>{ if(e.target===e.currentTarget) onAnswer(false) }}>
            <Card role="dialog" aria-modal="true" aria-labelledby={titleid}
                  onMouseDown={(e)=>e.stopPropagation()}>
                <Title id={titleid}>{title}</Title>
                {description&&<Desc>{description}</Desc>}
                <Buttons>
                    <Cancel type="button" onClick={()=>onAnswer(false)}>{cancelText}</Cancel>
                    <Ok type="button" ref={okref} $danger={danger} onClick={()=>onAnswer(true)}>
                        {confirmText}
                    </Ok>
                </Buttons>
            </Card>
        </Backdrop>
    )
}

export default ConfirmDialog;
