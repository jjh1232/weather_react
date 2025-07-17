import React from "react";
import Chatroomlistitem from "./Chatroomlistitem" 
import { useState,useEffect } from "react";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

const Wrapper=styled.div`
    
`

function Chatroomlist(props){
    const [chatroomlistdata,setChatroomlistdata]=useState();

    const [cookie]=useCookies(["userinfo"])
    
    const axiosinstance=CreateAxios();
    

    const {data:chatroominfo}=useQuery({
        queryKey:["chatroominfo",cookie.userinfo.userid],
        queryFn:async()=>{
                const res =await axiosinstance.get("/findchatroominfo");

                console.log("챗룸인포:",res)
                return res.data;
        }
    })
    
    const roomids=chatroominfo? chatroominfo.map(room=>room.roomid):[];
    
    const {data:chatroommeta}=useQuery({
        queryKey:["chatroommeta",cookie.userinfo.userid],
        queryFn:async()=>{
            const res = await axiosinstance.post("/findchatroommeta",roomids)
            
            console.log("메타데이터:",res)
            return res.data;
        },
        enabled:roomids.length>0
    })


    useEffect(()=>{
        //findchatroom()
        if(!chatroominfo || !chatroommeta) return;

        //meta데이터를 roomid기준으로 빠르게찾기위한 map 생성
        const metaMap=new Map();
       
        chatroommeta.forEach((meta)=>{
           
            metaMap.set(meta.roomid,meta);
        })
      
        //chatroominfo각아이템에 meta정보병합
        const merged=chatroominfo.map((room)=>({
            ...room,
            ...metaMap.get(room.roomid),
        }))
        console.log("머지데이터:",merged)
        setChatroomlistdata(merged);
         console.log("챗리스트데이터:",chatroomlistdata)
    },[chatroominfo,chatroommeta])

   

   

        //접속함수도 여기서만들자 
        const intotheroom=(roomdata)=>{


            props.setContent("chatroom");
            props.setRoomid(roomdata.roomid);
        }
        
    return (

        <Wrapper style={{width:"100%",height:"100%", overflow:"auto"}}>
        {Array.isArray(chatroomlistdata)&&chatroomlistdata.length>0?chatroomlistdata.map((data)=>{
            return(
                
                <Chatroomlistitem key={data.roomid}
                chatroomdata={data}  inroom={intotheroom}
               
                
               
                />
            
            )
        })
    :<>친구와채팅을 이용해보세요!</>
    }
    
       
        </Wrapper>
    

    )



}
export default Chatroomlist;