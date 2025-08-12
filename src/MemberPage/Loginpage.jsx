import React, { useContext, useRef } from "react"
import Button from "../UI/Button"
import { useState } from "react";
import axios  from "axios";
import { useCookies } from "react-cookie";
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


//로그인이전 css 
const BeforeWrapper=styled.div`
  position:relative;
float:left;
top:7%;
//width: 295px;
width: 320px;
height: 140px;
max-height: 140px;

display: flex;
flex-direction: column;
border: 1px solid ${(props)=>props.theme.text};
//border-bottom: 1px solid;
color: ${(props)=>props.theme.text};
background:${(props)=>props.theme.background};
border-radius: 3%;

`
const Loginfromdiv=styled.div`
  margin: 3px;
  display:flex;
  height: 40%;
 
`
//로그인디브폼
const LoginButton=styled.button`
margin: 2px;
margin-left: 4px;
border-radius: 3%;
  width: 60px;
  height: 45px;
  font-size: 15px;
  color: white;
  box-shadow: 0 4px 12px 0 rgba(5,5,0,0.3);
  background: linear-gradient(0deg, #18b0f7 0%, #4aa1db 100%);
  border:1px solid black;
`
const Buttondiv=styled.div`
  
   width: 67px;
   display: flex;
   justify-content:center;
   align-items: center;
`
const Inputcss=styled.input`
  width: 150px;
  border-radius: 10%;
  background-color: #f1f4f5;
  
`
const Inputdiv=styled.div`
  
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  float: right;
  
  
`

const FindFormdiv=styled.div`
 
  display: flex;
  height: 20%;
  text-align: center;
  margin: 5px;
  font-size: 15px;
  
`
const Subbuttoncss=styled.div`
  border-right: 1px solid gray;
  width: 33%;
  display: flex;
  align-items: center;
  justify-content: center;
 
`
const Subtext=styled.span`
  position: relative;
   cursor: pointer;
   
   &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px; /* 밑줄 두께 */
    background: #5c5d5e; /* 밑줄 색상 */
    transform: scaleX(0); //콘텐츠카로크기를곱하는것0을하면안보인다!
   
  }

  &:hover::after {
    transform: scaleX(1);
  }
`
const Authdiv=styled.div`
display: flex;
position: relative;
margin: 3px;
height: 30%;
 
`
const Authimage=styled.img`
  width: 45%;
  //flex: 1;
  padding:5px;
  height: 38px;

`
//로그인이후 css=====================================================================

const Wrapper=styled.div`
position:relative;
float:left;
top:7%;
width: 320px;
height: 140px;
display: flex;
flex-direction: column;
border: 2px solid black;
//border-bottom: 1px solid;
border-radius: 3%;
color: ${(props)=>props.theme.text};
background:${(props)=>props.theme.background};
`

const Infodiv=styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  
`
const Userdatadiv=styled.div`
 height: 60%;

 display: flex;

`

const Profileview=styled.div`
    border:1px solid black;
  
    flex:3;
    display: flex;
  align-items: center;
  justify-content: center;

`
const Loginprofileimg=styled.img`
    width:50px;
    background-color: white;
    height:50px;
    object-fit: fill;
    border: 1px solid black;
`
const ProfileTextdiv=styled.div`
  border:1px solid blue;
  display: flex;
  align-items: center;
  //justify-content: center;
  font-size: 15px;
  flex:10;
`

const Logdiv=styled.div`
  border:1px solid green;
  flex:2;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Imoticondiv=styled.div`
  position: relative;
  border: 1px solid red;
`
const Imotebatge=styled.div`
position: absolute;
top: -6px;
right: -6px;
  border:1px solid red;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  min-width:18px;
  text-align: center;
  
  pointer-events: none;
`
const Quickbuttondiv=styled.div`
display: flex;
align-items: center;
  justify-content: center;
border:1px solid green;
height: 38%;
`
const QUickButtonitemdiv=styled.div`
  
`
const Notificationdiv=styled.div`
  position: absolute;
  top: 40px;
  right: -230px;
  z-index: 30;
`
const QuickButtonitem=styled.span`
position: relative;
   cursor: pointer;
   
   &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px; /* 밑줄 두께 */
    background: #5c5d5e; /* 밑줄 색상 */
    transform: scaleX(0); //콘텐츠카로크기를곱하는것0을하면안보인다!
   
  }

  &:hover::after {
    transform: scaleX(1);
  }

`

const Menudiv=styled.div`
  border: 1px solid red;
  width: 20%;
`
const Menustyle= styled.ul`
width:40px;
height: 50px;

border: 1px solid yellow;
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
  
  const axiosinstance=CreateAxios();
  const navigate=useNavigate();
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

  //알람메세지가져오기
  const {data:notificount,isLoading,error}=useQuery({
    queryKey:["notificount"],
    queryFn:async()=>{
      const res=await axiosinstance.get("/notificationcount")
      Setalrmchatcount(res.data)
      return res.data;
    },
    enabled:!!loginuser.userinfo //!!연산자는 값이있으면 true 없으면 false로
  })
  


 

  



  //oauth2로그인===================
const googlelogin=()=>{
  const prevpath=window.location.pathname;
  //스태이트정보로 로그인시 현재페이지가게 인코딩안하면 특수문자때매이상해진다함
  //스태이트만들었는데 뭐어저고저쩌고해서 안된다함
  //이전페이지를 미리 저장해두고 성공페이지에서이동하자
  localStorage.setItem("oauthbeforepath",window.location.pathname);
  let googleurl= `http://localhost:8081/oauth2/authorization/google?state=${encodeURIComponent(prevpath)}`;
  document.location.href=googleurl;
}

const naverlogin=()=>{
  const prevpath=window.location.pathname;
  localStorage.setItem("oauthbeforepath",window.location.pathname);
  let naverurl=`http://localhost:8081/oauth2/authorization/naver?state=${encodeURIComponent(prevpath)}`;
    document.location.href=naverurl;


     
  
}

 const login= (e)=>{
  console.log(loginform.username)
  e.preventDefault();
      if(loginvalidate()){
      axios.post(url,{
        
       username:loginform.username,
       password:loginform.password
        
        }).then((result) => {
          alert("성공")
  
            
            Setloginuser("Acesstoken",result.headers.get("Authorization"))
            Setloginuser("Refreshtoken",result.headers.get("Refreshtoken"))
            window.location.reload()
            
     
         
           
        
        
      }).catch((err) => {
       
       alert(err.response.data.msg)
       console.log(err)
      }, {withCredentials: true});
    }
  
    
  }
  const loginvalidate=()=>{
    if (loginform.username===''){
      alert("아이디를입력해주세요")
      return false
    }
    else if(loginform.password===''){
      alert("비밀번호를입력해주세요")
      return false
    }
    else{
      return true;
    }
  }


  const logout=()=>{

    axiosinstance.get("/memberlogout").then((res)=>{
      console.log(res)
    
       removeloginuser("userinfo");
    removeloginuser("Refreshtoken");
    removeloginuser("Acesstoken");
    removeloginuser("weather")
    alert("로그아웃되었습니다")
    Setislogin(false)
    navigate("/")
    window.location.reload();
    })
   
  }


const ssetest=()=>{
  axiosinstance.get("/emittercheck");
}
 

  
  
 

  return (
    <>
   
  
    {!islogin?  
    <BeforeWrapper>
        <Loginfromdiv>
        <Inputdiv>
      <label > 이메일 :
     <Inputcss  type="text" name="username" onChange={(e)=>Setloginform({...loginform,username:e.target.value})}/>
     </label>
     <label > 비밀번호:<Inputcss  type="password"  name="password" onChange={(e)=>Setloginform({...loginform,password:e.target.value})}/>
     </label>
    
      
            
    </Inputdiv>
    <Buttondiv>
      <LoginButton type="submit" onClick={login} >로그인</LoginButton> 
      </Buttondiv>
               
   </Loginfromdiv>
   
                <Authdiv>

            
       <Authimage src={`${process.env.PUBLIC_URL}/img/google.png`}
      onClick={googlelogin}
    />

    


    

    <Authimage src={`${process.env.PUBLIC_URL}/img/NAVERBTG.png`}
      onClick={naverlogin}
    />
       
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
    <Loginprofileimg   src={process.env.PUBLIC_URL+"/userprofileimg"+loginuser?.userinfo["profileimg"]}
  
                />
    </Profileview>
    
    <ProfileTextdiv>
      {loginuser.userinfo["nickname"]}님
      <br/>
      {loginuser.userinfo["username"]} 
      </ProfileTextdiv>
      <Logdiv>
      <Imoticondiv onClick={()=>{setisnotify(!isnotify)}}>
        <FontAwesomeIcon icon={bell} size="2x"/>
        <Imotebatge>
         {alarmChatCount}
        </Imotebatge>
        
        </Imoticondiv>
        {isnotify&&<Notificationdiv>
          <UserNotification />
          
        </Notificationdiv>}
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
      navigate(`/userpage/${loginuser.userinfo["username"]}`)
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
      <div onClick={ssetest}>
      sse테스트
      </div>
      <div onClick={()=>setAlarmChatCount((prev)=>prev+1)}>
        카운트 임시로올려보기
      </div>
          
 
    </Quickbuttondiv>
    
    </Infodiv>
 
    
    

   </Wrapper>
   }
    
   

    </>
  )
}
export default Loginpage;