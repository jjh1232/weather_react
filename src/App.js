import React,{useState,useEffect} from "react";
import { BrowserRouter,Routes,Route, useNavigate } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import Noticemain from "./Noticepage/Noticemain";
import Noticemainex from "./Noticepage/Noticeex";
import Noticecreate from "./Noticepage/Noticecreate";
import NoticeDetail from "./Noticepage/NoticeDetail";
import NoticeUpdate from "./Noticepage/NoticeUpdate";
import Membercreate from "./MemberPage/Membercreate";
import MainPage from "./MainPage/Main";
import Loginpage from "./MemberPage/Loginpage"
import { CookiesProvider } from "react-cookie";
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
import CenterPage from "./MainPage/CenterPage";
import Lifecycle from "./customhook/Lifecycletest/Lifecycle";
import Twitformex from "./List/noticeformlist/Twitformex";
import Statetest from "./customhook/Statetest";
import Userimage from"./MemberPage/Memberupdata/Userimage";
import Manyimage from "./UI/Manyim/Manyimage";
import FavoriteNotice from "./List/noticeformlist/Favoritenotice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserDetail from "./MemberPage/Memberupdata/UserDetail";
import Adminmain from "./admin/Adminmain";
import Chatroommanage from "./admin/managepage/Chatroommanage";
import Commentmanage from "./admin/managepage/Commentmanage";
import Membermanage from "./admin/managepage/Membermanage";
import Noticemanage from "./admin/managepage/Noticemanage";
import AdminLeft from "./admin/AdminLeft";
import { PrivateRoute } from "./customhook/Admintools/PrivateRoute";
import NoAccess from "./customhook/Admintools/NoAccess";
import ChatroomDetail from "./admin/managepage/list/ChatroomDetail";
import Adminnoticedetail from "./admin/managepage/list/Adminnoticedetail";
import Adminloginhistory from "./customhook/Admintools/Adminloginhistory";
import MainLayout from "./MainPage/MainLayout";
import theme from "./UI/Manyim/Themecss";
import { createGlobalStyle } from "styled-components";
import Mainout from "./UI/Manyim/Mainout";
import Imageform from "./List/noticeformlist/Imageform/Imageform";
import Twitformver from "./List/noticeformlist/Twitformver";
const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
    transition: background 0.3s, color 0.3s;
  }
`;


function App(props) {
  const [isdarkmode,setIsdarkmode]=useState(false);
  
const queryClient=new QueryClient()

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
      <ThemeProvider theme={theme(isdarkmode?"dark":"light")}>
     <GlobalStyle/>
      
    <BrowserRouter>
    
  
    
    
    <Routes>
    <Route path="/" element={<MainLayout />}>

    <Route element={<PrivateRoute/>}>
      <Route path="/admin" element={<Adminmain/>}/>
      <Route path="/admin/chatroom" element={<Chatroommanage/>}/>
      <Route path="/admin/comment" element={<Commentmanage/>}/>
      <Route path="/admin/member" element={<Membermanage/>}/>
      <Route path="/admin/notice" element={<Noticemanage/>}/>
      <Route path="/admin/room/:roomid" element={<ChatroomDetail/>}/>
      <Route path="/admin/notice/detail/:noticeid" element={<Adminnoticedetail/>}/>
      <Route path="/admin/loginhistory" element={<Adminloginhistory/>}/>
    </Route>
    
    
    
    <Route path="test1" element={<Statetest/>}/>
    <Route path="/lifecycle" element={<Lifecycle/>}/>
   
    <Route path="/notice" element={<Twitformex/>}>
      <Route path="imgform" element={<Imageform/>}/>
      <Route path="twitform/liked" element={<Twitformver />}/>
      <Route  path="twitform"index element={<Twitformver/>}/>
    </Route>
    
   <Route path="/" element={<Twitformex />}>
  <Route index element={<Twitformver />} />
</Route>
    
     
    
    <Route path="/oauth2loginfailed" element={<Oauth2loginfailed/>}/>
   
    <Route path="notice" element={<CenterPage/>}/>
    <Route path="userprofile" element={<Userimage/>}/>
      <Route path="main" element={<Twitformex/>}/>
      <Route path="noticeex/:page" element={<Noticemainex/>}/>
      <Route path="noticelogic" element={<NoticelistView/>}/>
      <Route path="noticecreate" element={<Noticecreate/>}/>
      <Route path="noticedetail/:num" element={<NoticeDetail/>}/>
      <Route path="noticeupdate/:num" element={<NoticeUpdate/>}/>
      <Route path="membercreate" element={<Membercreate/>}/>
      <Route path="login" element={<Loginpage/>}/>
      <Route path="memberidfind" element={<Memberidfind/>}/>
      <Route path="memberpasswordfind" element={<Memberpasswordfind/>}/>
      <Route path="memberupdate" element={<MemberNicknameupdate/>}/>
      <Route path="memberdeletepage" element={<Memberdeletepage/>}/>
      <Route path="weatherregion" element={<Weatherregion/>}/>
      <Route path="chatex" element={<Chatex/>}/>
      <Route path="readchat" element={<CreateReadChat/>}/>
      <Route path="usertest" element={<Usertestex/>}/>
      <Route path="stompex" element={<Stompalrams/>}/>
     <Route path="chatui" element={<ChatUi/>}/>
      <Route path="userviewtest" element={<Userviewtest/>}/>
      <Route path="/userpage/:username" element={<UserDetail/>}/>
      <Route path="/noaccess" element={<NoAccess/>}/>

      </Route> 
      <Route path="manyimage" element={<Manyimage/>}/>
    </Routes>
   
    </BrowserRouter>
    </ThemeProvider>
    </CookiesProvider>

    
     <ReactQueryDevtools/>
     
    </QueryClientProvider>
     
  )
  
}

export default App;
