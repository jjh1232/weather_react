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
  min-height: 60px;
  max-height: fit-content;
  border: 1px solid black;
  word-break: break-all;
  overflow: hidden;
`
const Img=styled.img`
  position: absolute;
  top:2px;
  left:0%;
  width: 60px;
  height: 57px;
  display:inline-block;
  border: 1px solid black;
`
const Username=styled.span`
  position: absolute;
   left: 64px;
  font-size: 15px;
   
  
`



const Commentinput=styled.textarea`
position: relative;
display: inline-block;
width: 800px;
font-size: 20px;
top: 25px;
left:64px;


`
const CreateButton=styled.button`

position: absolute;
left: 87.2%;
top:28%;
width: 45px;
height: 40px;
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
        
        <Commentinput type="text" name="text" value={comments.text} 
        onInput={resize}
        rows={1}
        ref={textref}
        onChange={(e)=>{
          setComment({...comments,text:e.target.value})
        }}
        />
       


<CreateButton type="submit" onClick={()=>{
          
          commentsubmit(loginuser.userinfo["username"],
            loginuser.userinfo["nickname"],
            comments.text,
            noticenum,
           
            depth,
            cnum

          )
            setComment({text:""})
            textref.current.style.height="30px"

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