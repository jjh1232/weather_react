import React, { useRef } from "react"
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


//로그인이전 css 
const BeforeWrapper=styled.div`
  position:relative;
float:left;
top:7%;
width: 295px;
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
width: 295px;
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
  const client=useRef(null)
  const [menuover,Setmenuover]=useState(false)
  const [isnotify,setisnotify]=useState(false);
  const [alarmchatcount,Setalrmchatcount]=useState()
  const axiosinstance=CreateAxios();
  const navigate=useNavigate();
  //const form = new FormData(); 폼데이터형식
  //form.append("email", "asd");
  //form.append("password","1234")
  const url="/login";

  const logincheck=AuthCheck();


  let eventsource=null;


    useEffect(()=>{
    if(logincheck===true){
      eventsource=sse();
    }
    else{
      console.log("로그인안함")
    }
  },[logincheck])

useEffect(()=>{
    console.log("실행")
    Setislogin(logincheck);
   
  },[islogin])

  //알람메세지가져오기
  const {data:notificount,isLoading,error}=useQuery({
    queryKey:["notificount"],
    queryFn:async()=>{
      const res=await axiosinstance.get("/notificationcount")
      Setalrmchatcount(res.data)
      return res.data;
    },
    enabled:logincheck
  })
  


 
  //SSe실행
  const sse=()=>{
  
    console.log("sse시작")
    //const eventSource = new EventSource('http://localhost:8081/ssetest')
    // 위에는 일반 sse요청 헤더못넣음
    const eventSource= new EventSourcePolyfill(
      "http://localhost:8081/ssesub",{
      headers:{
        Authorization:"Bearer "+loginuser.Acesstoken,
        Refreshtoken:"Bearer "+loginuser.Refreshtoken
      },
      withCredentials:true,
    }
   )
  
  
   
   eventSource.onopen=(res)=>{
    console.log("sse연결성공"+res)
    //removeLoginuser("Refreshtoken");
          //removeLoginuser("Acesstoken");
          //삭제해줘야함
         // setLoginuser("Acesstoken",res.headers.get("Authorization"),{path:"/"})
          //setLoginuser("Refreshtoken",res.headers.get("Refreshtoken"),{path:"/"})
   }
  
   /*
   eventSource.onopen=()=>{
    console.log("연결성공!")
  
   
  }
    */
  eventSource.onmessage= (e)=>{
    console.log("알림메세지ex")
    const res=e.data;
    //const js=JSON.parse(res)
    Setalrmchatcount((prev)=>prev+1)
    console.log("알림메세지ex:"+res)
    
  
  }
  eventSource.onerror=(e)=>{
    console.log("에러 ㅜ")
    eventSource.close();
    
  }
  return eventSource;
  }



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

    
    /* 각종 oauth서비스는 a태그로이동해야함 
    axios.get(naverurl).then((res)=>{
      console.log("정보전달성공?");
     }).catch((error)=>{
      console.log("에로")
     });
     */
     
  
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
       /* 
        if(result.data.result===null){
          alert("아이디를확인해주세요")
        }
        else if(result.data.result==="notpass"){
          alert("비밀번호를확인해주세요")
        }
        */
        //else{
          //Setloginuser('loginuser',result.data.result)
          //alert(`${result.data.result}님 환영합니다!`)
            
            Setloginuser("Acesstoken",result.headers.get("Authorization"))
            Setloginuser("Refreshtoken",result.headers.get("Refreshtoken"))
            window.location.reload()
            
           /* 
           console.log(loginuser.member)
            console.log(loginuser)
         alert(`${result.data.member.name}환영합니다`)
           Setislogin(true)
       } */
         
           
        
        
      }).catch((err) => {
       // alert(`${loginform.email}`)
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
    })
   
  }



  //stomp 연결
  const stopmgo=()=>{
    console.log("흠")
 
    console.log("스톰프")
    if(islogin){
  console.log("로그인유저있음");
    client.current=new StompJS.Client({
      brokerURL:"ws://localhost:8081/open/stomp",
      //webSocketFactory:()=>SockJs,
      //Authorization: "authoo",
      //connectHeaders:{
      //  auth:"auth",
      //},
      
  

      onConnect:()=>{
        console.log("구독함수시작")
        subcribe(loginuser.userinfo["username"]);//연결시작시구독
      }
    })
   
  
    client.current.activate();
  }
    else{
      console.log("로그인부터해줘");
    }
  }



  const disconnect=()=>{
    console.log("연결끊김")
    client.current.deactivate();
  }
  
  const subcribe=(username)=>{
    console.log("구독함수")
    console.log(username)
    client.current.subscribe("/sub/"+username,(data)=>{
      console.log(username)
      console.log("구독시작")
      //const js=JSON.parse(data.body)
      //console.log(js)
      Setalrmchat(data.body)
    })
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
    <Loginprofileimg   src={process.env.PUBLIC_URL+"/userprofileimg"+loginuser.userinfo["profileimg"]}
  
                />
    </Profileview>
    
    <ProfileTextdiv>
      {loginuser.userinfo["nickname"]}님환영합니다! 
      <br/>
      {loginuser.userinfo["username"]} 
      </ProfileTextdiv>
      <Logdiv>
      <Imoticondiv onClick={()=>{setisnotify(!isnotify)}}>
        <FontAwesomeIcon icon={bell} size="2x"/>
        <Imotebatge>
         
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
      
          
 
    </Quickbuttondiv>
    
    </Infodiv>
 
    
    

   </Wrapper>
   }
    
   

    </>
  )
}
export default Loginpage;