import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { Validators } from "../UI/Modals/Validators";
import { useNavigate } from "react-router-dom";
import BrandMark from "../UI/BrandMark";
import { useToast, messageFromError } from "../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../config/api";
import { oauthredirect } from "../UI/Authmarks";

//=====================================================================
// 아이디(이메일) 찾기
//  - 색/굴곡/그림자는 전부 테마 토큰에서 가져온다. 예전에는 black/blue 테두리와
//    #3ca0fd 같은 값이 직접 박혀 있어서 다크모드에서 그대로 흰 카드가 남았다.
//  - 높이를 %로 잡으면(부모 20% 안의 28%) 창 크기에 따라 버튼이 찌그러진다. px 로 고정.
//=====================================================================

const Wrapper=styled.div`
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 56px 16px 40px;
    background: ${(props)=>props.theme.page};

    @media (max-width: 620px) {
      padding: 28px 14px 32px;
    }
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

    @media (max-width: 620px) {
      padding: 24px 20px 22px;
    }
`
const Logodiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    /* 눌러서 홈으로 가는 로고인데 이 페이지만 cursor 가 빠져 있었다.
       (로그인·비밀번호찾기 쪽은 pointer 로 되어 있다) */
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
//메시지가 없을 때도 자리를 잡아둬야 버튼이 위아래로 튀지 않는다.
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
    transition: filter ${(props)=>props.theme.transition},
                background ${(props)=>props.theme.transition};

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

//결과 패널 - 실패는 붉은 기, 안내는 파란 기가 살짝 돌게 한다(토스트와 같은 방식).
const Resultdiv=styled.div`
    margin-top: 22px;
    padding: 18px 18px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
    border: 1px solid ${(props)=>props.$tone==="error"?props.theme.warning:props.theme.accent};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.$tone==="error"
        ?"rgba(255, 82, 82, 0.07)"
        :props.theme.accentSoft};
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
const Errortreatdiv=styled.div`
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

//카드 맨 아래 한 줄. 비밀번호 찾기 화면의 하단 줄과 같은 모양으로 맞췄다.
//("찾아봤더니 계정이 없네" 하고 바로 가입으로 넘어가는 길)
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

function Memberidfind(){

  const [username,setUsername]=useState("");
  const [valierr,setvalierr]=useState();
  const [result,setResult]=useState(
    {
      error:'', //에러시문자열
      email:'', //찾으려던 이메일
      username:'', //중복시유저네임
      oauth:'' //oauth여부
    }
  );
  const [touched,setTouched]=useState(false)
  const [issending,setIssending]=useState(false)

  const navigate=useNavigate();
  const toast=useToast();

  const Usernamefind=()=>{
    //빈 칸으로 눌러도 요청이 나가서 /open/usernamefind/undefined 를 호출하고 있었다.
    //(Validators 의 필수검사는 rule.require 오타 때문에 동작하지 않는다)
   const email=(username||"").trim();
   if(!email){
     setvalierr("이메일을 입력해주세요.");
     toast.info("찾으실 이메일을 입력해주세요.");
     return;
   }

   const err=Validators("username",email);
   if(err){
     setvalierr(err);
     return;
   }

   setvalierr("");
   setIssending(true);
    axios.get(`${API_BASE}/open/usernamefind/${email}`).then((res)=>{
      console.log("요청",res)
      setResult({username:res.data.username,oauth:res.data.provider,email:email})
    }).catch((err)=>{
        console.log("err",err.response)
        setResult({
          error:err.response?.data?.message||messageFromError(err,"계정을 찾지 못했습니다."),
          email:email
        })
    }).finally(()=>{
      setIssending(false)
    })
  }

  const Inputhanlder=(e)=>{
    setUsername(e.target.value)

      if (touched) {
    // 이미 input을 한번 blur 했으면, 입력시마다(실시간) 검사
    const err = Validators("username", e.target.value);
    setvalierr(err);
  }




  }

  const handleBlur = (e) => {
  // 입력값이 있을 때만 유효성 검사
  if (username) {
      const err=Validators("username",e.target.value)

  setvalierr(err);
  } else {
    setvalierr(""); // 빈 값이면 에러 메시지도 숨김
  }
  setTouched(true)
};

const googlelogin=()=>oauthredirect("google");
const naverlogin=()=>oauthredirect("naver");

  return (
    <Wrapper>
    <Card>
        <Logodiv onClick={()=>navigate("/")} role="link" title="홈으로">
          <BrandMark size={26}/>
          <Wordmark>Weave</Wordmark>
        </Logodiv>
        <Headertext>아이디 찾기</Headertext>
        <Subtext>가입할 때 쓰신 이메일을 입력하시면<br/>어떤 방식으로 가입했는지 알려드립니다.</Subtext>

    {/* form 으로 감싸야 엔터로도 제출된다. 예전에는 버튼 클릭만 먹었다. */}
    <Form onSubmit={(e)=>{e.preventDefault();Usernamefind()}}>
        <Inputdiv
          type="email"
          value={username}
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
          {issending?"찾는 중...":"아이디찾기"}
        </Findbutton>
    </Form>

      {result.error &&
      <Resultdiv $tone="error">
        <Resulttitle>가입된 계정을 찾지 못했습니다</Resulttitle>
        <Resulttext>{result.email} · {result.error}</Resulttext>
        <Errortreatdiv>
          <TreatButton type="button" onClick={()=>{navigate("/")}}>홈으로</TreatButton>
          <TreatButton type="button" $primary onClick={()=>{navigate("/membercreate")}}>회원가입</TreatButton>
        </Errortreatdiv>
      </Resultdiv>}

      {!result.error && result.oauth &&
      <Resultdiv $tone="info">
      {result.oauth==="mypage"
        ?(
        <>
        <Resulttitle>{result.username}님은 자체 가입 회원입니다</Resulttitle>
        <Resulttext>비밀번호가 기억나지 않으시면 비밀번호 찾기로 진행해주세요.</Resulttext>
        <Errortreatdiv>
          <TreatButton type="button" onClick={()=>{navigate("/")}}>홈으로</TreatButton>
          <TreatButton type="button" $primary onClick={()=>{navigate("/memberpasswordfind")}}>비밀번호찾기</TreatButton>
        </Errortreatdiv>
        </>
        )
        :
        (<>
        <Resulttitle>{result.username}님은 {result.oauth} 로그인 사용자입니다</Resulttitle>
        <Resulttext>아래 버튼으로 바로 로그인하실 수 있습니다.</Resulttext>
        <Errortreatdiv>
          <TreatButton type="button" onClick={()=>{navigate("/")}}>홈으로</TreatButton>
          {result&&result.oauth ==="Google"
            ?<Authimage src={`${process.env.PUBLIC_URL}/img/google.png`} onClick={googlelogin} alt="구글로 로그인"/>
            :<Authimage src={`${process.env.PUBLIC_URL}/img/NAVERBTG.png`} onClick={naverlogin} alt="네이버로 로그인"/>}
        </Errortreatdiv>
        </>
        )
      }
      </Resultdiv>}

      <Bottomdiv>
        <Guidetext>아직 계정이 없으신가요?</Guidetext>
        <Navitag type="button" onClick={()=>{navigate("/membercreate")}}>회원가입</Navitag>
      </Bottomdiv>

   </Card>
    </Wrapper>
  )
}

export default Memberidfind
