import React, { useEffect, useState } from "react";
import CreateAxios from "../customhook/CreateAxios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Chatroomlist from "./Chatroomlist";
import Followlist from "./Followmenus/Followlist";
import Followerlist from "./Followmenus/Followerlist";
import Favoritelist from "./Followmenus/Favoritelist";
import styled from "styled-components";
import Chatex from "./chatex";
import AuthCheck from "../customhook/authCheck";
import { API_BASE } from "../config/api";


// 비로그인 안내 오버레이. 좌표를 고정값으로 잡으면 폰 프레임과 어긋나므로
// 화면(Wrapper) 안을 그대로 덮게 한다.
const Modalout=styled.div`
position: absolute;
inset: 0;
z-index: 20;

background:${(props)=>props.theme.overlay};
-webkit-backdrop-filter: blur(2px);
backdrop-filter: blur(2px);
display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center; //위로부터 중간
padding: 24px;
`
const Modalin=styled.div`
padding: 20px 18px;
width:100%;
position: relative;
background-color: ${(props)=>props.theme.surface};
color:${(props)=>props.theme.text};
border: 1px solid ${(props)=>props.theme.border};
border-radius: ${(props)=>props.theme.radius};
box-shadow: ${(props)=>props.theme.shadowLg};
font-size: 14px;
font-weight: 600;
line-height: 1.5;
text-align: center;
`


// 휴대폰 본체(베젤). 화면(#phone-ui)은 이 안에 들어간다.
// 베젤을 #phone-ui 자체의 border 로 주면 안 된다 - Chatlistmenu/Usermodal 이
// getBoundingClientRect() 로 #phone-ui 좌표를 잡아 모달을 띄우기 때문에
// 테두리 두께만큼 위치가 어긋난다. 그래서 바깥 프레임을 따로 둔다.
const PhoneFrame=styled.div`
position: relative;
flex-shrink: 0;
width: 100%;
max-width: 332px;
padding: 14px 11px 16px;

border-radius: 34px;
background: linear-gradient(160deg, #39434f 0%, #1c232b 55%, #12171d 100%);
box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    inset 0 0 0 1px rgba(0, 0, 0, 0.5),
    ${(props)=>props.theme.shadowLg};

/* 상단 스피커 슬릿 */
&::before {
    content: "";
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
}

/* 좁은 화면에서는 기기 프레임을 벗고 화면만 남긴다 */
@media (max-width: 900px) {
    max-width: none;
    padding: 0;
    border-radius: 0;
    background: none;
    box-shadow: none;

    &::before, &::after { display: none; }
}

/* 하단 홈 인디케이터 */
&::after {
    content: "";
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 96px;
    height: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.22);
}
`

// 화면 영역 (= #phone-ui, 포털 대상). 높이 570px 은 Usermodal 이 전제하고 있어 유지한다.
const Wrapper=styled.div`
display: flex;
flex-direction: column;
position:relative;

width:100%;
height:570px;
overflow: hidden;

border-radius: 22px;
background: ${(props)=>props.theme.surface};
color: ${(props)=>props.theme.text};
`

const MainBox=styled.div`
display:flex;
position: relative;

gap: 4px;
padding: 6px;
flex-shrink: 0;
height: 44px;
width: 100%;
border-bottom: 1px solid ${(props)=>props.theme.border};
background: ${(props)=>props.theme.surfaceAlt};
overflow: hidden;
`

// 탭 버튼
const Boxlist=styled.button`
flex: 1;
border: none;
border-radius: ${(props)=>props.theme.radiusPill};
width: 100%;
font-size: 13px;
font-weight: 600;
letter-spacing: -0.02em;

background-color:${(props)=>props.tapcolor===props.data
    ? props.theme.surface
    : "transparent"};
color: ${(props)=>props.tapcolor===props.data
    ? props.theme.accent
    : props.theme.textMuted};
box-shadow: ${(props)=>props.tapcolor===props.data
    ? props.theme.shadowSm
    : "none"};
transition: background ${(props)=>props.theme.transition},
            color ${(props)=>props.theme.transition};

 :hover{
    color: ${(props)=>props.theme.text};
}
`

// 탭 내용. 고정 높이(600px)를 주면 화면(570px)을 넘어 잘리므로 남은 공간을 채우게 한다.
const Mainscreen=styled.div`
background-color: transparent;

position: relative;
width: 100%;
flex: 1;
min-height: 0;
overflow: auto;
`



//props기본값
ChatUi.defaultProps={
    listname:"followlist",
    roomid:0
}
function ChatUi(props){
    const {listname,roomid}=props
    
    const axiosinstance=CreateAxios();
    const navigate=useNavigate();
    const [userlist,setUserlist]=useState(["dlwjdwns424@naver.com","dlwjdwns1945@gmail.com"]);
    const [content,setContent]=useState("followlist");
   
   const islogin=AuthCheck();

    const [roomstateid,setRoomstateid]=useState(roomid);
 
    const makerooms=()=>{
        
        axiosinstance.post(`${API_BASE}/createchatroom`,{
            
                roomname:"asd,bsd",
                memberlist:userlist
            }
        ).then((res)=>{
            console.log(res.data)
           
            navigate("/chatex?roomid="+res.data)
        }).catch((error)=>{
            console.log(error)
        })
    }
    
  //박스
    
 

    const handlerClickButton = (data)=>{
        
        console.log(data)
        const name=data;
        setContent(name);
       
    }
    

    const onfollow=(friendname)=>{
        console.log("팔로잉실행!")
  
        axiosinstance.get("/follow?friendname="+friendname)
        .then((res)=>{
            console.log("팔로우성공!")
        }).catch((err)=>{
            console.log("팔로우실패!")
        })
    }
    const onunfollow=(friendname)=>{
        console.log("언팔로우!실행")
    
        axiosinstance.delete(`/followdelete/${friendname}`)
        .then((res)=>{
            console.log("팔로우삭제성공!")

        }).catch((err)=>{
            console.log("팔로우삭제실패!")
        })
    }
    const tapmenu={
        followlist:<Followlist setContent={setContent} setRoomid={setRoomstateid}/>,
        followerlist:<Followerlist Onfollow={onfollow} Onunfollow={onunfollow}
        setContent={setContent} setRoomid={setRoomstateid}
        />,
        
        favorite:<Favoritelist setContent={setContent} setRoomid={setRoomstateid}
        
        />,
        chatroomlist:<Chatroomlist setContent={setContent} setRoomid={setRoomstateid}/>,
        chatroom:<Chatex setcontent={setContent} roomid={roomstateid} />
    }

    //유저검색기능
    const usersearch=(e)=>{
        //입력시마다 그냥요청하는듯?
            console.log(e.target.value)
        axiosinstance.get("/usersearch?nickname="+e.target.value).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log("err")
        })

    }
    return(
        
        <PhoneFrame>
        <Wrapper id="phone-ui">
       
        
        
        <MainBox>
        
            <Boxlist data={"followlist"} tapcolor={content} onClick={()=>{handlerClickButton("followlist")}} name={"followlist"}>팔로우</Boxlist>
            <Boxlist data={"followerlist"} tapcolor={content} onClick={()=>{handlerClickButton("followerlist")}} name={"followerlist"}>팔로워</Boxlist>
            <Boxlist data={"favorite"} tapcolor={content} onClick={()=>{handlerClickButton("favorite")}} name={"favorite"}>즐겨찾기</Boxlist>
            <Boxlist data={"chatroomlist"} tapcolor={content} onClick={()=>{handlerClickButton("chatroomlist")}} name={"chatroomlist"}>채팅방</Boxlist>
            
            </MainBox>     
        
       
        
        
       
        
        {content &&
           
           <Mainscreen > 
           
           {islogin&&tapmenu[content]}
          
           </Mainscreen>
         
         
          
}      
        {!islogin&&
        <Modalout>
        <Modalin>
        로그인후 메신저기능을 이용해주세요!
        </Modalin>
        </Modalout>
        }
            
        </Wrapper>
        </PhoneFrame>
       
    )


}

export default ChatUi;