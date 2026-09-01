import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Validators } from "../UI/Modals/Validators";
import { apiUrl } from "../config/api";
import BrandMark from "../UI/BrandMark";
import { useToast, messageFromError } from "../UI/Feedback/FeedbackProvider";
import { oauthredirect } from "../UI/Authmarks";

//=====================================================================
// 비밀번호 찾기
//  - 아이디 찾기(Memberidfind)와 같은 카드 구성을 쓴다. 두 화면은 나란히 오가는 짝이다.
//  - 색은 전부 테마 토큰. 예전에는 결과 문구가 color:white 로 박혀 있어서
//    라이트 모드에서는 글자가 아예 보이지 않았다.
//=====================================================================

const Wrapper=styled.div`
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 56px 16px 40px;
    background: ${(props)=>props.theme.page};

    @media (max-width: 620px) { padding: 28px 14px 32px; }
`
const Card=styled.div`
    width: min(440px, 100%);
    display: flex;
    flex-direction: column;
    padding: 30px 30px 26px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};

    @media (max-width: 620px) { padding: 24px 20px 22px; }
`
const Logodiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
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
const Headertext=styled.h3`
    margin: 22px 0 4px;
    text-align: center;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.02em;
`
const Subtext=styled.p`
    margin: 0 0 22px;
    text-align: center;
    font-size: 13.5px;
    line-height: 1.6;
    color: ${(props)=>props.theme.textMuted};
`
const Form=styled.form`
    display: flex;
    flex-direction: column;
    gap: 6px;
`
const Inputdiv=styled.input`
    width: 100%;
    height: ${(props)=>props.theme.fieldHeight};
    padding: 0 ${(props)=>props.theme.fieldPadX};
    font-size: ${(props)=>props.theme.fieldFont};
    color: ${(props)=>props.theme.text};
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.$invalid?props.theme.warning:props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    outline: none;
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition};

    &::placeholder { color: ${(props)=>props.theme.textFaint}; }

    &:focus {
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
const Validationdiv=styled.div`
    min-height: 17px;
    padding-left: 2px;
    font-size: 12.5px;
    color: ${(props)=>props.theme.warning};
`
const Findbutton=styled.button`
    width: 100%;
    height: ${(props)=>props.theme.fieldHeight};
    margin-top: 4px;
    font-size: ${(props)=>props.theme.fieldFont};
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #fff;
    background: ${(props)=>props.theme.accent};
    border: none;
    border-radius: ${(props)=>props.theme.radiusPill};
    cursor: pointer;
    transition: filter ${(props)=>props.theme.transition};

    &:hover:not(:disabled) { filter: brightness(1.08); }
    &:active:not(:disabled) { filter: brightness(0.94); }
    &:disabled {
        background: ${(props)=>props.theme.surfaceAlt};
        color: ${(props)=>props.theme.textFaint};
        cursor: default;
    }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`

//결과 패널. 실패는 붉은 기, 안내는 파란 기, 성공은 초록 기가 살짝 돈다(토스트와 같은 방식).
const tonecolor=(props)=>{
    if(props.$tone==="error") return props.theme.warning;
    if(props.$tone==="success") return props.theme.toneSuccess;
    return props.theme.accent;
}
const Resultdiv=styled.div`
    margin-top: 22px;
    padding: 18px 18px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
    border: 1px solid ${tonecolor};
    border-radius: ${(props)=>props.theme.radius};
    background-color: ${(props)=>props.theme.surface};
    background-image: linear-gradient(0deg,
        color-mix(in srgb, ${tonecolor} 9%, transparent),
        color-mix(in srgb, ${tonecolor} 9%, transparent));
`
const Resulttitle=styled.p`
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.5;
`
const Resulttext=styled.p`
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: ${(props)=>props.theme.textMuted};
    word-break: break-all;
`
const Treatdiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
`
const TreatButton=styled.button`
    height: 34px;
    padding: 0 16px;
    font-size: 13.5px;
    font-weight: 600;
    border-radius: ${(props)=>props.theme.radiusPill};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition},
                filter ${(props)=>props.theme.transition};

    ${(props)=>props.$primary
        ?`
        border: 1px solid transparent;
        color: #fff;
        background: ${props.theme.accent};
        &:hover { filter: brightness(1.08); }
        `
        :`
        border: 1px solid ${props.theme.border};
        color: ${props.theme.textMuted};
        background: ${props.theme.surface};
        &:hover { background: ${props.theme.surfaceHover}; color: ${props.theme.text}; }
        `}

    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
const Authimage=styled.img`
    width: 100px;
    height: 34px;
    object-fit: contain;
    cursor: pointer;
    border-radius: ${(props)=>props.theme.radiusSm};

    &:hover {
        filter: brightness(0.9);
        transition: filter 0.3s ease;
    }
`
const Bottomdiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid ${(props)=>props.theme.border};
    font-size: 13px;
`
const Guidetext=styled.span`
    color: ${(props)=>props.theme.textMuted};
`
const Navitag=styled.button`
    border: none;
    background: none;
    padding: 0;
    font-size: 13px;
    font-weight: 600;
    color: ${(props)=>props.theme.accent};
    cursor: pointer;

    &:hover { text-decoration: underline; text-underline-offset: 3px; }
    &:focus-visible { outline: 2px solid ${(props)=>props.theme.accent}; outline-offset: 2px; }
`

function Memberpasswordfind(){

const [email,Setemail]=useState("");
/* 상대경로로 두면 요청이 백엔드가 아니라 프론트 도메인으로 간다.
   Pages 는 _redirects 규칙 때문에 index.html 을 200 으로 돌려줘서,
   에러도 성공도 뜨지 않고 메일도 안 나갔다.
   여기는 설정된 instance 가 아니라 순수 axios 를 쓰므로 baseURL 이 없다. */
const url=apiUrl("/open/passwordfind")
const navigate=useNavigate();
const toast=useToast();
const [valierr,setvalierr]=useState();
 const [touched,setTouched]=useState(false)
 const [issending,setIssending]=useState(false)
const [result,setResult]=useState({
   error: null,
  message: null,
  status: null,
  username: null,
  provider: null,
}
);
const Inputhanlder=(e)=>{
    Setemail(e.target.value)

      if (touched) {
    // 이미 input을 한번 blur 했으면, 입력시마다(실시간) 검사
    const err = Validators("username", e.target.value);
    setvalierr(err);

  }




  }

  const handleBlur = (e) => {
  // 입력값이 있을 때만 유효성 검사
  if (email) {
      const err=Validators("username",e.target.value)

  setvalierr(err);
  } else {
    setvalierr(""); // 빈 값이면 에러 메시지도 숨김
  }
  setTouched(true)
};

//소셜 가입자에게는 그 로그인으로 바로 보내준다(아이디찾기와 같은 방식).
const oauthlogin=(provider)=>oauthredirect(provider);

const findpassword=()=>{
  //빈 칸으로 눌러도 요청이 나가던 자리.
  //Validators 의 필수검사는 rule.require 오타 때문에 동작하지 않는다.
  const target=(email||"").trim();
  if(!target){
    setvalierr("이메일을 입력해주세요.");
    toast.info("비밀번호를 찾을 이메일을 입력해주세요.");
    return;
  }
  const err=Validators("username",target);
  if(err){
    setvalierr(err);
    return ;
  }

  setvalierr("");
  setIssending(true);
  axios.get(url,{
    params:{
        email:target
    }

  }).then((res)=>{
    console.log("레슽",res.data)
   setResult({
      error: null,
      message: null,
      status: res.data.status,
      username: res.data.username,
      provider: res.data.provider,
    });

  }).catch((err)=>{
    //예전에는 여기서 err.response.data 를 그냥 읽어서,
    //서버가 아예 안 뜬 경우(response 자체가 없음) catch 안에서 다시 터졌다.
    console.log("에러",err.response?.data)
    if(err.response&&err.response.data){
      const data=err.response.data;
          setResult({
        error: null,
        message: data.message || "알 수 없는 오류가 발생했습니다.",
        status: data.errorcode || "UNKNOWN_ERROR",
        username: null,
        provider: null,
      });
  }else {
      setResult({
        error: "NETWORK_ERROR",
        message: messageFromError(err,"서버에 연결할 수 없습니다. 네트워크를 확인하세요."),
        status: null,
        username: null,
        provider: null,
      });
    }
}).finally(()=>{
    setIssending(false)
})
}


  return (
    <Wrapper>
      <Card>
        <Logodiv onClick={()=>navigate("/")} title="홈으로">
          <BrandMark size={26}/>
          <Wordmark>Weave</Wordmark>
        </Logodiv>
        <Headertext>비밀번호 찾기</Headertext>
        <Subtext>가입하신 이메일로 임시 비밀번호를 보내드립니다.</Subtext>

    {/* form 으로 감싸야 엔터로도 제출된다 */}
    <Form onSubmit={(e)=>{e.preventDefault();findpassword()}}>
       <Inputdiv
         type="email"
         value={email}
         $invalid={!!valierr}
         onChange={(e)=>Inputhanlder(e)}
         onBlur={(e)=>handleBlur(e)}
         placeholder="이메일"
         aria-label="이메일"
       />
       <Validationdiv>
         {valierr&&<>{valierr}</>}
       </Validationdiv>
       <Findbutton type="submit" disabled={issending}>
         {issending?"보내는 중...":"임시 비밀번호 받기"}
       </Findbutton>
    </Form>

    {result.error &&
      <Resultdiv $tone="error">
        <Resulttitle>지금은 처리할 수 없습니다</Resulttitle>
        <Resulttext>{result.message}</Resulttext>
      </Resultdiv>}

    {!result.error && result.status==="NOT_FOUND_USER" &&
      <Resultdiv $tone="error">
        <Resulttitle>가입된 계정을 찾지 못했습니다</Resulttitle>
        <Resulttext>이메일을 다시 확인하시거나, 새로 가입해 주세요.</Resulttext>
        <Treatdiv>
          <TreatButton type="button" onClick={()=>navigate("/memberidfind")}>아이디 찾기</TreatButton>
          <TreatButton type="button" $primary onClick={()=>navigate("/membercreate")}>회원가입</TreatButton>
        </Treatdiv>
      </Resultdiv>}

    {!result.error && result.status==="oauthuser" &&
      <Resultdiv $tone="info">
        <Resulttitle>{result.username}님은 {result.provider} 로그인 사용자입니다</Resulttitle>
        <Resulttext>이 계정은 비밀번호가 없습니다. 아래 버튼으로 바로 로그인하실 수 있습니다.</Resulttext>
        <Treatdiv>
          <TreatButton type="button" onClick={()=>navigate("/")}>홈으로</TreatButton>
          {(result.provider||"").toLowerCase()==="google"
            ?<Authimage src={`${process.env.PUBLIC_URL}/img/google.png`} alt="구글로 로그인"
               onClick={()=>oauthlogin("google")}/>
            :<Authimage src={`${process.env.PUBLIC_URL}/img/NAVERBTG.png`} alt="네이버로 로그인"
               onClick={()=>oauthlogin("naver")}/>}
        </Treatdiv>
      </Resultdiv>}

    {!result.error && result.status==="Success" &&
      <Resultdiv $tone="success">
        <Resulttitle>임시 비밀번호를 보냈습니다</Resulttitle>
        <Resulttext>
          {result.username} 으로 보냈습니다.
          로그인한 뒤에는 비밀번호를 꼭 바꿔주세요.
        </Resulttext>
        <Treatdiv>
          <TreatButton type="button" $primary onClick={()=>navigate("/login")}>로그인하러 가기</TreatButton>
        </Treatdiv>
      </Resultdiv>}

      <Bottomdiv>
        <Guidetext>아이디가 기억나지 않으신다면?</Guidetext>
        <Navitag type="button" onClick={()=>{navigate("/memberidfind")}}>아이디 찾기</Navitag>
      </Bottomdiv>
      </Card>
    </Wrapper>

  )
}

export default Memberpasswordfind;
