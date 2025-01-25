import React, { useEffect } from "react";
import styled from "styled-components";
import Weatherregion from "../../UI/weatherregion";
import { useState } from "react";
import CreateAxios from "../CreateAxios";
import * as Validation from "./UserValidation"

const Modalout=styled.div`
position: relative;
top:0%;
width:100% ;
height:100% ;
position: fixed;
background:rgba(0,0,0,0.5);
display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center; //위로부터 중간
z-index: 10;
`

const Modalin=styled.div`
position: relative;
padding: 15px;
right: 10%;
width:40%;
height:70%;
background-color: #FFFFFF;


`
const Exitbutton=styled.button`
position: absolute;
top:3%;
left:3%;

    
    
`
const Form=styled.form`
    height: 100%;
    padding: 10px;
    border: 1px solid black;
`
const Input=styled.input`
width: 70%;
  height: 32px;
  font-size: 15px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: rgb(233, 233, 233);
  border-bottom: 1px solid red;
  margin: 1%;
  
`
const Gibon=styled.div`
    border: 1px solid black;
    width: 50%;
    position: relative;
    left :25%;
    text-align:left;
    height: 42%;
    bottom: 7%;
`

const H6=styled.h6`
    border: 1px solid black;
    bottom:26%;
    left:2%;
    position: absolute;
    color: blue;
`
const InputTap=styled.div`
    top:2%;
    position: relative;
    margin-top:4%;
    margin-bottom: 6%;
    margin-left: 7%;

`
const H5=styled.h6`
    position: relative;
    bottom:3%;
    left: 23%;
    color: red;
    
`
const Sub=styled.div`
   
    border: 1px solid black;
    width: 50%;
    position: relative;
    left :25%;
    bottom: 20%;
    
`
const Regi=styled.div`
 border: 1px solid black;
    width: 50%;
    position: relative;
    left :25%;
    bottom: 31.5%;
`
const CreateButton=styled.button`
    position: relative;
    bottom: 20%;
display: inline-block;
width: 11%;
height: 8%;
font-size: 15px;
//padding: 30px 4px;
color: white;
bottom:28%;
left: 20%;
margin: 1px 1px 1px;//위옆아래 마진
border-radius: 10px; //모서리
text-align: center;
transition: top .04s linear;
text-shadow: 0 1px 0 rgba(0,0,0,0.15);
background-color: royalblue;
`
export default function AdminMembercreate(props){
    
    const axiosinstance= CreateAxios();
    const [createform,setCreateform]=useState({
        username: '',
        password: '',
        confirmpassword: '',
        nickname: '', 
        region:'',
        gridx:'' ,
        gridy:'',
        
        provider:'',
        userrole:''
    });

    const [valid,setValid]=useState({
        username:false,
        password:false,
        passwordconfirm:false,
        nickname:false
    })
    const ongetdata=(newdata)=>{
        console.log("데이터겟")
        setCreateform({...createform,region:newdata.region
            ,gridx:newdata.gridx,gridy:newdata.gridy})
    }
//발리데이션
    useEffect(()=>{
        if(Validation.Emailcheck(createform.username)){
            setValid({...valid,username:true})
        }else{
            setValid({...valid,username:false})
        }
    },[createform.username])
    useEffect(()=>{
        if(Validation.nicknamevalid(createform.nickname)){
            setValid({...valid,nickname:true})
        }
        else{
            setValid({...valid,nickname:false})
        }
    },[createform.nickname])
    useEffect(()=>{
        if(Validation.passwordcheck(createform.password)){
            setValid({...valid,password:true})
        } else{
            setValid({...valid,password:false})
        }
        
    },[createform.password])
    useEffect(()=>{
        if(Validation.confirmpasswordcheck(createform.password,createform.confirmpassword)){
            setValid({...valid,passwordconfirm:true})
        }else{
            setValid({...valid,passwordconfirm:false})
        }
    },[createform.confirmpassword])

  
    //어드민권한으로 유저만들기
    const Oncreateuser=()=>{
       if(valid.username&&valid.nickname&&valid.password&&valid.passwordconfirm){
        console.log("발리드성공")
        axiosinstance.post('/admin/membercreate',{
            username:createform.username,
            password:createform.password,
            provider:createform.provider,
            role:createform.userrole,

            nickname:createform.nickname,
            region:createform.region,
            gridx:createform.gridx,
            gridy:createform.gridy
        }).then((res)=>{
            alert(res.data)
        }).catch((err)=>{
            alert("회원만들기실패")
        })
    }else{
        alert("발리드확인")
    }
    }
    return(<>
      
    <Modalout>
    

        <Modalin>
        <Exitbutton onClick={()=>{
        props.setIscreate(false)
    }}>창닫기</Exitbutton>
            
            <Form >
            <h2>회원가입</h2>
            <h3 style={{position:"relative", right:"20%", top:"3%"}}>기본정보</h3>
            <H5>*필수입력</H5>

                <Gibon>
                    <InputTap>
                <H6>이메일</H6>
               <Input type="text" value={createform.username} placeholder="이메일"
                  onChange={(e)=>{setCreateform({...createform,username:e.target.value})}}
                /> {valid.username?"true":"false"}
                </InputTap>
                <InputTap>
                <H6>닉네임</H6>
                <Input type="text" value={createform.nickname} placeholder="닉네임"
                 onChange={(e)=>{setCreateform({...createform,nickname:e.target.value})}}
                />{valid.nickname?"true":"false"}
                <br/>
                </InputTap>
                <InputTap>
                <H6>비밀번호</H6>
                <Input type="password" value={createform.password} placeholder="비밀번호"
                 onChange={(e)=>{setCreateform({...createform,password:e.target.value})}}
                />
                {valid.password?"true":"false"}
                <br/>
                </InputTap>
                <InputTap>
                <H6>비밀번호확인</H6>
                <Input type="password" value={createform.confirmpassword} placeholder="비밀번호확인"
                onChange={(e)=>{setCreateform({...createform,confirmpassword:e.target.value})}}
                />{valid.passwordconfirm?"true":"false"}
                <br/>
                </InputTap>
                </Gibon>

                <h3 style={{position:"relative", right:"20%", bottom:"10%"}}>유저권한정보</h3>
                <h6 style={{position:"relative", left:"23%", bottom:"16%", color:"red"}}>*필수입력</h6>
                <Sub>
                가입사이트:
                <input type="radio"  name="provider" value="mypage" onChange={(e)=>{setCreateform({...createform,provider:e.target.value})}}/>마이페이지
                    <input type="radio" name="provider" value="Naver" onChange={(e)=>{setCreateform({...createform,provider:e.target.value})}}/>네이버 
                    <input type="radio" name="provider" value="Google"onChange={(e)=>{setCreateform({...createform,provider:e.target.value})}}/>구글
                                            
                
                
                <br/>
               
                회원권한:
                <input type="radio" name="role" value="ROLE_User"  onChange={(e)=>{setCreateform({...createform,userrole:e.target.value})}}/> 일반 
                <input type="radio" name="role" value="ROLE_Admin" onChange={(e)=>{setCreateform({...createform,userrole:e.target.value})}}/>운영자
               
                <br/>
                </Sub>
                <h3 style={{position:"relative", right:"20%", bottom:"22%"}}>회원주소</h3>
                <h6 style={{position:"relative", left:"23%", bottom:"28%", color:"blue"}}>*선택입력</h6>
                <Regi>

                회원지역:<input type="text" value={createform.region} readOnly /> 
                <Weatherregion title="지역찾기" onGetdata={ongetdata}
                    
                />
                </Regi>
                <CreateButton onClick={Oncreateuser}>회원가입</CreateButton >
            </Form >
        </Modalin>
    </Modalout>
    
    </>)
}