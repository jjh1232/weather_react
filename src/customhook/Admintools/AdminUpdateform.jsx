import React from "react";
import styled from "styled-components";
import Weatherregion from "../../UI/weatherregion";
import { useState } from "react";
import CreateAxios from "../CreateAxios";

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

export default function AdminUpdateform(props){
    console.log("어드민업데이트실행")
    const {currentdata,setIsupdate}=props
    const axiosinstance= CreateAxios();
    const [updateform,setUpdateform]=useState({
        username: currentdata.username,
        
        confirmpassword: currentdata.password,
        nickname: currentdata.nickname, 
      
        region:currentdata.homeaddress.juso,
        gridx:currentdata.homeaddress.gridx,
        gridy:currentdata.homeaddress.gridy,

        
        provider:currentdata.provider,
        userrole:currentdata.userrole
    });
    
    const ongetdata=(newdata)=>{
        console.log("데이터겟")
        setUpdateform({...updateform,region:newdata.region
            ,gridx:newdata.gridx,gridy:newdata.gridy})
    }



    //어드민권한으로 유저만들기
    const Onupdateuser=(e)=>{
        e.preventDefault()
        axiosinstance.put(`/admin/memberupdate/${currentdata.id}`,{
            username:updateform.username,
           
            provider:updateform.provider,
            role:updateform.userrole,

            nickname:updateform.nickname,
            region:updateform.region,
            gridx:updateform.gridx,
            gridy:updateform.gridy
          
        }).then((res)=>{
            alert("업데이트성공")
            setIsupdate(false)
        }).catch((err)=>{
            alert("회원업데이트실패")
        })
    }

    return(<>
      
    <Modalout>
    
        <Modalin>
        <Exitbutton onClick={()=>{
        props.setIsupdate(false)
    }}>창닫기</Exitbutton>
            <Form >
            <h2>회원가입</h2>
            <h3 style={{position:"relative", right:"20%", top:"3%"}}>기본정보</h3>
            <H5>*필수입력</H5>
            <Gibon>
            <InputTap>
            <H6>이메일</H6>
                  <Input type="text" value={updateform.username} placeholder="이메일"
                  onChange={(e)=>{setUpdateform({...updateform,username:e.target.value})}}
                />
                  </InputTap>
                  <InputTap>
                <H6>닉네임</H6>
               <Input type="text" value={updateform.nickname} placeholder="닉네임"
                 onChange={(e)=>{setUpdateform({...updateform,nickname:e.target.value})}}
                />
               </InputTap>
               </Gibon>

               <h3 style={{position:"relative", right:"20%", bottom:"10%"}}>유저권한정보</h3>
               <h6 style={{position:"relative", left:"23%", bottom:"16%", color:"red"}}>*필수입력</h6>
               <Sub>
                가입사이트:
                <input type="radio"  name="provider" value="mypage" defaultChecked={"mypage"===currentdata.provider}
                onChange={(e)=>{setUpdateform({...updateform,provider:e.target.value})}}/>마이페이지
                    <input type="radio" name="provider" value="Naver" defaultChecked={"Naver"===currentdata.provider}
                    onChange={(e)=>{setUpdateform({...updateform,provider:e.target.value})}}/>네이버 
                    <input type="radio" name="provider" value="Google" defaultChecked={"Google"===currentdata.provider}
                    onChange={(e)=>{setUpdateform({...updateform,provider:e.target.value})}}/>구글
              
                
               
                <br/>
                회원권한:
                <input type="radio" name="role" value="ROLE_User" defaultChecked={"ROLE_User"===currentdata.role}
                 onChange={(e)=>{setUpdateform({...updateform,userrole:e.target.value})}}/> 일반 
                <input type="radio" name="role" value="ROLE_Admin" defaultChecked={"ROLE_Admin"===currentdata.role}
                 onChange={(e)=>{setUpdateform({...updateform,userrole:e.target.value})}}/>운영자
                  <br/>
                  
                </Sub>
                <h3 style={{position:"relative", right:"20%", bottom:"22%"}}>회원주소</h3>
                <h6 style={{position:"relative", left:"23%", bottom:"28%", color:"blue"}}>*선택입력</h6>
                <Regi>
                <input type="text" value={updateform.region} readOnly style={{width:"260px",float:"left"} } /> 
                <Weatherregion title="지역찾기" onGetdata={ongetdata}
                />
               
               </Regi>
                <CreateButton onClick={(e)=>{Onupdateuser(e)}}>제출</CreateButton>
            </Form>
        </Modalin>
    </Modalout>
    
    </>)
}

