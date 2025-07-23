import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import axios from "axios";
import Weatherregion from "../UI/weatherregion";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Validators } from "../UI/Modals/Validators";
import ParseJwt from "../customhook/ParseJwt";
import { useCookies } from "react-cookie";
const Wrapper=styled.div`
position: relative;

width:100%;
height:100vh;
 border: 1px solid red;
display: flex;
flex-direction: column;
 
  align-items: center;   
`
const Headerdiv=styled.div`
    position: relative;
    margin-top:50px;
    border: 1px solid red;
    width: 600px;
`
const Maindiv=styled.div`
    position: relative;
    
    width: 600px;
    border: 1px solid blue;
`
const Formrow=styled.tr`
    height: 50px;
`
const Labelcell=styled.td`
    width: 120px;
    text-align: right;
    padding-right: 10px;
    font-weight: bold;
`
const Inputcell=styled.td`
    text-align: left;
`
function membercreate(){
 
    const [form,setform]=useState(
        {
            username: '',
            password: '',
            confirmpassword: '',
            profileid: '',
            nickname: '', 
            region:'',
            gridx:'' ,
            gridy:''
        }
    );

    const [isemailcheck,setisemailcheck]=useState(false);
     const [isproflieidcheck,setIsprofileidcheck]=useState(false);
      
    const [showregionpopup,setshowregionpopup]=useState(false)
    const [errors,seterrors]=useState({})


    
    const navigate=useNavigate();

    //이벤트핸들링
    const handleChange=(e)=>{
        //태그에 namevalue 설정하면 e.target안에 {name:,value:} 속성이생김
        const {name,value}= e.target;
        const newvalue=name==='profileid'? value.toLowerCase() :value;
        //[] -> 변수로쓰기때문에추가필요함 객체의 속성에 접근한다는뜻이래
        const updatedForm = {...form,[name]:newvalue}

        setform(updatedForm);

        //reset:이메일아이디중복체크 입력변경시 다시확인
        if(name==="username") setisemailcheck(false);
        if(name==="profileid") setIsprofileidcheck(false);

        //validation 이거통과해도 ""이가는데 별문제없다는듯?>
        const error=Validators(name,newvalue,updatedForm);

        seterrors((prev)=>({...prev,[name]:error}));
    };

    const handleRegionSelect=(data)=>{
        setform((prev)=>({
            ...prev,
            region:data.region,
            gridx:data.gridx,
            gridy:data.gridy
        }));
        setshowregionpopup(false);

    }

    const toggleRegionPopup=(e)=>{
        e.preventDefault();
        setshowregionpopup((prev)=>!prev);
    }
    //중복검사



//이메일체크
    const checkEmail=(e)=>{
        e.preventDefault();
        
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
        }).catch(
            (error)=>{
                alert("올바른형식의이메일을입력해주십시오")
            }
        )

        
    }
    //프로필아이디체크
    const checkProfileId=(e)=>{
        e.preventDefault();
        axios.get("/open/profileidcheck",{
            params:{
                profileid:loginform.profileid
            }
        }).then((res)=>{
            if(res.data){
                alert("이미존재하는아이디입니다")
                  setIsprofileid(false)
            }
            else{
                alert("사용가능한아이디입니다")
                setIsprofileid(true)
            }
        }).catch(
            (error)=>{
                alert(error)
            }
        )
    }
    //주소 선택




//인증확인및 가입요청
const handleSubmit=(e)=>{
    e.preventDefault();
    const newErrors={};
    Object.keys(form).forEach((key)=>{
        const error=Validators(key,form[key],form);
        if(error) newErrors[key]=error;
    })

    if(!isemailcheck){
        alert("이메일을중복검사를완료해주세요")
    }
    if(!isproflieidcheck){
        alert("프로필 id 중복확인이필요합니다")
    }
    const ispasswordConfirmed=form.password === form.confirmpassword;
    if(!ispasswordConfirmed){
        newErrors.confirmpassword="비밀번호가일치하지않습니다"
    }
    seterrors(newErrors);
    if(Object.keys(newErrors).length>0){
        return alert("입력값을 확인해주세요!")
    }

    
    
        axios.post("/open/membercreate",{
            username:form.username,
            password:form.password,
            profileid:form.profileid,
            nickname:form.nickname,
            region:form.region,
            gridx:form.gridx,
            gridy:form.gridy
        }).then((res)=>{
            alert("회원님의 이메일로 인증메일을보냈습니다! 인증후 사용해주세요")
            navigate("/main")
        }).catch((err)=>{
            console.log(err.response.data);
            
        })
    
    }
    



return(
<Wrapper key="memberform">
    <Headerdiv>
        헤더
    </Headerdiv>
    <Maindiv>
   <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <Formrow>
              <Labelcell>
                이메일:
                </Labelcell>
                <Inputcell>
              
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  type="text"
                />
                <Button title="중복검사" onClick={checkEmail} />
                {errors.username && <p>{errors.username}</p>}
             </Inputcell>
            </Formrow>

            <Formrow>
              <Labelcell>
                비밀번호:
                 </Labelcell>
                 <Inputcell>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                />
                {errors.password && <p>{errors.password}</p>}
             </Inputcell>
            </Formrow>

            <Formrow>
              <Labelcell>
                비밀번호 확인:
                 </Labelcell>
                <Inputcell>
                <input
                  name="confirmpassword"
                  value={form.confirmpassword}
                  type="password"
                  onChange={handleChange}
                />
                {!form.confirmpassword ||
                form.password === form.confirmpassword ? null : (
                  <p>비밀번호가 일치하지 않습니다</p>
                )}
                </Inputcell>
             
            </Formrow>

            <Formrow>
              <Labelcell>
                프로필ID:
                  </Labelcell>
                 <Inputcell>
                <input
                  name="profileid"
                  value={form.profileid}
                  onChange={handleChange}
                />
                <Button title="중복검사" onClick={checkProfileId} />
                {errors.profileid && <p>{errors.profileid}</p>}
                </Inputcell>
            
            </Formrow>

            <Formrow>
              <Labelcell>
                닉네임:
                </Labelcell>
                <Inputcell>
                <input
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                />
                {errors.nickname && <p>{errors.nickname}</p>}
              </Inputcell>
            </Formrow>

            <Formrow>
              <Labelcell>
                지역:
                 </Labelcell>
                 <Inputcell>
                <input name="region" value={form.region} readOnly />
                <Weatherregion title="지역 찾기" onGetdata={handleRegionSelect} />
             </Inputcell>
            </Formrow>
          </tbody>
        </table>

        <Button title="회원가입" type="submit" />
      </form>
                
    </Maindiv>

    
 
    </Wrapper>
)
}

export default membercreate;