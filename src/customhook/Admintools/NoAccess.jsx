import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock, faHouse, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

/* ─────────────────────────────────────────────────────────────
   권한 없음 안내.
   예전엔 스타일 없는 <h3> + <button> 하나라 브라우저 기본 모양 그대로였다.
   MainCss(가운데 패널) 안에 들어가므로 배경은 패널이 이미 깔아준다.
   여기서는 패널 안에서 가운데로 모으는 것만 한다.
   ───────────────────────────────────────────────────────────── */

const popin = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
`

/* 자물쇠 뒤에서 한 번 퍼지는 링 */
const ripple = keyframes`
    0%   { transform: scale(.85); opacity: .55; }
    70%  { transform: scale(1.35); opacity: 0; }
    100% { transform: scale(1.35); opacity: 0; }
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;

    /* 패널 안에서 충분히 자리를 잡아야 "덜 만든 화면"처럼 안 보인다 */
    min-height: 60vh;
    padding: 48px 24px;
    text-align: center;
    color: ${(props)=>props.theme.text};

    animation: ${popin} 320ms ${(props)=>props.theme.ease} both;
`

const Iconring = styled.div`
    position: relative;
    display: grid;
    place-items: center;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: ${(props)=>props.theme.accentSoft};
    color: ${(props)=>props.theme.accent};
    font-size: 32px;

    &::after{
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid ${(props)=>props.theme.accent};
        animation: ${ripple} 2.4s ${(props)=>props.theme.ease} infinite;
    }

    /* 애니메이션을 꺼둔 사용자에게는 링을 돌리지 않는다 */
    @media (prefers-reduced-motion: reduce){
        &::after{ animation: none; opacity: .25; }
    }
`

const Title = styled.h2`
    margin: 0;
    font-size: 22px;
    font-weight: 750;
    letter-spacing: -0.03em;
    line-height: 1.35;
`

const Desc = styled.p`
    margin: 0;
    max-width: 380px;
    font-size: 14px;
    line-height: 1.7;
    color: ${(props)=>props.theme.textMuted};
    word-break: keep-all;      /* 한글이 낱글자로 안 끊기게 */
`

/* 왜 막혔는지 한 줄로 알려주는 배지 */
const Codebadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surfaceAlt};
    color: ${(props)=>props.theme.textFaint};
    font-size: 11.5px;
    font-weight: 650;
    letter-spacing: 0.02em;
`

const Buttons = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 4px;
`

const Button = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 22px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition},
                transform ${(props)=>props.theme.transition};

    border: 1px solid ${(props)=>props.primary
        ? "transparent"
        : props.theme.border};
    background: ${(props)=>props.primary
        ? props.theme.accent
        : props.theme.surface};
    color: ${(props)=>props.primary
        ? "#fff"
        : props.theme.text};
    box-shadow: ${(props)=>props.primary
        ? props.theme.shadowSm
        : "none"};

    &:hover{
        background: ${(props)=>props.primary
            ? props.theme.accentHover
            : props.theme.accentSoft};
        border-color: ${(props)=>props.primary
            ? "transparent"
            : props.theme.accent};
        color: ${(props)=>props.primary
            ? "#fff"
            : props.theme.accent};
    }
    &:active{ transform: translateY(1px); }
    &:focus-visible{
        outline: none;
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`

export default function NoAccess(){
    const navigate=useNavigate();

    return (
        <Wrapper>
            <Iconring>
                <FontAwesomeIcon icon={faUserLock}/>
            </Iconring>

            <Title>접근 권한이 없습니다</Title>

            <Desc>
                이 페이지는 관리자만 볼 수 있어요.
                주소를 잘못 입력했거나, 계정 권한이 바뀌었을 수 있습니다.
            </Desc>

            <Codebadge>403 · FORBIDDEN</Codebadge>

            <Buttons>
                <Button primary onClick={()=>{navigate("/")}}>
                    <FontAwesomeIcon icon={faHouse}/>
                    홈으로 돌아가기
                </Button>
                {/* 잘못 눌러서 튕긴 경우가 대부분이라 되돌아갈 길을 같이 둔다 */}
                <Button onClick={()=>{navigate(-1)}}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                    이전 페이지
                </Button>
            </Buttons>
        </Wrapper>
    )
}
