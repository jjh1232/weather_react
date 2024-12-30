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


const Wrapper=styled.div`
position:relative;
border:1px solid;
top:30%;
left:1.5%;
width:96%;
height:74%;
border: 3px solid blue;
border-radius: 4%;
`
const Modalout=styled.div`
width:14.5% ;
height:63% ;
top:26%;
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
justify-content:center;//왼쪽에서중간
`
const MainBox=styled.div`
display:flex;
position: relative;
//justify-content:space-around;
border:1px solid;
height: 10%;
width: 100%;
bottom:27%;

`

const Boxlist=styled.button`

background:${(props)=>{props.tapcolor===props.data?"blue":"white"}};
width: 100%;
margin: 1%;

`
const Mainscreen=styled.div`
background-color:skyblue     ;
position: relative;
width: 99.9%;
height:89%;
border-radius: 2.1%;
bottom:27%;

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
            <div onClick={makerooms}>채팅방</div>
            </MainBox>     
        
       
        
        
       
        
        {content &&
           
           <Mainscreen > 
           
           {tapmenu[content]}
          
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