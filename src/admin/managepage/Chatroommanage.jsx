import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import Pagenation from "../../customhook/Pagenation";
import { useSearchParams } from "react-router-dom";
import Chatroomlist from "./list/Chatroomlist";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import { useNavigate } from "react-router-dom";

const Wrapper=styled.div`
    text-align: center;

`
export default function Chatroommanage(){
    const axiosintance=CreateAxios();
    const [chatroom,setChatroom]=useState();
   const [totalpage,setTotalpage]=useState();
  
    const [query,setQuery]=useSearchParams();
    const navigate=useNavigate();
    const querydata={
                    page:parseInt(query.get("page")) || 1,
                    option:query.get("option") ,
                    keyword:query.get("keyword") 
            
                }

    const options=[
        {value:"roomname",name:"채팅방이름"}, 
        {value:"partilist",name:"참가리스트"},
        {value:"chattext", name:"채팅내용"} 
    ]
     
      useEffect(()=>{
        getchatroomlist();
        },[querydata.page,querydata.option,querydata.keyword])
    
        const getchatroomlist=()=>{
            axiosintance.get("/admin/chatroommanage",{
                params:{page:querydata.page,
                    option:querydata.option,
                    searchtext:querydata.keyword}
            })
            .then((res)=>{
                console.log("관리자멤버"+res)
                setChatroom(res.data.content)
                setTotalpage(res.data.totalPages)
            })
        }

    return (
        <Wrapper>
            <AdminSearchtools 
            searchdatas={querydata}
            options={options}
            url={"/admin/chatroom"}
            />
            채티방관리
            <table >
                <tr>
                    <th>채팅방id</th>
                    <th>채팅방이름</th>
                    <th>채팅방참가리스트</th>
                    <th>마지막채팅</th>
                    <th>총채팅수</th>
                    <th>마지막채팅날짜</th>
                    <th>채팅방생성날짜</th>
                    
                    

                </tr>
            {chatroom&&chatroom.map((data,key)=>{
                return ( <>
                                    <Chatroomlist data={data} key={key}
                                
                                    />
                                        
                                   </>)
            })}
            </table>
         <Pagenation  totalpage={totalpage}
                              url={"/admin/chatroom"}
                                querydata={querydata}
                              />
        </Wrapper>
    )
}