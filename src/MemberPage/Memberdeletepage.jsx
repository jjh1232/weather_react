import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Button from "../UI/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;

`
function Memberdeletepage(){
    const [loginuser,Setloginuser,removeloginuser]=useCookies()
      const  [deletecode,Setdeletecode]=useState();
      const [deletecodeconfirm,Setdeletecodeconfirm]=useState();
      const navigate=useNavigate();
      const axiosinstance=CreateAxios();
      console.log(loginuser)

      const deletemailsend=()=>{
        axiosinstance.post(`/memberdeletemail`,{
            email:loginuser.userinfo["username"]
        }).then((res)=>{
          alert("회원님의이메일로삭제코드를발송하였스빈다!")
          Setdeletecodeconfirm(res.data)
        }).catch((error)=>{
          alert("로그인기간만료 다시로그인해주세요!")
          removeloginuser("userinfo");
    removeloginuser("Refreshtoken");
    removeloginuser("Acesstoken");
        })
      }


      const deletemember=()=>{
        console.log(deletecodeconfirm)
        if(deletecode===deletecodeconfirm){
          console.log("일치")
        axiosinstance.delete(`/memberdelete`,{
          data:{
         
            username:loginuser.userinfo["username"],
            authkey:deletecode
            
          }},
        )
        .then(()=>{
          alert("삭제가완료되었습니다")
          removeloginuser("userinfo");
    removeloginuser("Refreshtoken");
    removeloginuser("Acesstoken");
    navigate("/main")
        
        }).catch((error)=>{
          console.log("오류스")
        })
      }
      else{
        alert("삭제코드를확인해주십시요")
      }
      }
  return(
    <Wrapper>
      삭제하기위해 본인명의의 이메일인증이필요합니다.<Button title="삭제코드보내기" onClick={()=>{
        deletemailsend()
      }}/> 
      삭제코드번호:<input type="text" onChange={(e)=>{Setdeletecode(e.target.value)}}/>
      {deletecode}
      <br/>
      {deletecodeconfirm}
      <Button title="확인" onClick={deletemember}/>
    </Wrapper>
  )
}

export default Memberdeletepage