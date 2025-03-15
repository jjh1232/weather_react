import React from "react";
import Chatroomlistitem from "./Chatroomlistitem" 
import { useState,useEffect } from "react";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";

const Wrapper=styled.div`
    
`

function Chatroomlist(props){
    const [chatroomlistdata,setChatroomlistdata]=useState();

    
    const axiosinstance=CreateAxios();
    useEffect(()=>{
        findchatroom()
    
    },[])

    

    const findchatroom=()=>{
        axiosinstance.get("http://localhost:8081/findchatroomlist")
        .then((res)=>{
            console.log(res.data)
            setChatroomlistdata(res.data)

        }).catch((err)=>{
            console.log("룸리스트를불러오지못했습니다:"+err)
        })
    }

    //여기에서 함수전달해야 자연스럽게 리렌더링되네
    const exit=(roomid)=>{
        axiosinstance.post("/chatroomexit",{
    
            roomid:roomid
    
        }).then((res)=>{
            console.log("성공적")
            findchatroom()
        })
        .catch((err)=>{
            console.log("에러")
        })
        }

        //접속함수도 여기서만들자 
        const intotheroom=(roomdata)=>{


            props.setContent("chatroom");
            props.setRoomid(roomdata.roomid);
        }
        
    return (

        <Wrapper style={{width:"100%",height:"100%", overflow:"auto"}}>
        {chatroomlistdata&&chatroomlistdata.length>0?chatroomlistdata.map((data)=>{
            return(
                
                <Chatroomlistitem chatroomdata={data} onclick={exit} inroom={intotheroom}
               
                
               
                />
            
            )
        })
    :<>친구와채팅을 이용해보세요!</>
    }
       
        </Wrapper>
    

    )



}
export default Chatroomlist;