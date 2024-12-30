import React from "react";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";



const Liststyle=styled.li`
list-style: none
`



function Dropdown(props){
  const navigate=useNavigate();

  return (
    <>
      <Liststyle>마이페이지</Liststyle>
      <Liststyle onClick={()=>{
        navigate("/memberdeletepage")
      }}>회원탈퇴</Liststyle>
    </>
  )
}
export default Dropdown