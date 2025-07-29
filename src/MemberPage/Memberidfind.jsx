import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";

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
border: 1px solid red;

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
border: 1px solid black;
width: 40%;
min-height: 30px;
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

align-items: center;
justify-content: center;
height: 20%;
`

const Resultdiv=styled.div`
  
`
function Memberidfind(){

  const [username,setUsername]=useState();
  const [result,setResult]=useState(
    {
      error:'', //에러시문자열
      username:'', //중복시유저네임
      oauth:'' //oauth여부
    }
  );
  
  const Usernamefind=()=>{
    console.log("유저네임파이늗")
    axios.get(`/open/usernamefind/${username}`).then((res)=>{
      console.log("요청",res)
      setResult({username:res.data.username,oauth:res.data.provider})
    }).catch((err)=>{
        console.log("err",err.response)
        setResult({error:err.response.data.message})
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
                찾으시는 이메일을 작성해주십시요
        </Headertext>
      </Headerdiv>
    <Maindiv>
      
        <Inputdiv type="email" onChange={(e)=>setUsername(e.target.value)} placeholder="이메일"/>
          <Validationdiv>
    발리데이션
    </Validationdiv>
         <Findbutton onClick={()=>{Usernamefind()}}>제출</Findbutton>
     
  
  
      
    </Maindiv>
     
    <Bottomdiv>
      <Resultdiv>
      {result.error && <>{result.error}</>}
      {!result.error && result.oauth && 
      <>
      {result.oauth==="자사사이트" 
        ?(
        <>
        {result.username}님은 자체회원가입한 사용자입니다! 
        

        </>
        )
        :
        (<>
          {result.username}님은 {result.oauth}로그인유저입니다 해당로그인기능을 이용해주세요!
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