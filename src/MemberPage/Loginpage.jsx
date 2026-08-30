import React, { useContext, useRef } from "react"
import Button from "../UI/Button"
import { useState } from "react";
import { GoogleMark, NaverMark, oauthredirect } from "../UI/Authmarks";
import useLogin from "../customhook/useLogin";
import axios  from "axios";
import { useCookies } from "react-cookie";
import { handletext } from "../customhook/Userhandle";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Dropdown from "../UI/Dropdown"
import AuthCheck from "../customhook/authCheck";
import styled from "styled-components";
import Session from "react-session-api";
import * as StompJS from "@stomp/stompjs"
import Userweather from "../UI/Userweather";
import { EventSourcePolyfill } from "event-source-polyfill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell as bell } from "@fortawesome/free-regular-svg-icons";
import Profilediv from "../UI/Modals/Profilediv";
import CreateAxios from "../customhook/CreateAxios";
import { useQuery } from "@tanstack/react-query";
import UserNotification from "./UserNotification";
import { SseContext } from "../Context/SseProvider";
import profileimage from "../UI/profileimage";


//로그인이전 css 
// 사이드바 카드 공통 (로그인 전/후 동일한 틀)
// 위치는 부모(RightSideBar)의 flex 가 잡는다. float/top 을 쓰면 흐름에서 빠져
// 뒤따르는 폰 패널과 같은 자리에 겹친다.
const Cardbase = `
position:relative;
flex-shrink: 0;
width: 100%;
max-width: 340px;
height: 186px;
display: flex;
flex-direction: column;
overflow: hidden;
`

const BeforeWrapper=styled.div`
${Cardbase}

border: 1px solid ${(props)=>props.theme.border};
border-radius: ${(props)=>props.theme.radius};
box-shadow: ${(props)=>props.theme.shadow};
color: ${(props)=>props.theme.text};
background:${(props)=>props.theme.surfaceGlass};
-webkit-backdrop-filter: ${(props)=>props.theme.blur};
backdrop-filter: ${(props)=>props.theme.blur};
`
const Loginfromdiv=styled.div`
  display:flex;
  align-items: stretch;
  gap: 8px;
  flex: 1;
  min-height: 0;
  padding: 12px 12px 8px;
`
//로그인디브폼
const LoginButton=styled.button`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: ${(props)=>props.theme.radiusSm};
  font-size: 14px;
  font-weight: 650;
  color: white;
  background: ${(props)=>props.theme.accent};
  box-shadow: 0 2px 8px ${(props)=>props.theme.accentSoft};
  transition: background ${(props)=>props.theme.transition},
              transform ${(props)=>props.theme.transition};

  &:hover { background: ${(props)=>props.theme.accentHover}; }
  &:active { background: ${(props)=>props.theme.accentActive}; transform: translateY(1px); }
`
const Buttondiv=styled.div`
   width: 66px;
   flex-shrink: 0;
   display: flex;
   justify-content:center;
   align-items: stretch;
`
const Inputcss=styled.input`
  width: 100%;
  flex: 1;
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusSm};
  background-color: ${(props)=>props.theme.surfaceAlt};
  color: ${(props)=>props.theme.text};
  font-size: 13px;
  outline: none;
  transition: border-color ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition};

  &::placeholder { color: ${(props)=>props.theme.textFaint}; }
  &:focus {
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
  }
`
// 이메일/비밀번호를 같은 폭으로 세로로 쌓는다.
// 예전엔 "이메일 :" / "비밀번호:" 라벨 길이가 달라 입력창 왼쪽 끝이 어긋났다.
const Inputdiv=styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
`

const FindFormdiv=styled.div`
  display: flex;
  flex-shrink: 0;
  height: 30px;
  text-align: center;
  padding: 0 10px;
  border-top: 1px solid ${(props)=>props.theme.border};
  font-size: 12px;
  color: ${(props)=>props.theme.textMuted};
`
const Subbuttoncss=styled.div`
  border-right: 1px solid ${(props)=>props.theme.border};
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:last-child { border-right: none; }
`
const Subtext=styled.span`
  position: relative;
   cursor: pointer;
   transition: color ${(props)=>props.theme.transition};

   &:hover { color: ${(props)=>props.theme.accent}; }

   &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px; /* 밑줄 두께 */
    background: ${(props)=>props.theme.accent}; /* 밑줄 색상 */
    transform: scaleX(0); //콘텐츠카로크기를곱하는것0을하면안보인다!
    transition: transform ${(props)=>props.theme.transition};
  }

  &:hover::after {
    transform: scaleX(1);
  }
`
const Authdiv=styled.div`
display: flex;
align-items: center;
justify-content: center;
gap: 8px;
position: relative;
flex-shrink: 0;
height: 56px;
padding: 0 12px;
border-top: 1px solid ${(props)=>props.theme.border};
`
// 구글/네이버가 배포하는 "완성된 버튼 이미지"는 비율과 내부 여백이 서로 달라
// 어떤 크기를 줘도 나란히 놓으면 안 맞는다. 그래서 버튼은 우리가 같은 규격으로 그리고
// 로고 마크만 인라인 SVG 로 넣는다(브랜드 색/모양은 그대로 유지).
const Authbutton=styled.button`
  flex: 1;
  min-width: 0;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 10px;
  border-radius: ${(props)=>props.theme.radiusSm};
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.02em;
  white-space: nowrap;
  cursor: pointer;
  transition: background ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition},
              transform ${(props)=>props.theme.transition};

  svg { flex-shrink: 0; }

  &:active { transform: translateY(1px); }
`
const GoogleButton=styled(Authbutton)`
  border: 1px solid #dadce0;
  background: #ffffff;
  color: #3c4043;

  &:hover {
    background: #f7f8f9;
    box-shadow: ${(props)=>props.theme.shadowSm};
  }
`
const NaverButton=styled(Authbutton)`
  border: 1px solid transparent;
  background: #03c75a;
  color: #ffffff;

  &:hover {
    background: #02b351;
    box-shadow: ${(props)=>props.theme.shadowSm};
  }
`
// 로고 마크
//소셜 아이콘과 OAuth 이동은 UI/Authmarks 로 옮겼다(로그인 페이지와 공용).
//로그인이후 css=====================================================================

const Wrapper=styled.div`
${Cardbase}
border: 1px solid ${(props)=>props.theme.border};
border-radius: ${(props)=>props.theme.radius};
box-shadow: ${(props)=>props.theme.shadow};
color: ${(props)=>props.theme.text};
background:${(props)=>props.theme.surfaceGlass};
-webkit-backdrop-filter: ${(props)=>props.theme.blur};
backdrop-filter: ${(props)=>props.theme.blur};
`

const Infodiv=styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  
`
const Userdatadiv=styled.div`
 height: 60%;
 display: flex;
 align-items: center;
 padding: 0 10px;
 gap: 8px;
`

const Profileview=styled.div`
    flex:3;
    display: flex;
  align-items: center;
  justify-content: center;
`
const Loginprofileimg=styled.img`
    width:50px;
    height:50px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid ${(props)=>props.theme.border};
    background-color: ${(props)=>props.theme.surfaceAlt};
`
const ProfileTextdiv=styled.div`
  display: flex;
  align-items: center;
  //justify-content: center;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  flex:10;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Logdiv=styled.div`
  flex:2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${(props)=>props.theme.textMuted};
  cursor: pointer;
  transition: color ${(props)=>props.theme.transition};

  &:hover { color: ${(props)=>props.theme.accent}; }
`
const Imoticondiv=styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Imotebatge=styled.div`
position: absolute;
top: -6px;
right: -6px;
  padding: 0 4px;
  border-radius: ${(props)=>props.theme.radiusPill};
  background: ${(props)=>props.theme.warning};
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  line-height: 18px;
  min-width:18px;
  text-align: center;
  box-shadow: ${(props)=>props.theme.shadowSm};
  
  pointer-events: none;
`
const Quickbuttondiv=styled.div`
display: flex;
align-items: center;
  justify-content: space-around;
  gap: 6px;
  padding: 0 10px;
height: 38%;
border-top: 1px solid ${(props)=>props.theme.border};
font-size: 13px;
color: ${(props)=>props.theme.textMuted};
`
const QUickButtonitemdiv=styled.div`
  
`
//알림 패널은 이제 스스로 #modal-root 에 fixed 로 뜬다.
//예전에는 여기서 absolute 로 밀어냈는데, 로그인 카드에 overflow:hidden 이 걸려 있어
//패널이 잘려 보였다(오른쪽으로 -230px 밀어낸 것도 그 때문이었다).
const QuickButtonitem=styled.span`
position: relative;
   cursor: pointer;
   transition: color ${(props)=>props.theme.transition};

   &:hover { color: ${(props)=>props.theme.accent}; }

   &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px; /* 밑줄 두께 */
    background: ${(props)=>props.theme.accent}; /* 밑줄 색상 */
    transform: scaleX(0); //콘텐츠카로크기를곱하는것0을하면안보인다!
    transition: transform ${(props)=>props.theme.transition};
  }

  &:hover::after {
    transform: scaleX(1);
  }

`

const Menudiv=styled.div`
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Menustyle= styled.ul`
width:40px;
height: 50px;
margin: 0;
padding: 0;
//position:relative;
//list-style: none;

`




function Loginpage(props){
  
  const [islogin,Setislogin]=useState();
     const [loginform,Setloginform]=useState({
    username: '',
    password: ''
  });
  const [loginuser,Setloginuser,removeloginuser]=useCookies(['userinfo'])
  
    const [isnotify,setisnotify]=useState(false);
  //알림 패널이 종 아래에 뜨도록 위치를 알려준다.
  const bellref=useRef(null);
  
  const axiosinstance=CreateAxios();
  const navigate=useNavigate();
  const {login:dologin}=useLogin();
  //const form = new FormData(); 폼데이터형식
  //form.append("email", "asd");
  //form.append("password","1234")
  const url="/login";

  

  const {alarmChatCount,setAlarmChatCount}=useContext(SseContext);



useEffect(()=>{
  console.log("Alarm Refresh, new value:", alarmChatCount)
}, [alarmChatCount])


useEffect(()=>{
     Setislogin(!!loginuser.userinfo); 
   
  },[loginuser])

    //안 읽은 알림 수. 첫 진입 때 한 번 받아 배지에 채운다.
  //(그 뒤로는 SSE 가 실시간으로 올려준다)
  //함수 이름이 Setalrmchatcount 로 잘못 적혀 있어서 이 쿼리가 매번 터졌고,
  //그래서 배지가 SSE 로만 움직이고 화면을 옮겨야 맞춰지는 것처럼 보였다.
  const {data:notificount,isLoading,error}=useQuery({
    queryKey:["notificount"],
    queryFn:async()=>{
      const res=await axiosinstance.get("/notificationcount")
      setAlarmChatCount(Number(res.data))
      return res.data;
    },
    enabled:!!loginuser.userinfo //!!연산자는 값이있으면 true 없으면 false로
  })
  


 

  



  //oauth2로그인===================
//이전 페이지를 미리 저장해두고 성공 페이지에서 되돌아간다(Authmarks.oauthredirect).
const googlelogin=()=>oauthredirect("google");

const naverlogin=()=>oauthredirect("naver");

 //제출 로직은 로그인 페이지(Loginmain)와 같은 훅을 쓴다.
  //여기(사이드바)에서는 페이지를 옮기지 않고 현재 화면만 새로 그린다.
  const login= (e)=>{
    e.preventDefault();
    dologin(loginform);
  }


  const logout=()=>{

    //브라우저 쪽 정리. 서버 요청이 성공했든 실패했든 반드시 한다.
    //예전엔 .then 안에서만 지워서, 서버가 안 떠 있거나 네트워크가 끊기면
    //로그아웃 버튼을 눌러도 아무 일도 일어나지 않았다.
    const clearsession=()=>{
      //쿠키는 심을 때와 같은 path 를 줘야 지워진다.
      //(CreateAxios 가 응답마다 path:"/" 로 심는다. path 없이 remove 하면
      // 현재 주소 기준으로만 지워서 "/" 에 있는 쿠키가 그대로 남는다)
      removeloginuser("userinfo",{path:"/"});
      removeloginuser("Refreshtoken",{path:"/"});
      removeloginuser("Acesstoken",{path:"/"});
      removeloginuser("weather",{path:"/"});
      alert("로그아웃되었습니다")
      Setislogin(false)
      navigate("/")
      window.location.reload();
    }

    axiosinstance.get("/memberlogout")
      .catch((err)=>{
        //서버 쪽 정리(SSE 연결 해제·리프레쉬 토큰 삭제)가 실패해도
        //브라우저는 로그아웃시켜야 한다.
        console.log("로그아웃 요청 실패. 브라우저 쪽만 정리한다.",err)
      })
      .finally(clearsession)

  }



 

  
  
 

  return (
    <>
   
  
    {!loginuser.userinfo?  
    <BeforeWrapper>
        <Loginfromdiv>
        {/* 라벨을 밖에 두면 "이메일 :" / "비밀번호:" 글자 수가 달라 입력창이 어긋난다.
            플레이스홀더로 넣으면 두 칸이 정확히 같은 폭으로 맞는다. */}
        <Inputdiv>
     <Inputcss  type="text" name="username" placeholder="이메일" aria-label="이메일"
       onChange={(e)=>Setloginform({...loginform,username:e.target.value})}/>

     <Inputcss  type="password"  name="password" placeholder="비밀번호" aria-label="비밀번호"
       onChange={(e)=>Setloginform({...loginform,password:e.target.value})}/>
    </Inputdiv>
    <Buttondiv>
      <LoginButton type="submit" onClick={login} >로그인</LoginButton> 
      </Buttondiv>
               
   </Loginfromdiv>
   
                <Authdiv>

       <GoogleButton type="button" onClick={googlelogin}>
         <GoogleMark/> Google
       </GoogleButton>

       <NaverButton type="button" onClick={naverlogin}>
         <NaverMark/> 네이버
       </NaverButton>
       
                </Authdiv>
                <FindFormdiv>
   <Subbuttoncss >
      <Subtext onClick={()=>{
        navigate(`/memberidfind`)
      }}>
      아이디찾기
      </Subtext>
      </Subbuttoncss>
    <Subbuttoncss   >
      <Subtext onClick={()=>{
      navigate(`/memberpasswordfind`)

    }}>
      비밀번호찾기
      </Subtext>
      </Subbuttoncss>
    <Subbuttoncss  >
                  <Subtext  onClick={()=>{
                    navigate(`/membercreate`)

                }}>
                  회원가입
                  </Subtext>
                </Subbuttoncss>
                </FindFormdiv>

</BeforeWrapper>
   : 
   <Wrapper>
   <Infodiv>
   <Userdatadiv>
    
    <Profileview>
    <Loginprofileimg   src={profileimage(loginuser?.userinfo["profileimg"])}
  
                />
    </Profileview>
    
    <ProfileTextdiv>
      {loginuser.userinfo["nickname"]}님
      <br/>
      {handletext(loginuser.userinfo["profileid"],loginuser.userinfo["username"])} 
      </ProfileTextdiv>
      <Logdiv>
            <Imoticondiv ref={bellref} onClick={()=>{setisnotify(!isnotify)}}
        title="알림">
        <FontAwesomeIcon icon={bell} size="2x"/>
        {alarmChatCount>0 &&
        <Imotebatge>
         {alarmChatCount}
        </Imotebatge>}

        </Imoticondiv>
        {isnotify&&
          <UserNotification anchorref={bellref} onClose={()=>setisnotify(false)}/>}
     {/* 이거메뉴버전
       <Menustyle onClick={
        (e)=>{Setmenuover(!menuover)}} onMouseOut={()=>{Setmenuover(true)}}
        >
          
        <img src="/img/menu.png"  style={{objectFit:"fill",width:"100%",height:"100%"}}/>   
    
        {menuover &&<Dropdown />}
        
        
        </Menustyle>
        */
    
     }
     </Logdiv>
     </Userdatadiv>
        <Quickbuttondiv>
          <QuickButtonitem onClick={()=>{
      navigate(`/userpage/${loginuser.userinfo["profileid"]||loginuser.userinfo["username"]}`)
    }}>
          마이페이지
          </QuickButtonitem>

          <QuickButtonitem  onClick={()=>{
      navigate("/memberupdate")
    }}>
          정보수정
          </QuickButtonitem>
     
          <QuickButtonitem onClick={logout}>
          로그아웃
          </QuickButtonitem>
      
          
 
    </Quickbuttondiv>
    
    </Infodiv>
 
    
    

   </Wrapper>
   }
    
   

    </>
  )
}
export default Loginpage;