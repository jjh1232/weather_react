import React from "react";
import { useState } from "react";
import Button from "../UI/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper=styled.div`
position: relative;
display: flex;
flex-direction: column;
 border: 1px solid black;
align-items: center;   
width:100%;
height:100%;
`
const Headerdiv=styled.div`
  display:flex;
  flex-direction:column;
`
const Logodiv=styled.div`
  
`
const Headertext=styled.h3`
  
`
const Maindiv=styled.div`
   display:flex;
  flex-direction:column;
`
const Idinput=styled.input`
  
`
const Subbutton=styled.button`
  
`
const Bottomdiv=styled.div`
  display:flex;
`
const Guidetext=styled.h3`
  
`
const Navitag=styled.a`
  
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
      <Headerdiv>
        <Logodiv>
   로고
        </Logodiv>
        <Headertext>
      비밀번호를찾으려는 이메일을 작성해 주십시오
        </Headertext>
    
      </Headerdiv>
    
      <Maindiv>
       이메일: <Idinput type="text" onChange={(e)=>Setemail(e.target.value)}/>

       <Subbutton onClick={findpassword}> 
          확인
       </Subbutton>
    
   
      </Maindiv>
      <Bottomdiv>
        <Guidetext>
  아이디가기억나지않으신다면?
        </Guidetext>
        <Navitag href="/memberidfind">
          아이디찾기
        </Navitag>
     
      </Bottomdiv>
    </Wrapper>
  
  )
}
export  default Memberpasswordfind