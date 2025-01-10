import React, { useEffect } from "react";
import styled from "styled-components";
import Weatherregion from "../../UI/weatherregion";
import { useState } from "react";
import CreateAxios from "../CreateAxios";
import * as Validation from "./UserValidation"

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
    <button onClick={()=>{
        props.setIscreate(false)
    }}>창닫기</button>
        <Modalin>
            <form >
                회원이메일:<input type="text" value={createform.username}
                  onChange={(e)=>{setCreateform({...createform,username:e.target.value})}}
                /> {valid.username?"true":"false"}
                <br/>
                회원닉네임:<input type="text" value={createform.nickname}
                 onChange={(e)=>{setCreateform({...createform,nickname:e.target.value})}}
                />{valid.nickname?"true":"false"}
                <br/>
                비밀번호:<input type="text" value={createform.password}
                 onChange={(e)=>{setCreateform({...createform,password:e.target.value})}}
                />
                {valid.password?"true":"false"}
                <br/>
                비밀번호확인:<input type="text" value={createform.confirmpassword}
                onChange={(e)=>{setCreateform({...createform,confirmpassword:e.target.value})}}
                />{valid.passwordconfirm?"true":"false"}
                <br/>
                가입사이트:
                <input type="radio"  name="provider" value="mypage" onChange={(e)=>{setCreateform({...createform,provider:e.target.value})}}/>마이페이지
                    <input type="radio" name="provider" value="Naver" onChange={(e)=>{setCreateform({...createform,provider:e.target.value})}}/>네이버 
                    <input type="radio" name="provider" value="Google"onChange={(e)=>{setCreateform({...createform,provider:e.target.value})}}/>구글
              
                
               
                <br/>
                회원권한:
                <input type="radio" name="role" value="ROLE_User"  onChange={(e)=>{setCreateform({...createform,userrole:e.target.value})}}/> 일반 
                <input type="radio" name="role" value="ROLE_Admin" onChange={(e)=>{setCreateform({...createform,userrole:e.target.value})}}/>운영자
               
                <br/>
                회원지역:<input type="text" value={createform.region} readOnly /> 
                <Weatherregion title="지역찾기" onGetdata={ongetdata}

                />
                <button onClick={Oncreateuser}>제출</button>
            </form >
        </Modalin>
    </Modalout>
    
    </>)
}