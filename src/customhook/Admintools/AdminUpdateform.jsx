import React from "react";
import styled from "styled-components";
import Weatherregion from "../../UI/weatherregion";
import { useState } from "react";
import CreateAxios from "../CreateAxios";


const Modalout=styled.div`
width:45% ;
height:85% ;
position: fixed;
background:rgba(0,0,0,0.5);
display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center; //위로부터 중간
`

const Modalin=styled.div`
padding: 15px;
width:90%;
height:70%;
background-color: #FFFFFF;

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
    <button onClick={()=>{
        props.setIsupdate(false)
    }}>창닫기</button>
        <Modalin>
            <form >
                회원이메일:<input type="text" value={updateform.username}  
                  onChange={(e)=>{setUpdateform({...updateform,username:e.target.value})}}
                /><br/>
                회원닉네임:<input type="text" value={updateform.nickname}
                 onChange={(e)=>{setUpdateform({...updateform,nickname:e.target.value})}}
                /><br/>
               
                가입사이트:
                <input type="radio"  name="provider" value="mypage" onChange={(e)=>{setUpdateform({...updateform,provider:e.target.value})}}/>마이페이지
                    <input type="radio" name="provider" value="Naver" onChange={(e)=>{setUpdateform({...updateform,provider:e.target.value})}}/>네이버 
                    <input type="radio" name="provider" value="Google"onChange={(e)=>{setUpdateform({...updateform,provider:e.target.value})}}/>구글
              
                
               
                <br/>
                회원권한:
                <input type="radio" name="role" value="ROLE_User"  onChange={(e)=>{setUpdateform({...updateform,userrole:e.target.value})}}/> 일반 
                <input type="radio" name="role" value="ROLE_Admin" onChange={(e)=>{setUpdateform({...updateform,userrole:e.target.value})}}/>운영자
               
                <br/>
                
                회원지역:<input type="text" value={updateform.region} readOnly /> 
                <Weatherregion title="지역찾기" onGetdata={ongetdata}
                />
               
               
                <button onClick={(e)=>{Onupdateuser(e)}}>제출</button>
            </form >
        </Modalin>
    </Modalout>
    
    </>)
}

