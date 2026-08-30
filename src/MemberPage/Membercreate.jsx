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
import BrandMark from "../UI/BrandMark";
import { useToast, messageFromError } from "../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../config/api";
import { oauthredirect } from "../UI/Authmarks";
const Wrapper=styled.div`
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 16px 64px;
    background: ${(props)=>props.theme.page};
    color: ${(props)=>props.theme.text};

    @media (max-width: 620px) {
      padding: 28px 14px 48px;
    }
`
//예전에는 "헤더" 라는 글자가 회색 네모 안에 그대로 남아 있었다.
const Headerdiv=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-bottom: 26px;
    user-select: none;
`
const Brandrow=styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
`
const Wordmark=styled.span`
    font-size: 20px;
    font-weight: 750;
    letter-spacing: -0.03em;
    background-image: linear-gradient(
        120deg,
        ${(props)=>props.theme.accent},
        ${(props)=>props.theme.accentHover}
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`
const Headertitle=styled.h3`
    margin: 12px 0 0;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.02em;
`
const Headersub=styled.p`
    margin: 0;
    font-size: 13.5px;
    color: ${(props)=>props.theme.textMuted};
`
//폼 카드. 600px 고정이라 모바일에서 가로로 삐져나갔다.
const Maindiv=styled.div`
    display: flex;
    position: relative;
    width: min(560px, 100%);
    padding: 26px 26px 22px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadowLg};

    @media (max-width: 620px) {
      padding: 20px 18px 18px;
    }
`
const StyledForm=styled.form`
    width: 100%;
`
//예전에는 <table><tbody> 안에 div(Formrow)를 넣고 있어서
//브라우저가 DOM 중첩 경고를 냈다. 표가 아니라 세로 스택이 맞다.
const Fieldstack=styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
const Formrow=styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`


const Inputcell=styled.div`
    position: relative;
    display: flex;
    align-items: center;
    text-align: left;
    gap: 8px;
    height: ${(props)=>props.theme.fieldHeight};
    padding: 0 10px 0 ${(props)=>props.theme.fieldPadX};
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.hasError?props.theme.warning:props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition};

    /* 포커스 링은 칸 전체에 준다. input 이 테두리 없이 안에 얹혀 있어서
       입력창 자체에 걸면 화면에 아무 표시도 나지 않는다. */
    &:focus-within {
        border-color: ${(props)=>props.hasError?props.theme.warning:props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.hasError
            ?"rgba(255, 82, 82, 0.14)"
            :props.theme.accentSoft};
    }
`
const SubButtondiv=styled.div`
    
     margin-left: auto;
  display: flex;
  align-items: center;
  

 
`
//통과 / 실패 / 아직 안함 세 상태를 색으로 구분한다.
const subtone=(props)=>{
  if(props.isChecked==="success") return props.theme.toneSuccess;
  if(props.isChecked==="fail") return props.theme.warning;
  return props.theme.accent;
}
const SubButton=styled.button`
    flex: none;
    height: 30px;
    padding: 0 12px;
    border: 1px solid transparent;
    background: ${subtone};
    color: #fff;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: filter ${(props)=>props.theme.transition},
                background ${(props)=>props.theme.transition};

    &:hover:not(:disabled) { filter: brightness(1.08); }
    &:active:not(:disabled) { filter: brightness(0.94); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
//아이콘
const StyledIcon=styled(FontAwesomeIcon)`
    flex: none;
    font-size: 15px;
    color: ${(props)=>props.hasError?props.theme.warning:props.theme.textFaint};
`
const Inputarea=styled.input`
    flex: 1;
    min-width: 0;
    height: 100%;
    background: transparent;
    outline: none;
    border: none;
    font-size: ${(props)=>props.theme.fieldFont};
    color: ${(props)=>props.theme.text};

    &::placeholder{
        color: ${(props)=>props.theme.textFaint};
        font-size: 14px;
        opacity: 1;
    }
    &:read-only { cursor: default; }
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
        /* "visable" 오타 때문에 지금까지 지우기 버튼이 항상 보이는 상태였다 */
    visibility: ${(props)=>props.visible?"visible":"hidden"};
    cursor: pointer;
    flex: none;
`
const Clearicon=styled(FontAwesomeIcon)`
    font-size: 17px;
    color: ${(props)=>props.theme.textFaint};

    &:hover { color: ${(props)=>props.theme.warning}; }
`
//메시지가 없을 때도 자리를 잡아둬야 아래 칸들이 위아래로 튀지 않는다.
const Errordiv=styled.div`
    display: flex;
    align-items: center;
    min-height: 26px;
    padding: 4px 2px 0;
    font-size: 12.5px;
    color: ${(props)=>props.theme.warning};

    p { margin: 0; }
`
//이미 가입된 이메일일 때, 어떤 방식으로 가입했는지 알려주는 줄.
//"이미 가입된 이메일입니다" 만으로는 구글로 가입해 둔 걸 모르고 계속 시도하게 된다.
const Takennotice=styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 2px 0 6px;
    padding: 10px 12px;
    border: 1px solid ${(props)=>props.theme.warning};
    border-radius: ${(props)=>props.theme.radius};
    background: rgba(255, 82, 82, 0.07);
    font-size: 13px;
    line-height: 1.5;
    color: ${(props)=>props.theme.text};
`
const Takentext=styled.span`
    flex: 1;
    min-width: 150px;
`
const Takenbutton=styled.button`
    flex: none;
    height: 30px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.accent};
    color: #fff;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: filter ${(props)=>props.theme.transition};

    &:hover { filter: brightness(1.08); }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
//동의 영역. 개인정보 보호법상 수집·이용 동의는 가입 전에 받아야 한다.
const Agreebox=styled.div`
    margin-top: 14px;
    padding: 12px 14px;
    border: 1px solid ${(props)=>props.$invalid?props.theme.warning:props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surfaceAlt};
    display: flex;
    flex-direction: column;
    gap: 2px;
`
const Agreerow=styled.label`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 2px;
    font-size: 13.5px;
    cursor: pointer;
    user-select: none;
    color: ${(props)=>props.theme.text};
    border-bottom: ${(props)=>props.$divider?`1px solid ${props.theme.border}`:"none"};
    font-weight: ${(props)=>props.$strong?600:400};

    input {
        width: 17px;
        height: 17px;
        flex: none;
        accent-color: ${(props)=>props.theme.accent};
        cursor: pointer;
    }
`
const Requiredtag=styled.span`
    flex: none;
    font-size: 11.5px;
    font-weight: 600;
    color: ${(props)=>props.theme.accent};
`
const Viewlink=styled.a`
    margin-left: auto;
    flex: none;
    font-size: 12.5px;
    color: ${(props)=>props.theme.textMuted};
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover { color: ${(props)=>props.theme.accent}; }
`
const Footerdiv=styled.div`
    margin-top: 14px;
    display: flex;
    justify-content: center;
`
const SubmitButton=styled.button`
    margin-top: 8px;
    width: 100%;
    height: ${(props)=>props.theme.fieldHeight};
    border: none;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.accent};
    color: #fff;
    font-size: ${(props)=>props.theme.fieldFont};
    font-weight: 700;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: filter ${(props)=>props.theme.transition};

    &:hover:not(:disabled) { filter: brightness(1.08); }
    &:active:not(:disabled) { filter: brightness(0.94); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`


//provider 는 자체가입이면 "mypage", 소셜이면 "Google"/"Naver" 로 온다.
const providerlabel=(provider)=>{
    const v=(provider||"").toLowerCase();
    if(v==="google") return "구글";
    if(v==="naver") return "네이버";
    return "";
}
const takenmessage=(provider)=>{
    const v=(provider||"").toLowerCase();
    if(v==="mypage") return "이미 가입된 이메일입니다. 로그인해주세요.";
    if(v==="google"||v==="naver") return providerlabel(provider)+" 계정으로 가입된 이메일입니다.";
    return "이미 가입된 이메일입니다.";
}

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
    //중복인 이메일이 어떤 방식으로 가입됐는지("mypage"/"Google"/"Naver"/"unknown")
    const [takenprovider,setTakenprovider]=useState("")
    //필수 동의 두 가지. 둘 다 체크해야 가입 요청을 보낸다.
    const [agree,setAgree]=useState({terms:false,privacy:false,age:false})
    const [agreeerror,setAgreeerror]=useState(false)
    const [errors,seterrors]=useState({})


    
    const navigate=useNavigate();
    const toast=useToast();

    //이벤트핸들링
    const handleChange=(e)=>{
        //태그에 namevalue 설정하면 e.target안에 {name:,value:} 속성이생김
        const {name,value}= e.target;
        const newvalue=name==='profileid'? value.toLowerCase() :value;
        //[] -> 변수로쓰기때문에추가필요함 객체의 속성에 접근한다는뜻이래
        const updatedForm = {...form,[name]:newvalue}

        setform(updatedForm);

        //reset:이메일아이디중복체크 입력변경시 다시확인
        if(name==="username"){ setisemailcheck(false); setTakenprovider(""); }
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
            toast.info("이메일을 입력해주세요.")
            return;
        }
        if(errors.username){
            toast.info("이메일 형식을 확인해주세요.")
            return ;
        }
        axios.get(`${API_BASE}/open/emailcheck`,{
            params:{
            username:form.username
            }
        }).then((res)=>
        {   console.log(res.data)
            if(res.data){
                console.log("이메일체크",res.data)
                setisemailcheck("fail");
                //중복이면 어떤 방식으로 가입한 계정인지 이어서 확인한다.
                //아이디찾기가 쓰는 엔드포인트가 {username, provider} 를 그대로 돌려준다.
                axios.get(`${API_BASE}/open/usernamefind/${form.username}`).then((r)=>{
                    const provider=r.data?.provider||"unknown";
                    setTakenprovider(provider);
                    toast.error(takenmessage(provider));
                }).catch(()=>{
                    setTakenprovider("unknown");
                    toast.error("이미 가입된 이메일입니다.");
                })
            }
            else{
                toast.success("사용할 수 있는 이메일입니다.")
                setisemailcheck("success");
                setTakenprovider("");
            }
        }).catch(
            (error)=>{
                toast.error(messageFromError(error,"이메일을 확인하지 못했습니다."))
            }
        )

        
    }
    //프로필아이디체크
    const checkProfileId=(e)=>{
        e.preventDefault();
         if(!form.profileid || form.profileid.trim()===""){
            toast.info("프로필 아이디를 입력해주세요.")
            return;
        }
        if(errors.profileid){
            toast.info("프로필 아이디 형식을 확인해주세요.")
            return ;
        }
        axios.get(`${API_BASE}/open/profileidcheck`,{
            params:{
                profileid:form.profileid
            }
        }).then((res)=>{
            if(res.data){
                toast.error("이미 사용 중인 아이디입니다.")
                  setIsprofileidcheck("fail")
            }
            else{
                toast.success("사용할 수 있는 아이디입니다.")
                setIsprofileidcheck("success")
            }
        }).catch(
            (error)=>{
                toast.error(messageFromError(error,"아이디를 확인하지 못했습니다."))
            }
        )
    }
    //주소 선택




//인증확인및 가입요청
const handleSubmit=(e)=>{
    e.preventDefault();
    //전체검사
    const newErrors={};
    //키값을 돌림 
    Object.keys(form).forEach((key)=>{
        //발리데이션 컴펌패스워드때매 폼을 부름
        const error=Validators(key,form[key],form);
        //에러값이있을경우 뉴에러에 키값으로넣자
        //"" 을리턴하는데 빈문자열이나 falsy한값(false,0 ,"",null,undefined,nan)은 반환안한다고함
        //즉 if문을 통과못함
        if(error) newErrors[key]=error; //에러존재할시 키와밸류추가
    })

    //!isemailcheck === "success" 는 !isemailcheck(불린) 을 문자열과 비교하는 꼴이라
//항상 false 였다. 즉 중복검사를 안 해도 가입 요청이 그대로 나갔다.
    if(isemailcheck!=="success"){
        toast.info("이메일 중복검사를 먼저 해주세요.")
        return;
    }
    if(isproflieidcheck!=="success"){
        toast.info("프로필 아이디 중복확인을 먼저 해주세요.")
        return;
    }
    const ispasswordConfirmed=form.password === form.confirmpassword;
    if(!ispasswordConfirmed){
        newErrors.confirmpassword="비밀번호가일치하지않습니다"
    }
    seterrors(newErrors);
    if(Object.keys(newErrors).length>0){
        toast.error("입력값을 확인해주세요.")
        return;
    }

    //동의를 받지 않고 개인정보를 수집하면 안 된다. 마지막 관문으로 둔다.
    if(!agree.terms || !agree.privacy || !agree.age){
        setAgreeerror(true)
        toast.info("필수 항목에 모두 동의해주세요.")
        return;
    }

    
    
        axios.post(`${API_BASE}/open/membercreate`,{
            username:form.username,
            password:form.password,
            profileid:form.profileid,
            nickname:form.nickname,
            region:form.region,
            gridx:form.gridx,
            gridy:form.gridy,
            //서버도 동의 여부를 다시 확인하고, 동의 시각을 서버 시계로 기록한다.
            agreeterms:agree.terms,
            agreeprivacy:agree.privacy,
            agreeage:agree.age
        }).then((res)=>{
            toast.success("인증메일을 보냈습니다. 메일에서 인증을 마치면 로그인할 수 있습니다.",{duration:6000})
            navigate("/main")
        }).catch((err)=>{
            //예전에는 콘솔에만 찍혀서, 가입이 실패해도 화면은 아무 반응이 없었다.
            console.log(err.response?.data);
            toast.error(messageFromError(err,"가입하지 못했습니다. 잠시 후 다시 시도해주세요."))
        })
    
    }
    

    //가입 방식 안내에서 바로 로그인으로 보낸다.
    const gotologin=()=>{
        const v=(takenprovider||"").toLowerCase();
        if(v==="google"||v==="naver"){
            oauthredirect(v);
            return;
        }
        navigate("/login");
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
        <Brandrow onClick={()=>navigate("/")} title="홈으로">
          <BrandMark size={26}/>
          <Wordmark>Weave</Wordmark>
        </Brandrow>
        <Headertitle>회원가입</Headertitle>
        <Headersub>오늘의 하늘을 함께 나눌 준비를 합니다.</Headersub>
    </Headerdiv>
    <Maindiv>
   <StyledForm onSubmit={handleSubmit}>
        <Fieldstack>
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
                       {isemailcheck==="success"? "확인됨": "중복검사"} 
                        </SubButton>
                </SubButtondiv>
               
                </Inputcell>
                <Errordiv>

                {errors.username && <p>{errors.username}</p>}
                  </Errordiv>

                {takenprovider &&
                <Takennotice role="status">
                  <Takentext>{takenmessage(takenprovider)}</Takentext>
                  <Takenbutton type="button" onClick={gotologin}>
                    {providerlabel(takenprovider)
                      ? providerlabel(takenprovider)+"로 로그인"
                      : "로그인하러 가기"}
                  </Takenbutton>
                </Takennotice>}
             

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
                                {isproflieidcheck==="success"?"확인됨":"중복검사"}
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
        </Fieldstack>
        <Agreebox $invalid={agreeerror}>
          <Agreerow $divider $strong>
            <input
              type="checkbox"
              checked={agree.terms&&agree.privacy&&agree.age}
              onChange={(e)=>{
                const on=e.target.checked;
                setAgree({terms:on,privacy:on,age:on});
                if(on) setAgreeerror(false);
              }}
            />
            전체 동의
          </Agreerow>

          <Agreerow>
            <input
              type="checkbox"
              checked={agree.terms}
              onChange={(e)=>{
                setAgree((prev)=>({...prev,terms:e.target.checked}));
                if(e.target.checked) setAgreeerror(false);
              }}
            />
            <Requiredtag>[필수]</Requiredtag>
            이용약관 동의
            <Viewlink href="/terms" target="_blank" rel="noreferrer"
              onClick={(e)=>e.stopPropagation()}>보기</Viewlink>
          </Agreerow>

          <Agreerow>
            <input
              type="checkbox"
              checked={agree.privacy}
              onChange={(e)=>{
                setAgree((prev)=>({...prev,privacy:e.target.checked}));
                if(e.target.checked) setAgreeerror(false);
              }}
            />
            <Requiredtag>[필수]</Requiredtag>
                        개인정보 수집·이용 동의
            <Viewlink href="/privacy" target="_blank" rel="noreferrer"
              onClick={(e)=>e.stopPropagation()}>보기</Viewlink>
          </Agreerow>

          {/* 만 14세 미만은 법정대리인 동의가 필요하다. 받을 방법이 없으므로 가입을 막는다. */}
          <Agreerow>
            <input
              type="checkbox"
              checked={agree.age}
              onChange={(e)=>{
                setAgree((prev)=>({...prev,age:e.target.checked}));
                if(e.target.checked) setAgreeerror(false);
              }}
            />
            <Requiredtag>[필수]</Requiredtag>
            만 14세 이상입니다
          </Agreerow>
        </Agreebox>
        <Errordiv>
          {agreeerror && <p>필수 항목에 동의해야 가입할 수 있습니다.</p>}
        </Errordiv>

        <Footerdiv>

        <SubmitButton type="submit" >회원가입</SubmitButton>
         </Footerdiv>
      </StyledForm>
                
    </Maindiv>
    
    
 
    </Wrapper>
)
}

export default membercreate;