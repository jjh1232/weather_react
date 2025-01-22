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
    position: absolute;
    top: 0%;
    left:18%;
    width: 80%;
    height: 99%;
    border: 1px solid black;
    text-align: center;

`
const Header=styled.div`
    
`
const Chatcrbutton=styled.button`
    position: relative;
    float:left;
    border: 1px solid black;
`
const Chatsearch=styled.div`
    position: relative;
    float: right;
    right: 0%;
   
`
const Maintable=styled.table`
width:100%;
height: 80%;
border: 1px solid black;
float   :left ;
`
const TableHeader=styled.thead`
    background-color:rgb(44,44,44);
`
const Thcss=styled.th`
    color: white;
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
        {value:"email", name:"이메일검색"} 
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
            <Header>
            <h3>채팅방관리</h3>
            <Chatsearch>
            <AdminSearchtools 
            searchdatas={querydata}
            options={options}
            url={"/admin/chatroom"}
            />
            </Chatsearch>
            </Header>
            <Maintable >
                <TableHeader>
                <tr>
                    <Thcss>채팅방id</Thcss>
                    <Thcss>채팅방이름</Thcss>
                    <Thcss>채팅방참가리스트</Thcss>
                    <Thcss>마지막채팅</Thcss>
                    <Thcss>총채팅수</Thcss>
                    <Thcss>마지막채팅날짜</Thcss>
                    <Thcss>채팅방생성날짜</Thcss>
                    <Thcss>채팅방관리</Thcss>
                    
                    

                </tr>
                </TableHeader>
            {chatroom&&chatroom.map((data,key)=>{
                return ( <>
                                    <Chatroomlist data={data} key={key}
                                
                                    />
                                        
                                   </>)
            })}
            </Maintable>
            <br/>
         <Pagenation  totalpage={totalpage}
                              url={"/admin/chatroom"}
                                querydata={querydata}
                              />
        </Wrapper>
    )
}