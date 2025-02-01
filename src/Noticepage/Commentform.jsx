import axios from "axios";
import React, { useRef } from "react";
import { useCookies } from "react-cookie";
import { useState } from "react";
import AuthCheck from "../customhook/authCheck";
import CreateAxios from "../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const Wrapper=styled.div`
  position: relative;
  width: 1000px;
  height: 60px;
  border: 1px solid black;
`
const Img=styled.img`
  position: absolute;
  top:2%;
  left:0%;
  width: 50px;
  height: 56px;
  display:inline-block;
  border: 1px solid black;
`
const Username=styled.span`
  position: absolute;
  left: 55px;
  font-size: 15px;
  
  
  
`
const Coform=styled.div`
position: relative;
display:inline-block;
width: fit-content;
top: 20px;
left:55px;


`

const Commentinput=styled.textarea`
position: relative;
display: inline-block;
width: 800px;

border: 1px solid yellow;
`
const CreateButton=styled.button`

position: absolute;
left: 85%;
top:30%;

`

function Commentform(props){
  const [loginuser,Setloginuser,removeloginuser]=useCookies()
  const {noticenum,depth,cnum,commentsubmit}=props
  const logincheck=AuthCheck()
  const axiosinstance=CreateAxios();
  const [comments,setComment]=useState({
   
    text:''

  });
  const url="/commentcreate";
const navigate=useNavigate();

const textref=useRef()
const resize=()=>{
  textref.current.style.height=`auto`;
  textref.current.style.height=textref.current.scrollHeight+`px`;
}

  return (
    <>{logincheck?<Wrapper>
    
      
      <Img src={process.env.PUBLIC_URL+"/userprofileimg"+loginuser.userinfo["profileimg"]}/>
    
    <Username>
    {loginuser.userinfo["nickname"]}님
    </Username>
        <Coform>
        <Commentinput type="text" name="text" value={comments.text} 
        onInput={resize}
        ref={textref}
        onChange={(e)=>{
          setComment({...comments,text:e.target.value})
        }}
        />
       

</Coform>
<CreateButton type="submit" onClick={()=>{
          console.log("폼에서코멘트"+comments)
          commentsubmit(loginuser.userinfo["username"],
            loginuser.userinfo["nickname"],
            comments.text,
            noticenum,
           
            depth,
            cnum

          )
            setComment({text:""})
        }
      }>댓글작성</CreateButton>
    </Wrapper>
    :<form>
      <input type="text" value="로그인후작성하실수있습니다"/>
      <button type="submit" >댓글작성</button>
    </form>
}
</>

  )
}
export default Commentform;