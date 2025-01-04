import React,{useState,useEffect} from "react";
import { BrowserRouter,Routes,Route, useNavigate } from "react-router-dom";
import styled from "styled-components";
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


const MainTitleText = styled.p`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
`;


function App(props) {
  
const queryClient=new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
    <div className="background" style={{
     // backgroundImage:'url(/front/background/rain.gif)',
     backgroundColor:"skyblue",
      backgroundRepeat:"no-repeat",
      backgroundPosition:"top center",
      backgroundSize:`cover`,
      position:"fixed",
      overflow:`auto`,
      backgroundAttachment:`local`,
      width:"100%",
      height:"100vh"

      //backgroundAttachment:"fixed",
    
     }}>
      <CookiesProvider>
      
    <BrowserRouter>
    
    <Header/>
    
    <LeftSideBar/>
    <RightSideBar/>
   
    <Routes>
    <Route path="/favoritenotice" element={<FavoriteNotice/>}/>
    <Route path="manyimage" element={<Manyimage/>}/>
    <Route path="test1" element={<Statetest/>}/>
    <Route path="/lifecycle" element={<Lifecycle/>}/>
    <Route path="/notice/twitform" element={<Twitformex/>}/>
    <Route path="/oauth2loginfailed" element={<Oauth2loginfailed/>}/>
    <Route index element={<Twitformex/>}/>
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
      
    </Routes>
    
    </BrowserRouter>
    </CookiesProvider>
    </div>
     <ReactQueryDevtools/>
    </QueryClientProvider>
  )
  
}

export default App;
