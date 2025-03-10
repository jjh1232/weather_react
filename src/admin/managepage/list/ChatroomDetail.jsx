
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CreateAxios from "../../../customhook/CreateAxios";
import styled from "styled-components";
import AdminHeader from "../../../customhook/Admintools/AdminCss/AdminHeader";
import AdminCalander from "../../../customhook/Admintools/AdminCss/AdminCalander";

const Wrapper=styled.div`
    position: absolute;
   
    width: 1530px;
    
    top: 0%;
    left:18.1%;
    border: 1px solid black;

`
const ChatSetting=styled.div`
    display: relative;
    width: 1000px;

    border:1px solid black;
    `
    
const ChatDatecss=styled.div`
   
`
const Main=styled.div`
    position: relative;
    width: 1000px;
    height: 700px;
    border:1px solid red;
    overflow: auto;
`
const Chatdiv=styled.div`
   display: flex;
    border:1px solid red;
`
const Profile=styled.img`
    position: relative;
    border:1px solid blue;
    width: 50px;
    height: 50px;
`
const ChatContainer=styled.div`
    position: relative;
    flex-direction: column;
    width: fit-content;
    display: flex;
    border:1px solid blue;

`
const ChatTop=styled.div`
    border:1px solid green;
    width: 100%;
`
const ChatMain=styled.div`
     border:1px solid yellow;
     width:100%;
`
const Chatbottom=styled.div`
    border:1px solid black;
    text-align: right;
    min-width: 65px;
    width:100%;
`
const Callendercss=styled.div`
    border: 1px solid yellow;
    width: 400px;
    height: 530px;
    left: 1400px;
    bottom: 100px;
    z-index: 100;
    background-color: gray;
    position: fixed;
    
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
           

        }).catch((err)=>{
            alert(err)
        })
    }
  //섹션으로 날짜나누기
    const makeSection=(chatdata)=>{
        let chatmonth={}
        
        chatdata.map((chat)=>{
            
            let monthDate=chat.red.substr(0,10)
            console.log("날짜"+monthDate)
            if(Array.isArray(chatmonth[monthDate])){
                chatmonth[monthDate].push(chat)
            }else{
                chatmonth[monthDate]=[chat]
            }
            
        })
        return chatmonth;
    }
    //캘린더로이동
    let dat=new Date();

    const moveCurrent=(date)=>{
        console.log(date)
       
        const daten=date.year+"-"+date.month.padStart(2,`0`)+"-"+date.day.padStart(2,`0`)
        console.log("버튼:"+daten)
        const move=document.createElement(`button`)
        move.onclick=()=>{
            document.getElementById(daten)?.scrollIntoView({behavior:"smooth"})
        }
        move.click();
        
    }

    return (
        <Wrapper>
            
            <AdminHeader>
           
               <h2 style={{position:"relative",top:"30%"}} >채팅방관리</h2> 
                           </AdminHeader>
            {roomdata&&
            
            <>
     
            <ChatSetting>
                
            <h3 style={{position:"relative",float:"left"}}> 방이름:{roomdata.roomname}</h3>
          
            <h3 style={{float:"right",border:"1px solid blue"}}>  개설일:{roomdata.time}</h3>
            
            </ChatSetting>
            
            <br/>
           <Main>
                {monthchat&&
                <>
                  
                {Object.entries(monthchat).map(([date,chats])=>{
                    return(
                        <ChatDatecss key={date} id={date}>
                            <div style={{textAlign:"center"}}>{date}</div>
                            {chats.map((chat)=>{
                                return (
                                    <Chatdiv>
                        
                            <Profile src={process.env.PUBLIC_URL+"/userprofileimg"+chat.userprofile}/>
                                    <ChatContainer>
                        <ChatTop>
                        {chat.writer}
                        </ChatTop>
                        <ChatMain>
                        {chat.message}
                        </ChatMain>
                        <Chatbottom>
                            {chat.red.substr(11,5)}
                        </Chatbottom>
                        </ChatContainer>
                        {
                        //chat.createdDate
                        }
                        <br/>
                        </Chatdiv>
                                )
                            })}
                        
                        </ChatDatecss >
                    )
                })
            }
                </>
}

            </Main>
</>}            
< Callendercss>

        <AdminCalander currentdate={dat} movemethod={moveCurrent} chatdata={monthchat}></AdminCalander>
</ Callendercss>
                <div style={{border:"1px solid blue" ,height:"100px"}}></div>
              
        </Wrapper>
    )
}
