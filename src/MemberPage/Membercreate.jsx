import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import axios from "axios";
import Weatherregion from "../UI/weatherregion";
import PopupDom from "../UI/PopupDom";
import useDidMounteffect from "../customhook/usdDidMountEffect";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;

`
function membercreate(){
 
    const [loginform,setloginform]=useState(
        {
            username: '',
            password: '',
            confirmpassword: '',
            nickname: '', 
            region:'',
            gridx:'' ,
            gridy:''
        }
    );

    const [isemail,setisemail]=useState(false);
    const [passconfirm,setpassconfirm]=useState(false);   
    const [isregion,setisregion]=useState(false)
    const navigate=useNavigate();

useDidMounteffect(()=>{
    
setisemail(false)
},[loginform.username])

useDidMounteffect(()=>{
    
    confirmpass()

},[loginform.password,loginform.confirmpassword])

const confirmpass=()=>{
    if(loginform.password===loginform.confirmpassword){
        setpassconfirm(true)
    }
    else{
        setpassconfirm(false)
    }
}

//이메일체크
    const emailcheck=(e)=>{
        e.preventDefault();
        console.log("/open/emailch");
        axios.get("/open/emailcheck",{
            params:{
            username:loginform.username
            }
        }).then((res)=>
        {   console.log(res.data.check)
            if(res.data.check==1){
                alert("이미존재하는이메일입니다");
                setisemail(false);
            }
            if(res.data.check==0){
                alert("가입가능한이메일입니다!")
                setisemail(true);
            }
        },[]).catch(
            (error)=>{
                alert("올바른형식의이메일을입력해주십시오")
            }
        )

        
    }
    //주소 선택
const regionpop=(e)=>{
    e.preventDefault();
   
    
    console.log("팝업")
    setisregion(!isregion)
   
}
//지역데이터모달창
const regiondata=(regions)=>{
    setisregion(regions)
}
//레기온테이터받음
const onGetdata=(newdata)=>{
    console.log(newdata)
   
    setloginform({...loginform,region:newdata.region
        ,gridx:newdata.gridx,gridy:newdata.gridy})
}

//인증확인및 가입요청
const membercreate=()=>{
    if(isemail===false){
        alert("이메일을중복검사를완료해주세요")
    }
    if(passconfirm===false){
        alert("비밀번호확인을 확인해주세요")
    }
    if(loginform.nickname)
    if(isemail===true && passconfirm===true){
        axios.post("/open/membercreate",{
            username:loginform.username,
            password:loginform.password,
           
            nickname:loginform.nickname,
            region:loginform.region,
            gridx:loginform.gridx,
            gridy:loginform.gridy
        }).then((res)=>{
            alert("회원님의 이메일로 인증메일을보냈습니다! 인증후 사용해주세요")
            navigate("/main")
        }).catch((err)=>{
            console.log(err.response.data);
            
        })
    }

    
}

return(
<Wrapper key="memberform">
    
<table>
    <tbody>
    <tr><td>이메일:<input type="text" value={loginform.username} onChange={(e)=>setloginform({...loginform,username:e.target.value})}/><Button title="중복검사" onClick={(e)=>emailcheck(e)}/></td></tr>

    <tr><td>비밀번호:<input type="text" value={loginform.password} onChange={(e)=>setloginform({...loginform,password:e.target.value})}/></td></tr>
    <tr><td>비밀번호확인:<input type="text" value={loginform.confirmpassword} onChange={(e)=>setloginform({...loginform,confirmpassword:e.target.value})}/> 
    {passconfirm?"":"비밀번호가일치하지않습니다"}</td></tr>
    
    <tr><td>닉네임:<input type="text" value={loginform.nickname} onChange={(e)=>setloginform({...loginform,nickname:e.target.value})}/></td></tr>
    <tr><td>지역:<input type="text" value={loginform.region} readOnly /> 
     <Weatherregion title="지역찾기" onGetdata={onGetdata}/></td></tr>
     </tbody>
     </table>
    <Button title="회원가입"  onClick={membercreate} />
    
   
   
 
    </Wrapper>
)
}

export default membercreate;