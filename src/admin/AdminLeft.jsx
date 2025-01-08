import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLeft(){

    if(!window.location.pathname.includes("/admin")) return null
    const navigate=useNavigate();


   
    return (
        <div>
            <td>
                <tr onClick={()=>{navigate("/admin/member")}}>회원관리</tr>
                <tr onClick={()=>{navigate("/admin/notice")}}>게시글관리</tr>
                <tr onClick={()=>{navigate("/admin/comment")}}>유저댓글관리</tr>
                <tr onClick={()=>{navigate("/admin/chatroom")}}>채팅방관리</tr>

            </td>
           
        </div>
    )
}