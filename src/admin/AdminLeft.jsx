import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loginpage from "../MemberPage/Loginpage"

const Wrapper=styled.div`
    background-color:rgb(78,80,82);
    margin-top:-1%;
    width: 18%;
    height: 100%;
    
`
const Menu=styled.h3`
    color: white;
`
export default function AdminLeft(){


    if(!window.location.pathname.includes("/admin")) return null

    if(window.location.pathname.includes("/admin/loginhistory")) return null
    const navigate=useNavigate();


   
    return (
        <Wrapper>
             
                <div onClick={()=>{navigate("/admin")}}>
                    <Menu>홈</Menu>
                    </div>
                <div onClick={()=>{navigate("/admin/member")}}><Menu>회원관리</Menu></div>
                <div onClick={()=>{navigate("/admin/notice")}}><Menu>게시글관리</Menu></div>
                <div onClick={()=>{navigate("/admin/comment")}}><Menu>댓글관리</Menu></div>
                <div onClick={()=>{navigate("/admin/chatroom")}}><Menu>채팅방관리</Menu></div>

            
           
        </Wrapper>
    )
}