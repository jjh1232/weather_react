import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import Pagenation from "../../customhook/Pagenation";

const Wrapper=styled.div`
    text-align: center;

`
export default function Chatroommanage(){
    const axiosintance=CreateAxios();
    const [chatroom,setChatroom]=useState();
   const [totalpage,setTotalpage]=useState();
    const [totalelement,setTotalelement]=useState();
    const [currentpage,setCurrentpage]=useState(1);

      useEffect(()=>{
        getchatroomlist();
        },[])
    
        const getchatroomlist=()=>{
            axiosintance.get("/admin/chatroommanage",{
                params:{page:currentpage}
            })
            .then((res)=>{
                console.log("관리자멤버"+res)
                setChatroom(res.data.content)
                setTotalpage(res.data.totalPages)
            })
        }

    return (
        <Wrapper>
            채티방관리
            <table >
                <tr>
                    <th>채팅방id</th>
                    <th>채팅방이름</th>
                    <th>채팅방참가리스트</th>
                    <th>채팅방생성날짜</th>
                    
                    

                </tr>
            {chatroom&&chatroom.map((data)=>{
                return (<tr>
                    <td>{data.roomid}</td>
                    <td>{data.roomname}</td>
                    <td>{data.namelist.map((name)=>{return(<div>{name.membernickname}</div>)})}</td>
                    <td>{data.red}</td>
                </tr>)
            })}
            </table>
            <Pagenation currentpage={currentpage} totalpage={totalpage}
                        setCurrentpage={setCurrentpage}
                        />
        </Wrapper>
    )
}