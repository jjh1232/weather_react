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

const Wrapper=styled.div`
position:relative;
float:left;
top:7%;
height: 80px;
display: flex;
border: 1px solid black;
//border-bottom: 1px solid;
border-radius: 3%;
background-color: wheat;
`
const Infodiv=styled.div`
  display: flex;
  flex-direction: column;

`
const Userdatadiv=styled.div`
 
 border: 1px solid blue;
 display: flex;
`
const Quickbuttondiv=styled.div`

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

const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
const ProfileText=styled.div`
  
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

  const [alarmchat,Setalrmchat]=useState("없음")

  const navigate=useNavigate();
  //const form = new FormData(); 폼데이터형식
  //form.append("email", "asd");
  //form.append("password","1234")
  const url="/login";

  const logincheck=AuthCheck();


  useEffect(()=>{
    console.log("실행")
    Setislogin(logincheck);
   
  },[islogin])

 
  //SSe실행
  const sse=()=>{
  
    console.log("sse시작")
    //const eventSource = new EventSource('http://localhost:8081/ssetest')// 일반 sse요청 헤더못넣음
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
    console.log("연결성공")
    removeLoginuser("Refreshtoken");
          removeLoginuser("Acesstoken");
          //삭제해줘야함
          setLoginuser("Acesstoken",res.headers.get("Authorization"),{path:"/"})
          setLoginuser("Refreshtoken",res.headers.get("Refreshtoken"),{path:"/"})
   }
  
   eventSource.onopen=()=>{
    console.log("연결성공!")
  
   
  }
  eventSource.onmessage= (e)=>{
    console.log("알림메세지ex")
    const res=e.data;
    //const js=JSON.parse(res)
    
    console.log(res)
    
  
  }
  eventSource.onerror=(e)=>{
    console.log("에러 ㅜ")
    eventSource.close();
    
  }
  }
  useEffect(()=>{
    if(logincheck===true){
      sse();
    }
    else{
      console.log("로그인안함")
    }
  },[])
  //oauth2로그인===================
const googlelogin=()=>{
  let googleurl= "http://localhost:8081/oauth2/authorization/google";
  document.location.href=googleurl;
}

const naverlogin=()=>{
  let naverurl="http://localhost:8081/oauth2/authorization/naver";
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

    axios.get("/memberlogout").then((res)=>{
      
    })
    removeloginuser("userinfo");
    removeloginuser("Refreshtoken");
    removeloginuser("Acesstoken");
    removeloginuser("weather")
    alert("로그아웃되었습니다")
    Setislogin(false)
    navigate("/main")
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
    <Wrapper>
   
  
    {!islogin?  

        <div>
      <form>
     이메일 :<input style= {{width:"150px"}}type="text" name="username" onChange={(e)=>Setloginform({...loginform,username:e.target.value})}/>
      <br/>
      비밀번호:<input style= {{width:"150px"}} type="password"  name="password" onChange={(e)=>Setloginform({...loginform,password:e.target.value})}/>
      
      <button style= {{height:"20px"}}type="submit" onClick={login} >로그인</button> 
      </form>
            
      <Button title="아이디찾기" onClick={()=>{
        navigate(`/memberidfind`)
      }}/>
    <Button title="비밀번호찾기" onClick={()=>{
      navigate(`/memberpasswordfind`)
    }}/>
    <Button title="회원가입" onClick={()=>{
                    navigate(`/membercreate`)

                }}/>
                <br/>

    <a onClick={googlelogin}>
      구글로그인

    </a>
     <a onClick={naverlogin} >  
    

    <img src={`${process.env.PUBLIC_URL}/img/NAVERBTG.png`}
      style={{width:"110px", padding:"10px"}}
    />
       </a> 
               
   </div>

   : <>
   <Infodiv>
   <Userdatadiv>
    
    <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+loginuser.userinfo["profileimg"]}
   style={{objectFit:"fill",width:"100%",height:"100%"}}
                />
    </Profileview>
      {loginuser.userinfo["nickname"]}님환영합니다! 
      
     {alarmchat}
     </Userdatadiv>
        <Quickbuttondiv>
     <Button title="로그아웃" onClick={logout}/>
    <Button title="정보수정" onClick={()=>{
      navigate("/memberupdate")
    }}/>
    </Quickbuttondiv>
    
    </Infodiv>
    <Menudiv>

   <Menustyle onClick={
    (e)=>{Setmenuover(!menuover)}} onMouseOut={()=>{Setmenuover(true)}}
    >
      
    <img src="/img/menu.png"  style={{objectFit:"fill",width:"100%",height:"100%"}}/>   

    {menuover &&<Dropdown />}
    
    
    </Menustyle>
    </Menudiv>
    
    

   </>
   }
    
   

    </Wrapper>
  )
}
export default Loginpage;