import React from "react";
import styled from "styled-components";
import profileimage from "../../UI/profileimage";

const CARD_W=260;
const CARD_H=176;

const Wrapper=styled.div`
    position: fixed;
    z-index: 60;
    left:${props=>`${props.location.x}px`};
    top:${props=>`${props.location.y}px`};

    display: flex;
    flex-direction: column;
    gap: 8px;
    width: ${CARD_W}px;
    min-height:${CARD_H}px;
    padding: 12px;

    background:${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    box-shadow: ${(props)=>props.theme.shadowLg};
`
const Headerdiv=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`
const Profileview=styled.div`
    width:45px;
    height:45px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 50%;
    border:1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const FollowButtondiv=styled.div`
    display: flex;
    margin-left: auto;
`
const FollowButton=styled.button`
    height: 30px;
    padding: 0 14px;
    border: none;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.accent};
    color: #fff;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition};

    &:hover { background: ${(props)=>props.theme.accentHover}; }
`
const BodyDiv=styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
`
const Nicknamediv=styled.div`
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const Usernamediv=styled.div`
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const Simpleprdiv=styled.div`
    margin-top: 6px;
    font-size: 12.5px;
    line-height: 1.45;
    color: ${(props)=>props.theme.textMuted};
`
const Bottomdiv=styled.div`
    display: flex;
    gap: 14px;
    margin-top: auto;
    padding-top: 8px;
    border-top: 1px solid ${(props)=>props.theme.border};
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};
`
const Followdiv=styled.div`
    b { font-weight: 700; color: ${(props)=>props.theme.text}; }
`
const Followerdiv=styled.div`
    b { font-weight: 700; color: ${(props)=>props.theme.text}; }
`

export default function Simpleprofile(props){

    const {username,nickname,profileimg,mousexy,onmouseEnter,onmouseLeave}=props

    //커서 바로 아래(오른쪽)에 붙이되, 화면 밖으로 나가면 안쪽으로 되돌린다.
    const margin=8;
    const vw=typeof window!=="undefined"?window.innerWidth:1920;
    const vh=typeof window!=="undefined"?window.innerHeight:1080;

    const location={
        x: Math.min(Math.max(mousexy.x+14, margin), vw-CARD_W-margin),
        y: Math.min(Math.max(mousexy.y+16, margin), vh-CARD_H-margin),
    };

    return (
        <Wrapper location={location}
            onMouseEnter={()=>{ if(onmouseEnter) onmouseEnter(); }}
            onMouseLeave={()=>{ onmouseLeave(); }}>

            <Headerdiv>
               <Profileview>
                <img src={profileimage(profileimg)}
                    style={{objectFit:"cover",width:"100%",height:"100%"}}
                />
               </Profileview>
               <BodyDiv>
                    <Nicknamediv>{nickname}</Nicknamediv>
                    <Usernamediv>{username}</Usernamediv>
               </BodyDiv>
               <FollowButtondiv>
                    <FollowButton type="button">팔로우</FollowButton>
               </FollowButtondiv>
            </Headerdiv>

            <Simpleprdiv>자기소개</Simpleprdiv>

            <Bottomdiv>
                <Followdiv><b>0</b> 팔로우</Followdiv>
                <Followerdiv><b>0</b> 팔로워</Followerdiv>
            </Bottomdiv>

        </Wrapper>
    )
}
