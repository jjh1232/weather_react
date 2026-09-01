import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import profileimage from "../../UI/profileimage";
import CreateAxios from "../../customhook/CreateAxios";
import { handleparam, handletext } from "../../customhook/Userhandle";
import { useToast } from "../../UI/Feedback/FeedbackProvider";

const CARD_W=280;
const CARD_H=176;

const Wrapper=styled.div`
    position: fixed;
    z-index: 60;
    left:${props=>`${props.location.x}px`};
    top:${props=>`${props.location.y}px`};

    display: flex;
    flex-direction: column;
    gap: 10px;
    width: ${CARD_W}px;
    min-height:${CARD_H}px;
    padding: 14px;

    background:${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    box-shadow: ${(props)=>props.theme.shadowLg};
    cursor: default;
`
const Headerdiv=styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
`
const Profileview=styled.div`
    width:44px;
    height:44px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 50%;
    border:1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
    cursor: pointer;
`
const BodyDiv=styled.div`
    display: flex;
    flex-direction: column;
    /* 이게 없으면 아래 ellipsis 가 안 먹는다. flex 항목의 기본 min-width 는 auto 라
       내용 길이만큼 늘어나서, 버튼을 카드 밖으로 밀어낸다. */
    min-width: 0;
    flex: 1;
`
const Nicknamediv=styled.div`
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    &:hover { text-decoration: underline; }
`
const Usernamediv=styled.div`
    font-size: 12px;
    /* 목록·상세와 같은 톤. 닉네임이 먼저 읽히게 한 단계 흐리다. */
    color: ${(props)=>props.theme.textFaint};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const FollowButton=styled.button`
    flex-shrink: 0;
    height: 30px;
    padding: 0 14px;
    border: 1px solid ${(props)=>props.$on?props.theme.border:"transparent"};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.$on?"transparent":props.theme.accent};
    color: ${(props)=>props.$on?props.theme.text:"#fff"};
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition};

    &:hover:not(:disabled) {
        background: ${(props)=>props.$on?props.theme.surfaceHover:props.theme.accentHover};
    }
    &:disabled { opacity: .55; cursor: default; }
`
const Simpleprdiv=styled.div`
    font-size: 12.5px;
    line-height: 1.5;
    color: ${(props)=>props.theme.textMuted};
    /* 자기소개가 길어도 카드가 늘어나지 않게 두 줄로 자른다 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`
const Emptyintro=styled(Simpleprdiv)`
    color: ${(props)=>props.theme.textFaint};
    font-style: italic;
`
const Bottomdiv=styled.div`
    display: flex;
    gap: 14px;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid ${(props)=>props.theme.border};
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};

    b { font-weight: 700; color: ${(props)=>props.theme.text}; }
`
const Countdiv=styled.div`
    cursor: default;
    font-variant-numeric: tabular-nums;
`

export default function Simpleprofile(props){

    const {username,nickname,profileimg,profileid,
           mousexy,onmouseEnter,onmouseLeave}=props;

    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();
    const toast=useToast();
    const [cookies]=useCookies(["userinfo","Acesstoken"]);
    const [busy,setBusy]=useState(false);

    const param=handleparam(profileid,username);
    const isme=cookies.userinfo?.username===username;

    /* 예전엔 자기소개와 팔로우 수가 "자기소개", 0, 0 으로 박혀 있었다.
       실제 값이 아니라 화면이 거짓말을 하고 있었다.
       유저 페이지가 쓰는 것과 같은 API 로 진짜 값을 가져온다. */
    const {data:userdata}=useQuery({
        queryKey:["simpleprofile",param],
        queryFn:async()=>{
            const res=await axiosinstance.get(`/open/userpage/userdata/${param}`);
            return res.data;
        },
        enabled:!!param,
        staleTime:60*1000,
    });

    //서버 값이 오기 전에는 목록에서 받은 값으로 먼저 그린다(깜빡임 방지).
    const shownickname=userdata?.nickname??nickname;
    const showprofile=userdata?.profileimg??profileimg;
    const showhandle=handletext(userdata?.profileid??profileid, username);

    const [following,setFollowing]=useState(null);
    useEffect(()=>{
        if(userdata) setFollowing(!!userdata.followcheck);
    },[userdata]);

    const followtoggle=async()=>{
        if(busy) return;
        if(!cookies.userinfo){
            toast.error("로그인 후 이용해주세요.");
            return;
        }
        setBusy(true);
        try{
            if(following){
                await axiosinstance.delete(`/followdelete/${username}`);
                setFollowing(false);
                toast.success("팔로우를 해제했습니다.");
            }else{
                await axiosinstance.get(`/follow?friendname=${username}`);
                setFollowing(true);
                toast.success("팔로우했습니다.");
            }
            //팔로우 목록·팔로우 여부를 보는 다른 화면도 같이 갱신한다
            queryclient.invalidateQueries({queryKey:["simpleprofile",param]});
            queryclient.invalidateQueries({queryKey:["followch",username]});
            queryclient.invalidateQueries({queryKey:["followlistdata",cookies.userinfo?.userid]});
        }catch(e){
            toast.error("잠시 후 다시 시도해주세요.");
        }finally{
            setBusy(false);
        }
    };

    //커서 바로 아래(오른쪽)에 붙이되, 화면 밖으로 나가면 안쪽으로 되돌린다.
    const margin=8;
    const vw=typeof window!=="undefined"?window.innerWidth:1920;
    const vh=typeof window!=="undefined"?window.innerHeight:1080;

    const location={
        x: Math.min(Math.max(mousexy.x+14, margin), vw-CARD_W-margin),
        y: Math.min(Math.max(mousexy.y+16, margin), vh-CARD_H-margin),
    };

    /* 이 카드는 글 목록 항목(Twitformlist 의 Wrapper) 안에 그려진다.
       그 Wrapper 는 onMouseUp 으로 글 상세로 이동시킨다.
       막지 않으면 카드 안 어디를 눌러도(팔로우 버튼 포함) 글이 열려버린다. */
    const stop=(e)=>{ e.stopPropagation(); };

    return (
        <Wrapper location={location}
            onMouseEnter={()=>{ if(onmouseEnter) onmouseEnter(); }}
            onMouseLeave={()=>{ onmouseLeave(); }}
            onMouseDown={stop} onMouseUp={stop} onClick={stop}>

            <Headerdiv>
               <Profileview>
                <img src={profileimage(showprofile)} alt=""
                    style={{objectFit:"cover",width:"100%",height:"100%"}}
                />
               </Profileview>

               <BodyDiv>
                    <Nicknamediv title={shownickname}>{shownickname}</Nicknamediv>
                    <Usernamediv title={showhandle}>{showhandle}</Usernamediv>
               </BodyDiv>

               {/* 자기 자신에게 팔로우 버튼을 띄우지 않는다.
                   서버도 자기 팔로우를 거부하므로 눌러봐야 실패한다. */}
               {!isme &&
                <FollowButton type="button" $on={!!following}
                    disabled={busy||following===null}
                    onClick={followtoggle}>
                    {following?"팔로잉":"팔로우"}
                </FollowButton>}
            </Headerdiv>

            {userdata?.myintro
                ? <Simpleprdiv>{userdata.myintro}</Simpleprdiv>
                : <Emptyintro>자기소개가 없습니다</Emptyintro>}

            <Bottomdiv>
                <Countdiv><b>{userdata?.follownum??0}</b> 팔로우</Countdiv>
                <Countdiv><b>{userdata?.followernum??0}</b> 팔로워</Countdiv>
            </Bottomdiv>

        </Wrapper>
    )
}
