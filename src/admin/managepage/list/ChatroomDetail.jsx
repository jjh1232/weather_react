
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CreateAxios from "../../../customhook/CreateAxios";
import styled from "styled-components";
import AdminHeader from "../../../customhook/Admintools/AdminCss/AdminHeader";

const Wrapper=styled.div`
    position: absolute;
    width: 1530px;
    top: 0%;
    left:18.5%;
    border: 1px solid black;
`

const Main=styled.div`
    position: relative;
    width: 1000px;
    border:1px solid blue;
`

export default function ChatroomDetail(props){

    const [roomdata,setRoomdata]=useState();
    const {roomid}=useParams();
     
    const axiosintance=CreateAxios();
    console.log("챗룸디테일")
    useEffect(()=>{
        roomdetailget()
    },[])
    const roomdetailget=()=>{
        axiosintance.get(`/admin/room/${roomid}`).then((res)=>{
            console.log("데이터"+res.data)
            setRoomdata(res.data)
        }).catch((err)=>{
            alert(err)
        })
    }

    return (
        <Wrapper>
            <AdminHeader>
                채팅방관리
            </AdminHeader>
            {roomdata&&
            
            <>
            
           채팅방제목:{roomdata.roomname}
            채팅방개설일:{roomdata.time}
            <br/>
            채팅내역:<div>
                {roomdata.beforechat.map((data)=>{
                    return(
                        <>
                        {data.sender} :{data.message}<br/>
                        {data.createdDate}
                        <br/>
                        </>
                    )
                })}
            </div>
</>}
        </Wrapper>
    )
}