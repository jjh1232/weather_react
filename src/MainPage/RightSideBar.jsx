import React from "react";
import styled from "styled-components";
import CreateAxios from "../customhook/CreateAxios";
import { useState,useEffect,useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Userdata from "../UI/Modals/Userdata";
import Loginpage from "../MemberPage/Loginpage";
import ChatUi from "../List/ChatUi";
import { useLocation } from "react-router-dom";

const Wrapper=styled.div`

width:15%;
height:85%;
position: fixed;
right:13%;
top:3px;

//border: 1px solid;


`


const Usersearchinput=styled.input`
position:fixed;
top:0.5%;
left:72%;
width:15%;

`
function RightSideBar(){

    if(window.location.pathname.includes("/admin")) return null
    if(window.location.pathname===`/userprofile`) return null

    if(window.location.pathname===`/manyimage`) return null
   
    //데이터에 정보를 넘겨주자 

    const [data,setData]=useState({
       
        listname:"",
        roomid:""
    });
    const navigate=useNavigate();
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
            console.log("요소가 화면에보입니다")
           }
        else{
            console.log("요소안잡")
        }
    },[inview])
    //검색창 외부클릭시
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
//================================================================
//유즈로케이션을 이용한 컴포넌트가리기 
/*
if(window.location.pathname==="/noticecreate"){
        const location=useLocation();
        console.log(location)
        return (
            null
        )
    }
        */

    //유저검색
    const usersearch=(e)=>{
    console.log(e.target.value)
    axios.get("/open/usersearch?nickname="+e.target.value).then((res)=>{
        console.log(res.data)
        setSearchdata(res.data)
    }).catch((err)=>{
        console.log("err")
    })
}
    

    return (
        
        <Wrapper >

        <Loginpage/>
       {/*
       <div ref={searchref} className="usersearch">
        <Usersearchinput type="search" placeholder="유저닉네임을입력하세요"
         onChange={(e)=>{usersearch(e)}}
            className="usersearch"
            />
        
        {searchdata && 
            <div className ="usersearch"ref={ref} 
            style=
            {{justifyContent:"center",background:"white",top:"30px",
            position:"fixed",zIndex:"10" ,width:"280px",height:"600px",
            overflowY: "scroll"}}>
            {searchdata.map((data)=>{
           
           return(
                <Userdata username={data.username} usernickname={data.nickname}/>
               
            )
        })} </div>}
        
        </div>
        */}
        <ChatUi listname={data.listname} roomid={data.roomid}/>
       
    </Wrapper>
        
    )
}
export default RightSideBar;