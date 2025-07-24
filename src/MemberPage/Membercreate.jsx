import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import axios from "axios";
import Weatherregion from "../UI/weatherregion";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Validators } from "../UI/Modals/Validators";
//폰트어섬
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser as usericon } from "@fortawesome/free-regular-svg-icons";
import { faUnlockKeyhole as passwordicon } from "@fortawesome/free-solid-svg-icons";
import { faClipboardCheck as confirmicon } from "@fortawesome/free-solid-svg-icons";
import { faIdCard as profileicon } from "@fortawesome/free-regular-svg-icons";
import { faHouse as regionicon } from "@fortawesome/free-solid-svg-icons";

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
    margin-top:30px;
    border: 1px solid gray;
    width: 600px;
    height: 80px;
    margin-bottom:30px;
`
const Maindiv=styled.div`
    display: flex;
    position: relative;
    
    width: 600px;
   align-items: center;
   justify-content: center;

`
const StyledForm=styled.form`
    width: 100%;
`
const StyledTable=styled.table`
    width: 100%;
`
const Formrow=styled.div`
    min-height: 50px;
    display: flex;
    width: 100%;
    flex-direction:column;
  
    
`


const Inputcell=styled.div`
    display: flex;
    text-align: left;
    gap: 6px;
      background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 12px;

`
const SubButtondiv=styled.div`
    
    margin-left: auto;
`
const SubButton=styled.button`
    
`
//아이콘
const StyledIcon=styled(FontAwesomeIcon)`
    border: 1px solid blue;
    margin-top: 4px;
    color:black;
`
const Inputarea=styled.input`
    background-color: #fff;
    border: none;
    outline: none;
   max-width: 400px;
    height: 22px;

    //pladceholder스타일
    &::placeholder{
        
        color:#999;
        font-style: italic; 
         font-size: 14px; 
        opacity: 1;   
    }
`
const Errordiv=styled.div`
display: flex;
    text-align: center;
    align-items: center;
    height: 30px;
     font-size:15px;
    color: red;
    
`
const Footerdiv=styled.div`
margin-top: 30px;
 border: 1px solid blue;
 display:flex;
 justify-content: center;

`
const SubmitButton=styled.button`
    width: 400px;
    height: 50px;
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
            username:form.username
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
                profileid:form.profileid
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
   <StyledForm onSubmit={handleSubmit}>
        <StyledTable>
          <tbody>
            <Formrow>
            
                <Inputcell>
                <StyledIcon icon={usericon}/>
                <Inputarea
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="로그인이메일"
                />
                <SubButtondiv>
                     <SubButton onClick={checkEmail} >중복검사</SubButton>
                </SubButtondiv>
               
                </Inputcell>
                <Errordiv>

              
                {errors.username && <p>{errors.username}</p>}
                  </Errordiv>
             

            </Formrow>

            <Formrow>
             
                 <Inputcell>
                 <StyledIcon icon={passwordicon}/>
                <Inputarea
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="비밀번호"
                />
                </Inputcell>
                  <Errordiv>
                {errors.password && <p>{errors.password}</p>}
                    </Errordiv>
             
            </Formrow>

            <Formrow>
              
                <Inputcell>
                <StyledIcon icon={confirmicon}/>
                <Inputarea
                  name="confirmpassword"
                  value={form.confirmpassword}
                  type="password"
                  onChange={handleChange}
                  placeholder="비밀번호확인"
                />
                </Inputcell>
                    <Errordiv>
                {!form.confirmpassword ||
                form.password === form.confirmpassword ? null : (
                  <p>비밀번호가 일치하지 않습니다</p>
                )}
                    </Errordiv>
               
             
            </Formrow>

            <Formrow>
             
                 <Inputcell>
                 <StyledIcon icon={profileicon}/>
                <Inputarea
                  name="profileid"
                  value={form.profileid}
                  onChange={handleChange}
                  placeholder="프로필id"
                />
                  <SubButtondiv>
                               <SubButton onClick={checkProfileId} >중복검사</SubButton>
                </SubButtondiv>
     
                </Inputcell>
                    <Errordiv>
                {errors.profileid && <p>{errors.profileid}</p>}
                </Errordiv>
               
            
            </Formrow>

            <Formrow>
             
                <Inputcell>
                <StyledIcon icon={usericon}/>
                <Inputarea
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  placeholder="닉네임"
                />
                </Inputcell>
                <Errordiv>

                
                {errors.nickname && <p>{errors.nickname}</p>}
                  </Errordiv>
            
            </Formrow>

            <Formrow>
             
                 <Inputcell>
                 <StyledIcon icon={regionicon}/>
                <Inputarea name="region" value={form.region} readOnly placeholder="지역" />

                <SubButtondiv>
                     <Weatherregion title="지역 찾기" onGetdata={handleRegionSelect} />
                </SubButtondiv>
               
             </Inputcell>
            </Formrow>
          </tbody>
        </StyledTable>
        <Footerdiv>

       
        <SubmitButton  type="submit" >회원가입</SubmitButton>
         </Footerdiv>
      </StyledForm>
                
    </Maindiv>
    
    
 
    </Wrapper>
)
}

export default membercreate;