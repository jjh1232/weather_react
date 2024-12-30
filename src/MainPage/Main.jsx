import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Menu from "../UI/Menu";
import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import { useCookies } from "react-cookie";
import Loginpage from "../MemberPage/Loginpage";
import AuthCheck from "../customhook/authCheck"
import * as StompJS from "@stomp/stompjs"
import SockJS from "sockjs-client";
import axios from "axios";
import Userweather from "../UI/Userweather";
import { EventSourcePolyfill } from "event-source-polyfill";
import Header from "./Header";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import Footer from "./Footer";
import CenterPage from "./CenterPage";
import Noticeex from "../Noticepage/Noticeex";

const Wrapper=styled.div`


`



function Mainpage(){

  //여기서 컴포넌트 전체 관리하자 
  








  return(
        
          <Wrapper>
          
                          <button>
                게시판형
            </button>                      
                           
    
      <Noticeex/>
              
                
                
               

{/*푸ㅜ터솔직히필요없음*/}
                <Footer/>
            
            
             
              
                
               
          </Wrapper>



        




   

  )

}
export default Mainpage;