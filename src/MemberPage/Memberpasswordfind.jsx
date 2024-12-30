import React from "react";
import { useState } from "react";
import Button from "../UI/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      if(res.data==="x"){
        alert("이메일이존재하지않습니다")
      }
      else{
        alert("이메일에임시비밀번호를발급하였습니다")
        navigate("/main")
      }
  })
}


  return (
    <React.Fragment>
      비밀번호를찾으려는 이메일을 작성해 주십시오
      <br/>
      이메일:<input type="text" onChange={(e)=>Setemail(e.target.value)}/>
      <Button title="확인" onClick={findpassword}/>


    </React.Fragment>
  
  )
}
export  default Memberpasswordfind