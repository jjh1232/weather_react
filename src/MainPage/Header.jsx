import React, { useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import CreateAxios from "../customhook/CreateAxios";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import Userdata from "../UI/Modals/Userdata";
import styled from "styled-components";
import Loginpage from "../MemberPage/Loginpage";
//import * as deletefiles from `./`

const Wrapper=styled.div`
position: fixed;
left:28%;
border:1px solid;
width:43%;
height:7%;
top:3px;
z-index: 10;
`


function Header(){

    if(window.location.pathname===`/userprofile`) return null
    
    const axiosinstance=CreateAxios();
    const [searchdata,setSearchdata]=useState();
  
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
    //여기도 헤더가리기 
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

const modalon=()=>{

}

if(window.location.pathname===`/manyimage`) return null
    return (
        
        <Wrapper>
            
          {}
        <h1 onClick={()=>{navigate("/notice/twitform")}}>메인페이지</h1>
        
        
        
        </Wrapper>
    )
}
export default Header;