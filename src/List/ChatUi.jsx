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


const Modalout=styled.div`
width:290px ;

height:560px ;
top:220px;

margin: 1px;
position: fixed;
background:rgba(0,0,0,0.5);
display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center; //위로부터 중간
border-radius: 4%;
`
const Modalin=styled.div`
padding: 10px;
width:68%;
height:50%;
bottom: 5%;
position: relative;
background-color: #FFFFFF;
color:black;
border-radius: 5%;
justify-content:center;//왼쪽에서중간
`


const Wrapper=styled.div`
display: flex;
flex-direction: column;
position:relative;
border:1px solid;
top:60px;

width:290px;
height:570px;
border: 8px solid black;
border-radius: 4%;
overflow: hidden;


`

const MainBox=styled.div`
display:flex;
position: relative;
//justify-content:space-around;


height: 5%;
width: 100%;
//border-top-right-radius:20%;
//border-top-left-radius: 20%%;
overflow: hidden;
`

const Boxlist=styled.button`

background-color:${(props)=>props.tapcolor===props.data?"blue":"black"};

color: white;
border: 1px solid gray;
width: 100%;

border-top-left-radius: 15%;
border-top-right-radius: 15%;


 :hover{
    background-color: blue;
}
`

const Mainscreen=styled.div`
background-color:${(props)=>props.theme.background};

position: relative;
width: 99.9%;
height:600px;
//border-bottom-left-radius: 4%;
//border-end-end-radius: 4%;



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
        
        axiosinstance.post(`http://localhost:8081/createchatroom`,{
            
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
        chatroom:<Chatex setcontent={setContent} roomid={roomstateid}/>
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
        
        <Wrapper>
       
        
        
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
       
    )


}

export default ChatUi;