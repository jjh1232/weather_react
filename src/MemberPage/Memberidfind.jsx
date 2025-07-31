import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { Validators } from "../UI/Modals/Validators";
import { useNavigate } from "react-router-dom";

const Wrapper=styled.div`
position: relative;
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
height: 100vh;

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
  display: flex;
  flex-direction: column;
 

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
height: 20%;
//max-height: 300px;
//border: 1px solid red;

`

const Inputdiv=styled.input`
    width: 40%;
    height: 25%;
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

width: 40%;
min-height: 18px;
color: red;
font-size: 14px;
`

const Findbutton=styled.button`
  margin-top: 5px;
  width: 40%;
  height: 27%;
`
const Bottomdiv=styled.div`
  border:1px solid blue;
    position: relative;
display: flex;

//align-items: center;
justify-content: center;
height: 25%;
`

const Resultdiv=styled.div`
  display: flex;
  flex-direction: column;

`

const Errortext=styled.h4`
 
`
const Errortreatdiv=styled.div`
  display: flex;
  width: 100%;
  border: 1px solid blue;
  text-align: center;
  justify-content:center;
  gap: 30px;
   
`
const TreatButton=styled.button`
    border: none; /* border 없애기 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* 기본 그림자 */
  cursor: pointer;
  padding: 7px 7px;
    transition: box-shadow 0.3s ease;
  width: 100px;
  height: 40px;
  font-size: 18px;

:hover{
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
`
function Memberidfind(){

  const [username,setUsername]=useState();
  const [valierr,setvalierr]=useState();
  const [result,setResult]=useState(
    {
      error:'', //에러시문자열
      username:'', //중복시유저네임
      oauth:'' //oauth여부
    }
  );
  const [touched,setTouched]=useState(false)

  const navigate=useNavigate();

  const Usernamefind=()=>{
   if(!valierr){
    axios.get(`/open/usernamefind/${username}`).then((res)=>{
      console.log("요청",res)
      setResult({username:res.data.username,oauth:res.data.provider})
    }).catch((err)=>{
        console.log("err",err.response)
        setResult({error:username+"에 "+err.response.data.message})
    })
  }
  else{
    alert("이메일을확인해주세요")
  }
  }

  const Inputhanlder=(e)=>{
    setUsername(e.target.value)

      if (touched) {
    // 이미 input을 한번 blur 했으면, 입력시마다(실시간) 검사
    const err = Validators("username", e.target.value);
    setvalierr(err);
  }
   


   
  }

  const handleBlur = (e) => {
  // 입력값이 있을 때만 유효성 검사
  if (username) {
      const err=Validators("username",e.target.value)

  setvalierr(err);
  } else {
    setvalierr(""); // 빈 값이면 에러 메시지도 숨김
  }
  setTouched(true)
};

  return (
    <Wrapper>
    <Contentdiv>
      <Headerdiv>
        <Logodiv>
          로고
        </Logodiv>
        <Headertext>
                찾으시는 이메일을 작성해주십시요
        </Headertext>
      </Headerdiv>
    <Maindiv>
      
        <Inputdiv type="email" onChange={(e)=>Inputhanlder(e)} onBlur={(e)=>handleBlur(e)} placeholder="이메일"/>
          <Validationdiv>
    {valierr&&
    <>{valierr}</>}
    </Validationdiv>
         <Findbutton onClick={()=>{Usernamefind()}}>제출</Findbutton>
     
  
  
      
    </Maindiv>
     
    <Bottomdiv>
      <Resultdiv>
      {result.error &&<>
      <Errortext>
        {result.error}
      </Errortext>
        <Errortreatdiv>
          <TreatButton onClick={()=>{navigate("/")}}>홈으로</TreatButton>
          <TreatButton onClick={()=>{navigate("/membercreate")}}>회원가입</TreatButton>
        </Errortreatdiv>
       </>}

      {!result.error && result.oauth && 
      <>
      {result.oauth==="mypage" 
        ?(
        <>
        <Errortext>
        {result.username}님은 자체회원가입한 사용자입니다! 
        </Errortext>
              <Errortreatdiv>
                <TreatButton onClick={()=>{navigate("/")}}>홈으로</TreatButton>
          <TreatButton onClick={()=>{navigate("/memberpasswordfind")}}>비밀번호찾기</TreatButton>
        </Errortreatdiv>
        </>
        )
        :
        (<>
        <Errortext>
     
          <strong>{result.username}</strong>님은 <strong>{result.oauth}</strong>로그인유저입니다 
          <br/>해당로그인기능을 이용해주세요!
            </Errortext>
              <Errortreatdiv>
          oauth
        </Errortreatdiv>
        </>
        )
      }
      </>}
      </Resultdiv>
    </Bottomdiv>
    
   </Contentdiv>
    </Wrapper>
  )
}

export default Memberidfind