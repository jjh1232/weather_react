import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Twitformlist from "../../List/noticeformlist/Twitformlist";
import { useQuery } from "@tanstack/react-query";
import {format} from "date-fns"
import Viewtrans from "../../List/noticeformlist/DateCom/Viewtrans";
import { useCookies } from "react-cookie";
import Userpageformtool from "./Userpageformtool";
import Userpagesearch from "./Userpagesearch";
import UserProfileEditmodal from "./UserProfileEditmodal";
import { handletext } from "../../customhook/Userhandle";
import { useQueryClient } from "@tanstack/react-query";
import AuthCheck from "../../customhook/authCheck";
import { useToast, messageFromError } from "../../UI/Feedback/FeedbackProvider";
import profileimage from "../../UI/profileimage";
import { API_BASE } from "../../config/api";

const Wrapper=styled.div`
position: relative;
width:100%;

/* top:8% 는 예전 고정 레이아웃 보정값이었다.
   position:relative 의 % 오프셋은 "부모 높이" 기준이라,
   글이 많아 페이지가 길어질수록 내용이 통째로 아래로 밀린다.
   (게시글 몇 개만 있어도 수백 px 씩 내려갔다) */

 color:${props => props.theme.text};
 /* 배경은 바깥 MainCss 패널이 갖는다 */
 background: transparent;
`

const Usercss=styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`
// 프로필 상단 배너
const UserBackground=styled.div`
    display: flex;
    width: 100%;
        /* 아바타(104px)와 비율이 맞는 높이. 더 키우면 아바타가 작아 보인다. */
    height: 160px;

    @media (max-width: 900px) { height: 130px; }
    /* 배경을 등록하지 않은 유저는 기존 그라데이션 그대로 */
    background: ${(props)=>props.src
        ?`url(${props.src}) center/cover no-repeat`
        :"linear-gradient(120deg, #cdeeff 0%, #e4d9fb 100%)"};
`
//커버 아래 한 줄: [사진] .................. [버튼]
//이름부터는 아래 블록에서 사진과 "같은 왼쪽 선"으로 시작한다.
//기준선을 하나로 두는 게 이 화면의 핵심이다(둘이면 흔들려 보인다).
const Userheaderdiv=styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 0 20px 0;
`
//닉네임과 @아이디 묶음.
const Nameblock=styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`
// 검색은 탭 바로 위 줄에 오른쪽 정렬로 둔다
const Searchrow=styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 8px;
`
const Profileview=styled.div`
    width:100%;
    height:100%;
    overflow: hidden;
    border-radius: 50%;
`
// 배너에 걸치는 아바타
//예전에는 position:absolute 로 커버 위에 띄워서 옆에 아무것도 놓을 수 없었다.
//흐름 안으로 넣고 위로만 끌어올려, 커버에 걸친 모습은 그대로 두면서
//오른쪽에 닉네임을 나란히 놓는다.
const Profilediv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 104px;
    height: 104px;
    margin-top: -52px;   /* 커버에 절반쯤 걸치게 */

    padding: 4px;
    border-radius: 50%;
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadow};

    @media (max-width: 900px) {
      width: 84px;
      height: 84px;
      margin-top: -42px;
    }
`
const Profileimg=styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
    background: #fff;
`
const Menudiv=styled.div`
    display: flex;
    margin-left: auto;
    /* 커버 아래로 내려온 사진과 눈높이를 맞춘다 */
    padding-top: 14px;
`
//팔로우 / 언팔로우 / 편집 버튼.
//예전에는 색이 #111111d1, #ce3333d1 처럼 박혀 있어서 다크모드와 따로 놀았다.
const variants=(props)=>{
  if(props.size==="unfollow"){
    //이미 팔로우 중일 때는 평소엔 조용히 "Following" 으로 두고,
    //마우스를 올렸을 때만 빨갛게 "Unfollow" 로 바뀐다(누르면 끊긴다는 신호).
    return `
      border: 1px solid ${props.theme.border};
      background: ${props.theme.surface};
      color: ${props.theme.text};

      .hoverlabel { display: none; }
      &:hover:not(:disabled) {
        border-color: ${props.theme.warning};
        background: rgba(255, 82, 82, 0.08);
        color: ${props.theme.warning};
      }
      &:hover:not(:disabled) .idlelabel { display: none; }
      &:hover:not(:disabled) .hoverlabel { display: inline; }
    `;
  }
  if(props.size==="edit"){
    return `
      border: 1px solid ${props.theme.border};
      background: ${props.theme.surfaceAlt};
      color: ${props.theme.textMuted};
      &:hover:not(:disabled) {
        background: ${props.theme.surfaceHover};
        color: ${props.theme.text};
      }
    `;
  }
  //기본 = 팔로우. 이 화면에서 가장 하라는 동작이라 accent 를 준다.
  return `
    border: 1px solid transparent;
    background: ${props.theme.accent};
    color: #fff;
    &:hover:not(:disabled) { filter: brightness(1.08); }
  `;
}
const MenuButton=styled.button`
    height: 36px;
    padding: 0 20px;
    margin-right: 10px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition},
                filter ${(props)=>props.theme.transition};

    ${variants}

    &:disabled { opacity: 0.6; cursor: default; }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
// 닉네임 / 아이디 / 소개 / 가입일
//이름 · 소개 · 통계가 사는 블록. 사진과 같은 왼쪽 선(20px)에서 시작한다.
const Userinfodiv=styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 12px 20px 12px;
`
const Nicknamediv=styled.div`
    font-size: 22px;
    font-weight: 750;
    letter-spacing: -0.03em;
    flex: none;
`
const Usernamediv=styled.div`
    font-size: 13.5px;
    color: ${(props)=>props.theme.textMuted};
`
const Dot=styled.span`
    color: ${(props)=>props.theme.borderStrong};
    flex: none;
`
//닉네임 옆에 붙는 소개. 닉네임(22px)보다 작고 @아이디(13.5px)보다는 크게 둬서
//"이름 - 소개 - 아이디" 순으로 눈이 흐르게 한다.
//사진·닉네임 아래 자기 줄을 갖는 소개.
//폭이 넓어졌으니 글자도 키워서 프로필에서 실제로 읽히게 한다.
//이 화면에서 유일하게 "읽는 글".
//주변(@아이디 13.5px·통계 13px)은 전부 흐린 회색이라, 소개만 본문색 + 큰 글씨로 두면
//따로 꾸미지 않아도 확실히 구분된다.
const Userintrodiv=styled.div`
    /* 소개가 없으면 자리를 아예 차지하지 않는다 */
    &:empty { display: none; }
    /* 한 줄이 너무 길면 읽기 어렵다. 읽기 좋은 폭에서 끊는다. */
    max-width: 56ch;
    margin-top: 14px;
    font-size: 16.5px;
    line-height: 1.65;
    letter-spacing: -0.005em;
    color: ${(props)=>props.theme.text};
    white-space: pre-wrap;
    word-break: break-word;
`
const Userdate=styled.div`
    font-size: 13px;
    color: ${(props)=>props.theme.textFaint};
    flex: none;
`
//팔로우 · 팔로워 · 가입일을 한 줄에.
const Followdatadiv=styled.div`
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 14px;
        /* 소개와 붙어 있으면 한 덩어리로 보인다. 확실히 떼어 놓는다. */
    margin: 16px 0 0;
    font-size: 13px;
    color: ${(props)=>props.theme.textMuted};

    b { font-weight: 700; color: ${(props)=>props.theme.text}; }
`
const Follownumdiv=styled.div`
    
`
const Followernumdiv=styled.div`
    
`
export default function UserDetail(props){
    const params=useParams();
    const axiosinstance=CreateAxios();

    const [userdata,setUserdata]=useState();

    const [notice,setNotice]=useState();
    const [usercookie,setUsercookie]=useCookies();
 
        const [isEdit,setIsEdit]=useState(false)

    const queryclient=useQueryClient();
    const toast=useToast();
    const logincheck=AuthCheck();
    //요청이 오가는 동안 버튼을 잠근다(연타로 팔로우/언팔로우가 엇갈리는 걸 막는다).
    const [followpending,setFollowpending]=useState(false);

    //팔로우 상태가 바뀌면 이 화면의 프로필(팔로워 수)과
    //오른쪽 사이드바의 세 목록이 전부 영향을 받는다. 같이 새로 받는다.
    const refreshfollow=()=>{
        queryclient.invalidateQueries({queryKey:['userpageprofile',params.profileid]})
        queryclient.invalidateQueries({queryKey:["followlistdata"]})
        queryclient.invalidateQueries({queryKey:["followerlist"]})
        queryclient.invalidateQueries({queryKey:["favoritelistdata"]})
    }

    //예전에는 Follow/Unfollow 버튼에 onClick 이 아예 없어서 눌러도 아무 일이 없었다.
    const onfollow=async()=>{
        if(!logincheck){ toast.info("로그인이 필요합니다."); return; }
        setFollowpending(true);
        try{
            await axiosinstance.get("/follow?friendname="+userinfo.username);
            refreshfollow();
        }catch(err){
            toast.error(messageFromError(err,"팔로우하지 못했습니다."));
        }finally{
            setFollowpending(false);
        }
    }

    const onunfollow=async()=>{
        setFollowpending(true);
        try{
            await axiosinstance.delete(`/followdelete/${userinfo.username}`);
            refreshfollow();
        }catch(err){
            toast.error(messageFromError(err,"팔로우를 해제하지 못했습니다."));
        }finally{
            setFollowpending(false);
        }
    }

    const {data:userinfo,isLoading:userloading,error:usererror}=useQuery(
        {queryKey:['userpageprofile',params.profileid],
            queryFn:async ()=>{
                const res=await axiosinstance.get(`/open/userpage/userdata/${params.profileid}`)
                console.log("유저데이터:",res)
                return res.data
            }
            
        }
        
        
    )
 

    //가입날짜포맷
    const JoinDate=(joindate)=>{
        const formatted=format(joindate,'yyyy MMMM d')
        return <>{formatted}</>
    }


    return (<Wrapper>
        {userinfo&&
        
        <Usercss> 
            {isEdit&&<UserProfileEditmodal setisedit={setIsEdit} userinfo={userinfo}/>}
            <UserBackground src={userinfo.profilebackground
                ?API_BASE+"/userbackgroundimg"+userinfo.profilebackground
                :null}>

            </UserBackground>
                        <Userheaderdiv>

        <Profilediv>
          <Profileview>
            <Profileimg src={profileimage(userinfo.profileimg)}/>
          </Profileview>
        </Profilediv>

                   <Menudiv>
           
           {usercookie.userinfo?.userid===userinfo.userid?
           <MenuButton size="edit" onClick={()=>setIsEdit(true)}>EDIT</MenuButton>
          
                      :userinfo.followcheck
                      ?<MenuButton size="unfollow" onClick={onunfollow} disabled={followpending}
              title="팔로우 해제">
              {followpending
                ?"해제 중..."
                :<><span className="idlelabel">Following</span>
                   <span className="hoverlabel">Unfollow</span></>}
            </MenuButton>
           :<MenuButton onClick={onfollow} disabled={followpending}>
              {followpending?"처리 중...":"Follow"}
            </MenuButton>}
          
       </Menudiv>
            
 </Userheaderdiv>
                                          <Userinfodiv>

        {/* 사진과 같은 왼쪽 선에서 이름 → 소개 → 통계 순으로 내려온다 */}
        <Nameblock>
          <Nicknamediv>{userinfo.nickname}</Nicknamediv>
          <Usernamediv>
            {handletext(userinfo.profileid,userinfo.username)}
          </Usernamediv>
        </Nameblock>

        <Userintrodiv>{userinfo.myintro}</Userintrodiv>

    {/* 팔로우 · 팔로워 · 가입일을 한 줄에 */}
    <Followdatadiv>
        <Follownumdiv>
            <b>{Viewtrans(userinfo.follownum)}</b> 팔로우
        </Follownumdiv>

        <Followernumdiv>
            <b>{Viewtrans(userinfo.followernum)}</b> 팔로워
        </Followernumdiv>

        <Dot>·</Dot>
        <Userdate>{JoinDate(userinfo.regdate)} 가입</Userdate>   
       
    
        </Followdatadiv>
          </Userinfodiv>
    </Usercss>  
    }
    <Searchrow>
      <Userpagesearch profileid={params.profileid}/>
    </Searchrow>
    <Userpageformtool profileid={params.profileid}/>
    
           {
            //=======================게시글부분======================
           }    
        <Outlet context={{userinfo}}/>

        
        
    </Wrapper>
    )
}
