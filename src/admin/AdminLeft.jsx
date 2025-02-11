import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loginpage from "../MemberPage/Loginpage"

const Wrapper=styled.div`
    position: fixed;
    background-color:rgb(78,80,82);
    margin-top:-1%;
    width: 18%;
    height: 105%;
    
`

const MenuMain=styled.div`
position: relative;
display: flex;
flex-direction: column;
height: 400px;
top:200px;
border: 1px solid blue;

`
const Menu=styled.div`
    display: flex;
    float: left;
    font-size:25px;
    color: white;
    align-items : center;
border: 1px solid gray;
flex-grow: 1;
`
export default function AdminLeft(){


    if(!window.location.pathname.includes("/admin")) return null

    if(window.location.pathname.includes("/admin/loginhistory")) return null
    const navigate=useNavigate();


   
    return (
        <Wrapper>
             
             <MenuMain>

                    <Menu onClick={()=>{navigate("/admin")}}>홈</Menu>
                    
              <Menu onClick={()=>{navigate("/admin/member")}}>회원관리</Menu>
               <Menu onClick={()=>{navigate("/admin/notice")}}>게시글관리</Menu>
               <Menu onClick={()=>{navigate("/admin/comment")}}>댓글관리</Menu>
                <Menu onClick={()=>{navigate("/admin/chatroom")}}>채팅방관리</Menu>

                </MenuMain>
           
        </Wrapper>
    )
}