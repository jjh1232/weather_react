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
height:100vh;
`
const Contentdiv=styled.div`
     margin-top: 3%;
   position: relative;
   display: flex;
   flex-direction: column;
   width: 45%;
   max-width: 800px;
   min-width: 600px;

   height: 75%;
   border: 1px solid black;
`

const Headerdiv=styled.div`
  display:flex;
  flex-direction:column;
`
const Logodiv=styled.div`
    width: 100%;
  height:100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid blue;
`
const Headertext=styled.h3`
    padding-top: 20px;
  text-align: center;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Maindiv=styled.div`
position: relative;
display: flex;
flex-direction: column;
align-items: center;
//justify-content: center;
height: 30%;

border: 1px solid green;
`
const Inputdiv=styled.input`
    width: 40%;
    height: 18%;
    border: 5%;
  
     margin-top: 10px;
       font-size: 18px;
        border: 1.5px solid #ccc; /* 연한 회색 테두리 */
  border-radius: 8px;       /* 둥근 모서리 */
  outline: none;
  padding: 1px 5px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
 
`
const Validationdiv=styled.div`

width: 42%;
min-height: 18px;
color: red;
font-size: 14px;
`
const Findbutton=styled.button`

  margin-top: 30px;
  width: 42%;
  height: 20%;
  font-size: 20px;
  color: white;
  background-color: #3ca0fd;
  cursor: pointer;
    transition: background-color 0.3s; 

  :hover{
    background-color: #0082fc;
  }
`
const Resultdiv=styled.div`
  margin-top: 10px;
  border: 1px solid blue;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 20%;
`
const Bottomdiv=styled.div`

    position: relative;
display: flex;
//padding-top: 5px;
//align-items: center;
justify-content: center;
height: 25%;
//border: 1px solid black;
`
const Helpdiv=styled.div`
  display: flex;
 
  height: 20%;
  gap: 10px;
`
const Guidetext=styled.h4`
  display: flex;
  align-items: center;
  justify-content: center;
  //border: 1px solid black;
  padding: 0;
  margin: 0;
`
const Navitag=styled.h4`
  cursor: pointer;
 // border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
   padding: 0;
  margin: 0;
  color: green;
`
function Memberpasswordfind(){
const [email,Setemail]=useState();
const url=`/open/passwordfind`
const navigate=useNavigate();

const [result,setResult]=useState({
   error: null,
  message: null,
  status: null,
  username: null,
  provider: null,
}
);

const findpassword=()=>{
  axios.get(url,{
    params:{
        email:email
    }

  }).then((res)=>{
    console.log("레슽",res.data)
   setResult({
      error: null,
      message: null,
      status: res.data.status,
      username: res.data.username,
      provider: res.data.provider,
    });
   
  }).catch((err)=>{
    console.log("에러",err.response.data)
    if(err.response&&err.response.data){
      const data=err.response.data;
          setResult({
        error: null,
        message: data.message || "알 수 없는 오류가 발생했습니다.",
        status: data.errorcode || "UNKNOWN_ERROR",
        username: null,
        provider: null,
      });
  }else {
      setResult({
        error: "NETWORK_ERROR",
        message: "서버에 연결할 수 없습니다. 네트워크를 확인하세요.",
        status: null,
        username: null,
        provider: null,
      });
    }
})
}


  return (
    <Wrapper>
      <Contentdiv>
      <Headerdiv>
        <Logodiv>
   로고
        </Logodiv>
        <Headertext>
      비밀번호를찾으려는 이메일을 작성해 주십시오
        </Headertext>
    
      </Headerdiv>
    
      <Maindiv>
       <Inputdiv type="text" onChange={(e)=>Setemail(e.target.value)} placeholder="이메일"/>

       <Findbutton onClick={findpassword}> 
          제출
       </Findbutton>
        <Resultdiv>
          {result.error&&
              (
                <>
                서버상태가 좋지않습니다 잠시후이용해주세요
                
                </>
      
    )}
    {!result.error&&result.status==="NOT_FOUND_USER" && (
      <>
        없는사용자이메일입니다
      </>
    )}
     {!result.error&&result.status==="oauthuser" && (
      <>
        {result.username} 님은 {result.provider} 사용자입니다 해당로그인기능을이용해주세요
      </>
    )}
     {!result.error&&result.status==="Success" && (
      <>
        {result.username}님의 이메일로 임시비밀번호를 보냈습니다 해당 비밀번호로로그인해주세요
      </>
    )}
        </Resultdiv>
   
      </Maindiv>
      <Bottomdiv>
      <Helpdiv>

  
        <Guidetext>
  아이디가기억나지않으신다면?
        </Guidetext>
        <Navitag onClick={()=>{navigate("/memberidfind")}}>
          아이디찾기
        </Navitag>
         </Helpdiv>
      </Bottomdiv>
      </Contentdiv>
    </Wrapper>
  
  )
}
export  default Memberpasswordfind