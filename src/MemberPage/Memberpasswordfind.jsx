import React from "react";
import { useState } from "react";
import Button from "../UI/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Validators } from "../UI/Modals/Validators";

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
     margin-top: 5%;
   position: relative;
   display: flex;
   flex-direction: column;
   width: 45%;
   max-width: 800px;
   min-width: 600px;

   height: 75%;

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
  margin-bottom:25px ;
`
const Headertext=styled.h3`
    padding-top: 5px;
  text-align: center;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size:25px;
`
const Maindiv=styled.div`
position: relative;
display: flex;
flex-direction: column;
align-items: center;
//justify-content: center;
height: 30%;


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
padding-top:5px;
width: 40%;
display: flex;
justify-content: center;
min-height: 20px;
color: red;
font-size: 15px;
`
const Findbutton=styled.button`

  margin-top: 7px;
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
  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 75%;
  font-size:18px;
  height: 30%;
  font-weight: 600;
  color: white;
  
`
const Bottomdiv=styled.div`

    position: relative;
display: flex;
padding-top: 50px;
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
const [valierr,setvalierr]=useState();
 const [touched,setTouched]=useState(false)
const [result,setResult]=useState({
   error: null,
  message: null,
  status: null,
  username: null,
  provider: null,
}
);
const Inputhanlder=(e)=>{
    Setemail(e.target.value)

      if (touched) {
    // 이미 input을 한번 blur 했으면, 입력시마다(실시간) 검사
    const err = Validators("username", e.target.value);
    setvalierr(err);
    
  }
   


   
  }

  const handleBlur = (e) => {
  // 입력값이 있을 때만 유효성 검사
  if (email) {
      const err=Validators("username",e.target.value)

  setvalierr(err);
  } else {
    setvalierr(""); // 빈 값이면 에러 메시지도 숨김
  }
  setTouched(true)
};
const findpassword=()=>{
  if(valierr){
    alert("이메일형식을확인해주세요!")
    return ;
  }
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
       <Inputdiv type="text" onChange={(e)=>Inputhanlder(e)} onBlur={(e)=>handleBlur(e)} placeholder="이메일"/>

    <Validationdiv>
      {valierr&&<>{valierr}</>}
    </Validationdiv>
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
        {result.username} 님은 {result.provider} 사용자입니다 <br/>해당로그인기능을이용해주세요
      </>
    )}
     {!result.error&&result.status==="Success" && (
      <>
        {result.username}님의 이메일로  임시비밀번호를 보냈습니다  <br/>해당 비밀번호로로그인해주세요
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