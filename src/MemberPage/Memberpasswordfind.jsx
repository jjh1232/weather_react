import React from "react";
import { useState } from "react";
import Button from "../UI/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;
 top: 8%;
`
function Memberpasswordfind(){
const [email,Setemail]=useState();
const url=`/open/passwordfind`
const navigate=useNavigate();

const findpassword=()=>{
  axios.get(url,{
    params:{
        email:email
    }

  }).then((res)=>{
    alert(res.data)
    navigate(`/main`)
  })
}


  return (
    <Wrapper>
      비밀번호를찾으려는 이메일을 작성해 주십시오
      <br/>
      이메일:<input type="text" onChange={(e)=>Setemail(e.target.value)}/>
      <Button title="확인" onClick={findpassword}/>


    </Wrapper>
  
  )
}
export  default Memberpasswordfind