import React,{useState,useEffect} from "react";
import { BrowserRouter,Routes,Route, useNavigate } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import ErrorBoundary from "./UI/Feedback/ErrorBoundary";
import Noticemain from "./Noticepage/Noticemain";
import Noticemainex from "./Noticepage/Noticeex";
import Noticecreate from "./Noticepage/Noticecreate";
import NoticeDetail from "./Noticepage/NoticeDetail";
import NoticeUpdate from "./Noticepage/NoticeUpdate";
import Membercreate from "./MemberPage/Membercreate";

import Loginpage from "./MemberPage/Loginpage"
import { CookiesProvider } from "react-cookie";
import FeedbackProvider from "./UI/Feedback/FeedbackProvider";
import { Privacypolicy, Terms } from "./MemberPage/Legal/Legaldocs";
import Loginmain from "./MemberPage/Loginmain";
import Memberidfind from "./MemberPage/Memberidfind";
import Memberpasswordfind from "./MemberPage/Memberpasswordfind";
import MemberNicknameupdate from "./MemberPage/Memberupdata/Membernicknameupdate";
import Memberdeletepage from "./MemberPage/Memberdeletepage";
import Weatherregion from "./UI/weatherregion";
import Chatex from "./List/chatex";
import CreateReadChat from"./UI/CreateReadChat";
import Usertestex from "./MainPage/Usertestex";
import Header from "./MainPage/Header";
import Footer from "./MainPage/Footer";
import Oauth2loginfailed from "./MemberPage/Oauth2loginfailed";
import Stompalrams from "./MainPage/Stompalram";
import ChatUi from "./List/ChatUi";
import Userviewtest from "./MainPage/userviewtest";
import RightSideBar from "./MainPage/RightSideBar";
import LeftSideBar from "./MainPage/LeftSideBar";
import NoticelistView from "./Noticepage/NoticePattern/NoticelistView";

import Lifecycle from "./customhook/Lifecycletest/Lifecycle";
import Twitformex from "./List/noticeformlist/Twitformex";
import Statetest from "./customhook/Statetest";
import Userimage from"./MemberPage/Memberupdata/Userimage";
import Manyimage from "./UI/Manyim/Manyimage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserDetail from "./MemberPage/UserPages/UserDetail";
import Adminmain from "./admin/Adminmain";
import Chatroommanage from "./admin/managepage/Chatroommanage";
import Commentmanage from "./admin/managepage/Commentmanage";
import Membermanage from "./admin/managepage/Membermanage";
import Noticemanage from "./admin/managepage/Noticemanage";
import AdminLayout from "./admin/AdminLayout";
import { LoginRoute, NoLoginRoute, PrivateRoute } from "./customhook/Admintools/PrivateRoute";
import NoAccess from "./customhook/Admintools/NoAccess";
import ChatroomDetail from "./admin/managepage/list/ChatroomDetail";
import Adminnoticedetail from "./admin/managepage/list/Adminnoticedetail";
import Adminloginhistory from "./customhook/Admintools/Adminloginhistory";
import MainLayout from "./MainPage/MainLayout";
import theme from "./UI/Manyim/Themecss";
import { createGlobalStyle } from "styled-components";

import Imageform from "./List/noticeformlist/Imageform/Imageform";
import Twitformver from "./List/noticeformlist/Twitformver";
import Noticedetailre from "./Noticepage/Noticedetailre";
import OauthSuccesspage from "./UI/Manyim/OauthSuccesspage";
import { SseProvider } from "./Context/SseProvider";
import Oauth2userextra from "./MemberPage/Oauth2userextra";
import Logindetail from "./MemberPage/Logindetail";
import Userposts from "./MemberPage/UserPages/Userposts";
import UserPhotos from "./MemberPage/UserPages/UserPhotos";
import UserHighlight from "./MemberPage/UserPages/UserHighlight";

// 테마(색)에 의존하는 전역 규칙. 구조 리셋은 index.css 에 있다.
const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.page};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
    transition: background 0.3s ${({ theme }) => theme.ease},
                color 0.3s ${({ theme }) => theme.ease};
  }

  /* 제목 리듬 - 기본 브라우저 값이 너무 크고 굵다 */
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 0.5em;
    font-weight: 650;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }
  h1 { font-size: 1.6rem; }
  h2 { font-size: 1.35rem; }
  h3 { font-size: 1.15rem; }
  h4, h5, h6 { font-size: 1rem; }

  p { margin: 0 0 0.75em; }

  a {
    color: ${({ theme }) => theme.accent};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transition};
  }
  a:hover { color: ${({ theme }) => theme.accentHover}; }

  /* 마우스 클릭엔 링이 안 뜨고, 키보드 탐색에만 뜬다 */
  :focus { outline: none; }
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radiusSm};
  }

  ::selection {
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.text};
  }

  * { scrollbar-color: ${({ theme }) => theme.borderStrong} transparent; }
  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.borderStrong};
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.textFaint};
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.border};
    margin: 16px 0;
  }
`;


//QueryClient 는 앱에서 딱 하나여야 한다.
//컴포넌트 안에서 new 하면 App 이 다시 그려질 때마다 새 클라이언트가 만들어지고,
//그때까지 쌓인 캐시와 "이 데이터 새로 받아라"(invalidateQueries) 신호가 통째로 버려진다.
//이 App 은 1분마다 다크모드를 확인하며 setState 를 하기 때문에 실제로 1분마다 갈렸다.
//(프로필을 수정해도 화면이 안 바뀌고 새로고침해야 했던 이유)
const queryClient=new QueryClient();

function App(props) {
  const [isdarkmode,setIsdarkmode]=useState(false);

//다크모드
useEffect(()=>{
const updatetime=()=>{
  const now=new Date();
  const hours=now.getHours();
  const isnight=hours>=18 || hours<6;
  setIsdarkmode(isnight);
  console.log("다크모드"+isnight)
}
 
  updatetime();
  const interval=setInterval(updatetime,1000* 60);

  return ()=>clearInterval(interval) //컴포넌트 언마운트시 정리

},[])
    return (
    <QueryClientProvider client={queryClient}>

      <CookiesProvider>

      {/* SseProvider 는 반드시 CookiesProvider 안쪽이어야 한다.
          바깥에 두면 useCookies 가 기본 인스턴스로 돌아서, 로그인으로 토큰 쿠키가
          생겨도 다시 그려지지 않는다(=새로고침 전에는 SSE 가 붙지 않는다). */}
      <SseProvider>

      <ThemeProvider theme={theme(isdarkmode?"dark":"light")}>
     <GlobalStyle/>

    {/* 토스트/확인창은 테마 안쪽, 라우터 바깥에 둔다.
        라우트가 바뀌어도 떠 있는 알림이 사라지지 않는다. */}
    <FeedbackProvider>

    {/* 렌더 중 예외가 나도 화면 전체가 백지가 되지 않게 한다.
        ThemeProvider 안쪽이라 안내 화면도 테마 색을 그대로 쓴다.
        라우터를 감싸므로 어느 페이지에서 터져도 잡힌다. */}
    <ErrorBoundary>

    <BrowserRouter>
    
  
    
 

    
    <Routes>
   

    <Route path="admin" element={<PrivateRoute/>}>
      {/* 좌측 네비·상단 여백은 AdminLayout 이 한 번만 그린다.
          예전엔 Adminmain 안에서만 사이드바를 그려서, 회원관리로 들어가는 순간
          메뉴가 사라져 주소를 직접 치지 않으면 다른 화면으로 갈 수 없었다. */}
      <Route element={<AdminLayout/>}>
        <Route index element={<Adminmain/>}/>
        <Route path="chatroom" element={<Chatroommanage/>}/>
        <Route path="comment" element={<Commentmanage/>}/>
        <Route path="member" element={<Membermanage/>}/>
        <Route path="notice" element={<Noticemanage/>}/>
        <Route path="room/:roomid" element={<ChatroomDetail/>}/>
        <Route path="notice/detail/:noticeid" element={<Adminnoticedetail/>}/>
      </Route>

      {/* 로그인기록은 작은 팝업창으로 띄우는 화면이라 네비가 없어야 한다 */}
      <Route path="loginhistory" element={<Adminloginhistory/>}/>
    </Route>

    {
      //메인레아웃없는것
    }
    {/* OAuth 착지 화면은 가드를 걸면 안 된다.
        여기 도착하는 시점에는 아직 토큰이 없다 - 주소의 프래그먼트에서 토큰을 꺼내
        쿠키에 심는 것이 이 화면이 하는 일 전부다. LoginRoute 안에 있으면
        "로그인 안 된 사용자"로 판정돼 렌더 전에 "/" 로 튕기고,
        useEffect 가 돌지 않아 프래그먼트가 통째로 버려진다(= 소셜 로그인이 안 됨).
        예전에 이게 통과됐던 건 LoginRoute 의 조건이 항상 참인 버그였기 때문이다.
        이 화면은 스스로를 지킨다 - 토큰이 없으면 /login 으로 보낸다. */}
    <Route path="/oauthsuccess" element={<OauthSuccesspage/>}/>

    <Route element={<NoLoginRoute/>}>
     <Route path="/oauth2loginfailed" element={<Oauth2loginfailed/>}/>
        
        <Route path="membercreate" element={<Membercreate/>}/>
         <Route path="memberidfind" element={<Memberidfind/>}/>
      <Route path="memberpasswordfind" element={<Memberpasswordfind/>}/>
      <Route path="Loginpage" element={<Logindetail/>}/>
    </Route>
    {/* 약관·처리방침은 로그인 여부와 상관없이 보여야 하고(가입 전에 읽는 문서다),
        하늘 배경·헤더 없이 문서만 떠야 해서 MainLayout 밖에 둔다. */}
    <Route path="/terms" element={<Terms/>}/>
    <Route path="/privacy" element={<Privacypolicy/>}/>

    {/* 로그인 페이지는 하늘 배경·헤더·사이드바 없이 카드 하나만 띄운다.
        예전에는 이 경로가 사이드바용 위젯(Loginpage)을 MainLayout 안에 그대로 그렸다. */}
    <Route path="/login" element={<Loginmain/>}/>

 <Route path="/" element={<MainLayout />}>
    <Route path="/signup/extrainfo" element={<Oauth2userextra/>}/>
    <Route path="test1" element={<Statetest/>}/>
    <Route path="/lifecycle" element={<Lifecycle/>}/>
   
      <Route path="/notice" element={<Twitformex/>}>
        <Route path="imgform" element={<Imageform/>}/>
        <Route path="twitform/liked" element={<Twitformver />}/>
        <Route path="twitform/following" element={<Twitformver />}/>
        <Route  path="twitform"index element={<Twitformver/>}/>
        <Route path="detail/:noticeid" element={<Noticedetailre/>}/>
     </Route>
    

   <Route path="/" element={<Twitformex />}>
  <Route index element={<Twitformver />} />
</Route>
    
     
   
  

       <Route element={<LoginRoute/>}>
    
          <Route path="noticecreate" element={<Noticecreate/>}/>
      <Route path="noticeupdate/:num" element={<NoticeUpdate/>}/>
    </Route>
      {/* Twitformex 는 "글작성하기 + 검색" 헤더와 <Outlet/> 만 그리는 껍데기다.
          자식 라우트가 없으면 Outlet 이 빈칸이라 헤더만 뜨고 글목록이 통째로 안 나온다.
          바로 위 "/" 와 똑같이 index 자식을 붙여준다. */}
      <Route path="main" element={<Twitformex/>}>
        <Route index element={<Twitformver/>}/>
      </Route>
      <Route path="noticeex/:page" element={<Noticemainex/>}/>
      <Route path="noticelogic" element={<NoticelistView/>}/>
    
    
      
   
      <Route path="memberupdate" element={<MemberNicknameupdate/>}/>
      <Route path="memberdeletepage" element={<Memberdeletepage/>}/>
      <Route path="weatherregion" element={<Weatherregion/>}/>
      {/* 좁은 화면에서는 왼쪽 사이드바가 접히므로, 날씨 위젯을 화면 하나로도 연다.
          하단 탭바의 "날씨" 탭이 여기로 온다. */}
      <Route path="weather" element={<LeftSideBar/>}/>
      <Route path="chatex" element={<Chatex/>}/>
      <Route path="readchat" element={<CreateReadChat/>}/>
      <Route path="usertest" element={<Usertestex/>}/>
      <Route path="stompex" element={<Stompalrams/>}/>
     <Route path="chatui" element={<ChatUi/>}/>
      <Route path="userviewtest" element={<Userviewtest/>}/>
      {/*유저페이지 */}
      <Route path="/userpage/:profileid" element={<UserDetail key={window.location.pathname}/>}>
      <Route index element={<Userposts/>}/>
      <Route path="photo" element={<UserPhotos/>}/>
      <Route path="highlight" element={<UserHighlight/>}/>
      </Route>
      <Route path="/noaccess" element={<NoAccess/>}/>

      </Route> 
      {/* 프로필 이미지 편집은 별도 팝업 창으로 뜬다.
          MainLayout 안에 두면 팝업에도 하늘 배경과 하단 탭바가 같이 그려진다. */}
      <Route path="userprofile" element={<Userimage/>}/>
      <Route path="manyimage" element={<Manyimage/>}/>
        
    </Routes>

        </BrowserRouter>


    </ErrorBoundary>
    </FeedbackProvider>
    </ThemeProvider>
    </SseProvider>
    </CookiesProvider>

    
          <ReactQueryDevtools initialIsOpen={true}/>

        </QueryClientProvider>
  )
  
}

export default App;
