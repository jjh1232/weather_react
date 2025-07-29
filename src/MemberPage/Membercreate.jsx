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
import { faCircleXmark as xicon } from "@fortawesome/free-solid-svg-icons";
const Wrapper=styled.div`
position: relative;

width:100%;
height:100vh;
 
display: flex;
flex-direction: column;
 
  align-items: center;   
`
const Headerdiv=styled.div`
    position: relative;
    margin-top:50px;
    border: 1px solid gray;
    width: 600px;
    height: 80px;
    margin-bottom:30px;
`
const Maindiv=styled.div`
    margin-top: 30px;
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
position: relative;
    display: flex;
    text-align: left;
    gap: 6px;
      background-color: #fff;
  border: 1px solid ${(props)=>props.hasError? "#f57676":"#ccc"} ;
  color: ${(props)=>props.hasError? "#f55656":"#ccc"} ;
  border-radius: 4px;
  padding: 8px 12px;
  

`
const SubButtondiv=styled.div`
    
     margin-left: auto;
  display: flex;
  align-items: center;
  

 
`
const SubButton=styled.button`
     height: 25px;
  padding: 0 12px;
  border: 1px solid ${(props)=>(props.isChecked ==="success" ? "#88da78" :
                                props.isChecked === "fail" ? "#ec4b35" :"#4d90fe"
  )} ;
  background-color: ${(props)=>(props.isChecked ==="success" ? "#88da78" :
                                props.isChecked === "fail" ? "#ec4b35" :"#4d90fe")};
  color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #357ae8;
  }

  &:disabled {
    background-color: #a5c6ff;
    cursor: not-allowed;
  }
`
//아이콘
const StyledIcon=styled(FontAwesomeIcon)`
    
    margin-top: 4px;
    color:${(props)=>props.hasError? "#f55656":"#ccc"};
`
const Inputarea=styled.input`
    background-color: #fff;
    width:70%;
    
    outline: none;
    border: none;
    height: 22px;
    color: ${(props)=>props.hasError? "#f55656":"black"};

    //pladceholder스타일
    &::placeholder{
        
        color:#999;
        font-style: italic; 
         font-size: 14px; 
        opacity: 1;   
    }
`
const ClearButton=styled.button`
    position: relative;
    background: none;
    border: none;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: ${(props)=>props.visible?"visable":"hidden"};
    cursor: pointer;
`
const Clearicon=styled(FontAwesomeIcon)`
    font-size: 20px;
    color: red;
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

 display:flex;
 justify-content: center;

`
const SubmitButton=styled.button`
    margin-top: 20px;
    width: 400px;
    height: 50px;
    border: none;
    background: #4873ff;

     cursor: pointer;
  transition: background-color 0.2s ease;
    color: white;
    font-size:25px;

  &:hover {
    background-color: #357ae8;
  }
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

    const [isemailcheck,setisemailcheck]=useState("idle");
     const [isproflieidcheck,setIsprofileidcheck]=useState("idle");
      
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
        if(!form.username || form.username.trim()===""){
            alert("이메일을 입력해주세요!")
            return;
        }
        if(errors.username){
            alert("이메일양식을확인해주세요")
            return ;
        }
        axios.get("/open/emailcheck",{
            params:{
            username:form.username
            }
        }).then((res)=>
        {   console.log(res.data)
            if(res.data){
                alert("이미존재하는이메일입니다");
                console.log("이메일체크",res.data)
                setisemailcheck("fail");
            }
            else{
                alert("가입가능한이메일입니다!")
                setisemailcheck("success");
            }
        }).catch(
            (error)=>{
                alert("서버에러입니다"+error)
            }
        )

        
    }
    //프로필아이디체크
    const checkProfileId=(e)=>{
        e.preventDefault();
         if(!form.profileid || form.profileid.trim()===""){
            alert("프로필id를 입력해주세요!")
            return;
        }
        if(errors.profileid){
            alert("프로필양식을확인해주세요")
            return ;
        }
        axios.get("/open/profileidcheck",{
            params:{
                profileid:form.profileid
            }
        }).then((res)=>{
            if(res.data){
                alert("이미존재하는아이디입니다")
                  setIsprofileidcheck("fail")
            }
            else{
                alert("사용가능한아이디입니다")
                setIsprofileidcheck("success")
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

    if(!isemailcheck==="success"){
        alert("이메일을중복검사를완료해주세요")
    }
    if(!isproflieidcheck==="success"){
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
    

    //주소클리어
    const RegionClear=(e)=>{
        e.preventDefault()
        setform((prev)=>({
            ...prev,
            region:"",
            gridx:"",
            gridy:""
        }));
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
            
                <Inputcell hasError={errors.username}>
                <StyledIcon icon={usericon} hasError={errors.username}/>
                <Inputarea
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="로그인이메일"
                  hasError={errors.username}
                />
                <SubButtondiv>
                     <SubButton onClick={checkEmail} isChecked={isemailcheck} >
                       {isemailcheck==="success"? "V": "중복검사"} 
                        </SubButton>
                </SubButtondiv>
               
                </Inputcell>
                <Errordiv>

              
                {errors.username && <p>{errors.username}</p>}
                  </Errordiv>
             

            </Formrow>

            <Formrow>
             
                <Inputcell hasError={errors.password}>
                 <StyledIcon icon={passwordicon} hasError={errors.password}/>
                <Inputarea
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="비밀번호"
                  hasError={errors.password}
                />
                </Inputcell>
                  <Errordiv>
                {errors.password && <p>{errors.password}</p>}
                    </Errordiv>
             
            </Formrow>

            <Formrow>
              
             <Inputcell hasError={errors.confirmpassword}>
                <StyledIcon icon={confirmicon} hasError={errors.confirmpassword}/>
                <Inputarea
                  name="confirmpassword"
                  value={form.confirmpassword}
                  type="password"
                  onChange={handleChange}
                  placeholder="비밀번호확인"
                  hasError={errors.confirmpassword}
                />
                </Inputcell>
                    <Errordiv>
                {
                    errors.confirmpassword &&<p>{errors.confirmpassword }</p>
                /*!form.confirmpassword ||
                form.password === form.confirmpassword ? null : (
                  <p>비밀번호가 일치하지 않습니다</p>
                )
                */  
                }
                    </Errordiv>
               
             
            </Formrow>

            <Formrow>
             
                <Inputcell hasError={errors.profileid}>
                 <StyledIcon icon={profileicon} hasError={errors.profileid}/>
                <Inputarea
                  name="profileid"
                  value={form.profileid}
                  onChange={handleChange}
                  placeholder="프로필id"
                  hasError={errors.profileid}
                />
                  <SubButtondiv>
                               <SubButton onClick={checkProfileId} isChecked={isproflieidcheck}>
                                {isproflieidcheck==="success"?"V":"중복검사"}
                                </SubButton>
                </SubButtondiv>
     
                </Inputcell>
                    <Errordiv>
                {errors.profileid && <p>{errors.profileid}</p>}
                </Errordiv>
               
            
            </Formrow>

            <Formrow>
             
               <Inputcell hasError={errors.nickname}>
                <StyledIcon icon={usericon} hasError={errors.nickname}/>
                <Inputarea
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  placeholder="닉네임"
                  hasError={errors.nickname}
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
                <ClearButton onClick={(e)=>{ RegionClear(e)}} visible={form.region.length>2}>
                    <Clearicon icon={xicon}/>
                </ClearButton>

           

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