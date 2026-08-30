import React, { useEffect, useRef } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import CreateAxios from "../customhook/CreateAxios";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import Userdata from "../UI/Modals/Userdata";
import styled from "styled-components";
import Loginpage from "../MemberPage/Loginpage";
import BrandMark from "../UI/BrandMark";
import Noticeformbutton from "../Noticepage/NoticePattern/Noticeformbutton";
import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "../config/api";
//import * as deletefiles from `./`

// 위치/폭은 MainLayout 의 grid 가 정한다. 여기서는 내부 배치만 담당.
// 다만 간격과 좌우 폭은 아래 grid 와 똑같이 맞춰야 세로줄이 어긋나지 않는다.
// (예전엔 gap 12px / 검색 300px 이라 가운데 패널만 35px 튀어나왔다)
const Wrapper=styled.div`
display: flex;
align-items: stretch;
gap: 14px;
width: 100%;
height: 52px;
z-index: 10;

@media (max-width: 900px) {
  height: 48px;
  gap: 10px;
}
`
// 3단 패널 공통 - 하늘 배경 위에 뜨는 반투명 카드
const Panel=styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    background-color: ${(props)=>props.theme.surfaceGlass};
    -webkit-backdrop-filter: ${(props)=>props.theme.blur};
    backdrop-filter: ${(props)=>props.theme.blur};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    box-shadow: ${(props)=>props.theme.shadow};
    color: ${(props)=>props.theme.text};
`
//3단디브 왼쪽 여긴 가변적으로가보자
const Logodiv=styled(Panel)`
    width: 310px;
    flex-shrink: 0;
    gap: 9px;
    cursor: pointer;

    /* 좁아지면 로고만 남기고 폭을 양보한다 */
    @media (max-width: 1400px) {
      width: auto;
    }
`
const Logomark=styled(BrandMark)`
    flex-shrink: 0;
    display: block;
`
// 그라디언트는 글자에만 건다.
// Panel 자체에 background-clip:text 를 걸면 유리 배경까지 글자 모양으로 잘려서
// 로고 칸만 배경이 통째로 사라진다(예전에 그래서 좌측 패널이 비어 보였다).
const Wordmark=styled.span`
    font-size: 20px;
    font-weight: 750;
    letter-spacing: -0.03em;
    background-image: linear-gradient(
        120deg,
        ${(props)=>props.theme.accent},
        ${(props)=>props.theme.accentHover}
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    user-select: none;

    @media (max-width: 900px) {
      font-size: 18px;
    }
`
//가운데 패널. 예전에는 "메인페이지" 링크 하나만 있고 대부분이 빈 공간이었다.
//지금은 타임라인 화면일 때 탭(전체/팔로잉/좋아요/사진)이 여기 들어간다.
//이 패널은 아래 가운데 칼럼과 x축이 맞아 있어서, 탭이 목록 바로 위에 놓인다.
const Maindiv=styled(Panel)`
    flex: 1;
    min-width: 0;
    gap: 4px;

    /* 모바일에선 자리를 검색창에 내준다(탭은 Twitformex 쪽 것이 대신 보인다) */
    @media (max-width: 620px) {
      display: none;
    }
`
//유저 페이지에서 가운데 패널에 들어가는 줄: [←] 닉네임 / @아이디
const Contextbar=styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-width: 0;
`
const Backbutton=styled.button`
    flex: none;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: none;
    color: ${(props)=>props.theme.textMuted};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 1px;
    }
`
const Backicon=()=>(
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const Contexttitle=styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.25;
`
const Contextname=styled.span`
    font-size: 15.5px;
    font-weight: 700;
    letter-spacing: -0.02em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Contexthandle=styled.span`
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
// 헤더 안의 텍스트 메뉴
const Navitem=styled.span`
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding: 0 12px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 14px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
        background: ${(props)=>props.theme.accentSoft};
        color: ${(props)=>props.theme.accent};
    }
`
const Searchdiv=styled(Panel)`
    /* 아래 오른쪽 사이드바(로그인창)와 같은 폭.
       가운데 패널이 없는 화면에서도 오른쪽에 붙어 정렬이 유지되게 auto 여백을 준다. */
    margin-left: auto;
    width: 332px;
    flex-shrink: 0;
    padding: 0 12px;

    @media (max-width: 900px) {
      width: auto;
      flex: 1;
      min-width: 0;
    }
`
//검색
const Searchfield=styled.div`
    position: relative;
    width: 100%;
`
const Usersearchinput=styled.input`
    width: 100%;
    height: 32px;
    padding: 0 12px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surfaceAlt};
    color: ${(props)=>props.theme.text};
    font-size: 14px;
    outline: none;
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition},
                background ${(props)=>props.theme.transition};

    &::placeholder {
        color: ${(props)=>props.theme.textFaint};
    }
    &:focus {
        border-color: ${(props)=>props.theme.accent};
        background: ${(props)=>props.theme.surface};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
    &::-webkit-search-cancel-button {
        cursor: pointer;
    }
`
// 검색 결과 드롭다운
const Searchresult=styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 280px;
    max-width: 90vw;
    max-height: 600px;
    overflow-y: auto;
    z-index: 10;
    padding: 6px;
    background: ${(props)=>props.theme.surface};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};
`
function Header(){

   

    const axiosinstance=CreateAxios();
    const [searchdata,setSearchdata]=useState();
  
     
      const searchref=useRef();
    const [ref,inview]=useInView({//감지해야하는 객체에ref저장 
                //inview:boolean값이고 감시하고있는요소가 화면에보일떄true벗어날떄false
        //옵션설정가능!
        threshold:0.7, //화면의30프로가보일때 감지
        /*
        
threshold : 요소의 어느 부분이 뷰포트에 들어와야 inView 가 true가 될지 결정한다.
 0에서 1 사이의 값으로 설정할 수 있으며, 예를 들어 0.5는 요소의 50%가 화면에
  들어왔을 때 inView 를 true로 설정한다.
triggerOnce : 이 옵션을 true로 설정하면, 요소가 한 번 화면에 나타나고 나면
 감지가 중지된다. 기본값은 false이다.
delay : 감지에 딜레이를 추가할 수 있다. 예를 들어, 요소가 화면에 짧게
 나타났다가 사라지는 경우를 필터링할 때 유용하다.
        */
    })

    useEffect(()=>{
        if(inview){
            //console.log("요소가 화면에보입니다")
           }
        else{
            //console.log("요소안잡")
        }
    },[inview])


        const navigate=useNavigate();
    const location=useLocation();

    //타임라인 화면에서만 가운데 패널에 탭을 그린다.
    //설정·프로필·채팅 화면에서 글 목록 필터가 떠 있으면 어색하다.
            const path=location.pathname;

    //게시글 상세는 "머물러 읽는" 화면이라 목록 탭이 아니라 [뒤로]가 맞다.
    //예전에는 /notice 로 시작하면 전부 타임라인으로 쳐서, 글을 읽는 중에도 탭이 떠 있었다.
    const isnoticedetail = path.startsWith("/notice/detail/");

    /* 설정·글쓰기처럼 "머물러 쓰는" 화면들. 여기도 상단이 통째로 비어 있어서
       어느 화면인지도, 어떻게 돌아가는지도 알 수 없었다.
       [뒤로] + 화면 이름을 게시글 상세와 같은 모양으로 둔다. */
    const PAGETITLES={
        "/memberupdate":"회원정보 수정",
        "/memberdeletepage":"회원 탈퇴",
        "/weatherregion":"지역 설정",
        "/weather":"날씨",
        "/noticecreate":"글쓰기",
    };
    const pagetitle = PAGETITLES[path]
        || (path.startsWith("/noticeupdate/") ? "글 수정" : null);

    /* 글쓰기·글수정 주소도 "/notice" 로 시작해서 타임라인으로 잡혔다.
       그래서 글을 쓰는 중에 목록 탭(전체/팔로잉/좋아요/사진)이 떠 있었다. */
    const istimeline = !isnoticedetail && !pagetitle &&
        (path==="/" || path==="/main" || path.startsWith("/notice"));

    //유저 페이지(/userpage/{profileid}[/탭])에서는 그 자리에 [뒤로] + 유저 이름을 둔다.
    const userpagematch = path.match(/^\/userpage\/([^/]+)/);
    const viewingprofileid = userpagematch ? userpagematch[1] : null;

    //UserDetail 과 같은 queryKey 라 이미 받아둔 데이터를 그대로 쓴다(요청이 늘지 않는다).
        //히스토리가 없으면(주소를 직접 치고 들어온 경우) 타임라인으로 보낸다.
    const goback=()=>{
        if(window.history.length>1) navigate(-1);
        else navigate("/notice/twitform");
    }

    const {data:viewinguser}=useQuery({
        queryKey:['userpageprofile',viewingprofileid],
        queryFn:async ()=>{
            const res=await axiosinstance.get(`/open/userpage/userdata/${viewingprofileid}`)
            return res.data
        },
        enabled:!!viewingprofileid
    })
    /*
  useEffect(()=>{
        document.addEventListener("mousedown",searchclose)
        
        return ()=>document.removeEventListener("mousedown",searchclose);
    },[])

    const searchclose=(e)=>{
        
        console.log("ref클래스네임"+searchref.current)
            console.log("지금누른거"+e.target)
            
            if(!e.target.contains(searchref.current)){
                console.log("서치열려있음")
                setSearchdata(null)
            }else{
                console.log("포함안함")
            }
          
                
        }
*/
    //유저검색
    const usersearch=(e)=>{
    console.log(e.target.value)
    axios.get(`${API_BASE}/open/usersearch?nickname=`+e.target.value).then((res)=>{
        console.log(res.data)
        setSearchdata(res.data)
    }).catch((err)=>{
        console.log("err")
    })
}

const modalon=()=>{

}
// if(window.location.pathname===`/userprofile`) return null
//if(window.location.pathname.includes("/admin")) return null

//if(window.location.pathname===`/manyimage`) return null
if (
        window.location.pathname === `/userprofile` ||
        window.location.pathname.includes("/admin") ||
        window.location.pathname === `/manyimage`
    ) {
        return null;
    }
    return (
        <>
        <Wrapper>
            
                    <Logodiv onClick={()=>navigate("/notice/twitform")} title="타임라인으로">
            <Logomark size={26} />
            <Wordmark>Weave</Wordmark>
          </Logodiv>

                    {/* "메인페이지" 링크가 있던 자리.
              화면에 따라 내용이 바뀐다 — 타임라인이면 탭, 유저 페이지면 [뒤로]+이름.
              홈으로 가는 건 로고가 맡는다. */}
          {istimeline &&
          <Maindiv>
            <Noticeformbutton/>
          </Maindiv>}

                    {viewingprofileid &&
          <Maindiv>
            <Contextbar>
              <Backbutton type="button" aria-label="뒤로 가기" onClick={goback}>
                <Backicon/>
              </Backbutton>
              <Contexttitle>
                <Contextname>{viewinguser?.nickname||"프로필"}</Contextname>
                <Contexthandle>@{viewinguser?.profileid||viewingprofileid}</Contexthandle>
              </Contexttitle>
            </Contextbar>
          </Maindiv>}

          {/* 설정·글쓰기 화면 */}
          {pagetitle &&
          <Maindiv>
            <Contextbar>
              <Backbutton type="button" aria-label="뒤로 가기" onClick={goback}>
                <Backicon/>
              </Backbutton>
              <Contexttitle>
                <Contextname>{pagetitle}</Contextname>
              </Contexttitle>
            </Contextbar>
          </Maindiv>}

          {/* 게시글을 읽는 중 — 보던 목록(또는 유저 페이지)으로 되돌아간다 */}
          {isnoticedetail &&
          <Maindiv>
            <Contextbar>
              <Backbutton type="button" aria-label="뒤로 가기" onClick={goback}>
                <Backicon/>
              </Backbutton>
              <Contexttitle>
                <Contextname>게시글</Contextname>
              </Contexttitle>
            </Contextbar>
          </Maindiv>}
          <Searchdiv>
            
          <Searchfield ref={searchref} className="usersearch">
        <Usersearchinput type="search" placeholder="유저 닉네임을 입력하세요"
         onChange={(e)=>{usersearch(e)}}
            className="usersearch"
            />
        
        {searchdata && 
            <Searchresult className="usersearch" ref={ref}>

            {searchdata.map((data)=>{
           
           return(
                <Userdata username={data.username} usernickname={data.nickname}/>
               
            )
        })} </Searchresult>}
        </Searchfield>

          </Searchdiv>
        
        
        
        
        </Wrapper>
        </>
    )
}
export default Header;