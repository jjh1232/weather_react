
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CreateAxios from "../../../customhook/CreateAxios";
import styled from "styled-components";
import AdminHeader from "../../../customhook/Admintools/AdminCss/AdminHeader";

const Wrapper=styled.div`
    position: absolute;
   
    width: 1530px;
    
    top: 0%;
    left:18.1%;
    border: 1px solid black;

`
const ChatSetting=styled.div`
    position: relative;
`
const Main=styled.div`
    position: relative;
    width: 1000px;
    height: 700px;
    border:1px solid blue;
    overflow: auto;
`
const Chatdiv=styled.div`
    
`

export default function ChatroomDetail(props){

    const [roomdata,setRoomdata]=useState();
    const {roomid}=useParams();
    let monthch;
    const [monthchat,setMonthchat]=useState();
    const axiosintance=CreateAxios();
    console.log("챗룸디테일")
    useEffect(()=>{
        roomdetailget()
    },[])
    const roomdetailget=()=>{
        axiosintance.get(`/admin/room/${roomid}`).then((res)=>{
            console.log("데이터"+res.data)
            setRoomdata(res.data)
            setMonthchat(makeSection(res.data.beforechat))
           console.log(monthchat)

        }).catch((err)=>{
            alert(err)
        })
    }
  //섹션으로 날짜나누기
    const makeSection=(chatdata)=>{
        let chatmonth={}
        console.log("챗데이터"+chatdata)
        chatdata.map((chat)=>{
            
            let monthDate=chat.createdDate.substr(0,10)
            console.log("날짜"+monthDate)
            if(Array.isArray(chatmonth[monthDate])){
                chatmonth[monthDate].push(chat)
            }else{
                chatmonth[monthDate]=[chat]
            }
            
        })
        return chatmonth;
    }

    

    return (
        <Wrapper>
            <AdminHeader>
               <h2 style={{position:"relative",top:"30%"}} >채팅방관리</h2> 
                           </AdminHeader>
            {roomdata&&
            
            <>

            <ChatSetting>
            <h3> 방이름:{roomdata.roomname}</h3>
          
                <h3>   채팅방개설일:{roomdata.time}</h3>
            
            </ChatSetting>
            
            <br/>
           <Main>
                {monthchat&&
                <>
                  
                {Object.entries(monthchat).map(([date,chats])=>{
                    return(
                        <div key={date}>
                            <>{date}</>
                            {chats.map((chat)=>{
                                return (
                                    <Chatdiv>
                        
                            
                        {chat.sender}:{chat.message}<br/>

                        {
                        //chat.createdDate
                        }
                        <br/>
                        </Chatdiv>
                                )
                            })}
                        
                        </div>
                    )
                })
            }
                </>
}
            </Main>
</>}
                <div style={{border:"1px solid blue" ,height:"100px"}}></div>
        </Wrapper>
    )
}