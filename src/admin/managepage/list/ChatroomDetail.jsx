
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CreateAxios from "../../../customhook/CreateAxios";



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
        <div>
            {roomdata&&<>
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
        </div>
    )
}