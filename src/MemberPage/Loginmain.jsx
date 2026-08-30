import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import BrandMark from "../UI/BrandMark";
import { GoogleMark, NaverMark, oauthredirect } from "../UI/Authmarks";
import useLogin from "../customhook/useLogin";
import axios from "axios";
import { useToast, messageFromError } from "../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../config/api";

//=====================================================================
// 로그인 페이지 (/login)
//  - 예전에는 이 경로가 사이드바용 로그인 위젯(Loginpage)을 MainLayout 안에
//    그대로 띄우고 있었다. 위젯은 340x186 고정 카드라, 하늘 배경 위 커다란
//    빈 패널 안에 조그맣게 박힌 이상한 화면이 나왔다.
//  - 여기서는 아이디찾기 · 비밀번호찾기와 같은 카드 구성을 쓴다.
//    위젯은 사이드바 자리에 그대로 남는다.
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
    width: min(400px, 100%);
    display: flex;
    flex-direction: column;
    padding: 30px 30px 24px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};

    @media (max-width: 620px) { padding: 24px 20px 20px; }
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
    color: ${(props)=>props.theme.textMuted};
`
const Form=styled.form`
    display: flex;
    flex-direction: column;
    gap: 8px;
`
const Inputcss=styled.input`
    width: 100%;
    height: ${(props)=>props.theme.fieldHeight};
    padding: 0 ${(props)=>props.theme.fieldPadX};
    font-size: ${(props)=>props.theme.fieldFont};
    color: ${(props)=>props.theme.text};
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.theme.border};
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
const LoginButton=styled.button`
    width: 100%;
    height: ${(props)=>props.theme.fieldHeight};
    margin-top: 6px;
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
    &:focus-visible { outline: 2px solid ${(props)=>props.theme.accent}; outline-offset: 2px; }
`
//가운데 "또는" 이 들어간 구분선
const Divider=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0 16px;
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};

    &::before, &::after {
        content: "";
        flex: 1;
        height: 1px;
        background: ${(props)=>props.theme.border};
    }
`
const Authdiv=styled.div`
    display: flex;
    gap: 8px;
`
const Socialbutton=styled.button`
    flex: 1;
    min-width: 0;
    height: ${(props)=>props.theme.fieldHeight};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-size: 13.5px;
    font-weight: 600;
    border-radius: ${(props)=>props.theme.radius};
    cursor: pointer;
    transition: filter ${(props)=>props.theme.transition},
                background ${(props)=>props.theme.transition};

    &:focus-visible { outline: 2px solid ${(props)=>props.theme.accent}; outline-offset: 2px; }
`
const GoogleButton=styled(Socialbutton)`
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};

    &:hover { background: ${(props)=>props.theme.surfaceHover}; }
`
const NaverButton=styled(Socialbutton)`
    border: 1px solid transparent;
    background: #03c75a;   /* 네이버 지정색이라 토큰을 쓰지 않는다 */
    color: #ffffff;

    &:hover { filter: brightness(1.06); }
`
//인증 링크가 만료·무효일 때만 뜨는 재발송 칸.
//만료를 알려주고 끝내면 사용자가 갇힌다. 빠져나갈 길을 같이 줘야 한다.
const Resendbox=styled.div`
    margin-top: 18px;
    padding: 14px;
    border: 1px solid ${(props)=>props.theme.warning};
    border-radius: ${(props)=>props.theme.radius};
    background: rgba(255, 82, 82, 0.07);
    display: flex;
    flex-direction: column;
    gap: 8px;
`
const Resendtitle=styled.p`
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -0.01em;
`
const Resendtext=styled.p`
    margin: 0;
    font-size: 12.5px;
    line-height: 1.6;
    color: ${(props)=>props.theme.textMuted};
`
const Resendrow=styled.div`
    display: flex;
    gap: 6px;
`
const Resendinput=styled.input`
    flex: 1;
    min-width: 0;
    height: 36px;
    padding: 0 12px;
    font-size: 13.5px;
    color: ${(props)=>props.theme.text};
    background: ${(props)=>props.theme.surface};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    outline: none;

    &::placeholder { color: ${(props)=>props.theme.textFaint}; }
    &:focus { border-color: ${(props)=>props.theme.accent}; }
`
const Resendbutton=styled.button`
    flex: none;
    height: 36px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.accent};
    color: #fff;
    font-size: 12.5px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;

    &:hover:not(:disabled) { filter: brightness(1.08); }
    &:disabled { opacity: 0.6; cursor: default; }
    &:focus-visible { outline: 2px solid ${(props)=>props.theme.accent}; outline-offset: 2px; }
`
const Findformdiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 22px;
    padding-top: 16px;
    border-top: 1px solid ${(props)=>props.theme.border};
    font-size: 12.5px;
`
const Subtag=styled.button`
    border: none;
    background: none;
    padding: 0;
    font-size: 12.5px;
    color: ${(props)=>props.theme.textMuted};
    cursor: pointer;

    &:hover { color: ${(props)=>props.theme.accent}; text-decoration: underline; text-underline-offset: 3px; }
    &:focus-visible { outline: 2px solid ${(props)=>props.theme.accent}; outline-offset: 2px; }
`
const Dot=styled.span`
    color: ${(props)=>props.theme.borderStrong};
`
const Bottomdiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 16px;
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

//백엔드가 /login?verified=ok|already|expired|invalid 로 돌려보낸다.
const VERIFYMESSAGE={
    ok:      {tone:"success", text:"이메일 인증이 완료되었습니다. 이제 로그인하실 수 있습니다."},
    already: {tone:"info",    text:"이미 인증이 끝난 계정입니다. 로그인해 주세요."},
    expired: {tone:"error",   text:"인증 링크가 만료되었습니다. 인증메일을 다시 받아주세요."},
    invalid: {tone:"error",   text:"인증 링크가 올바르지 않습니다. 인증메일을 다시 받아주세요."},
};

function Loginmain(){

    const navigate=useNavigate();
    const [loginuser]=useCookies(['userinfo']);
    const {login,issending}=useLogin();
    const toast=useToast();
    const [query,setQuery]=useSearchParams();
    const [loginform,Setloginform]=useState({username:'',password:''});

    //만료·무효일 때만 재발송 칸을 띄운다.
    const [showresend,setShowresend]=useState(false);
    const [resendemail,setResendemail]=useState("");
    const [resending,setResending]=useState(false);

    useEffect(()=>{
        const verified=query.get("verified");
        if(!verified) return;

        const info=VERIFYMESSAGE[verified];
        if(info){
            toast[info.tone](info.text,{duration:info.tone==="error"?6000:4500});
            if(verified==="expired"||verified==="invalid") setShowresend(true);
        }
        //새로고침할 때마다 같은 안내가 다시 뜨지 않게 주소에서 지운다.
        setQuery({},{replace:true});
        //처음 한 번만 확인하면 된다(주소에서 지우므로 다시 실행될 일도 없다).
    },[])

    const resend=async()=>{
        const target=(resendemail||"").trim();
        if(!target){ toast.info("가입하신 이메일을 입력해주세요."); return; }
        setResending(true);
        try{
            const res=await axios.post(`${API_BASE}/open/member/resend`,{username:target});
            //계정이 없든 이미 인증됐든 서버는 같은 응답을 준다(이메일 존재 여부를 숨기려고).
            toast.success(res.data?.message||"인증 메일을 다시 보냈습니다.");
            setShowresend(false);
        }catch(err){
            toast.error(messageFromError(err,"메일을 보내지 못했습니다. 잠시 후 다시 시도해주세요."));
        }finally{
            setResending(false);
        }
    }

    //이미 로그인한 사람이 주소로 들어온 경우
    if(loginuser.userinfo){
        return (
            <Wrapper>
                <Card>
                    <Logodiv onClick={()=>navigate("/")} title="홈으로">
                        <BrandMark size={26}/>
                        <Wordmark>Weave</Wordmark>
                    </Logodiv>
                    <Headertext>이미 로그인되어 있습니다</Headertext>
                    <Subtext>타임라인으로 돌아가시겠어요?</Subtext>
                    <LoginButton type="button" onClick={()=>navigate("/main")}>메인으로 가기</LoginButton>
                </Card>
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <Card>
                <Logodiv onClick={()=>navigate("/")} title="홈으로">
                    <BrandMark size={26}/>
                    <Wordmark>Weave</Wordmark>
                </Logodiv>
                <Headertext>로그인</Headertext>
                <Subtext>오늘의 하늘을 나누러 오셨군요.</Subtext>

                <Form onSubmit={(e)=>{e.preventDefault();login(loginform,{redirectto:"/main"})}}>
                    <Inputcss
                        type="text"
                        name="username"
                        placeholder="이메일"
                        aria-label="이메일"
                        autoComplete="username"
                        value={loginform.username}
                        onChange={(e)=>Setloginform({...loginform,username:e.target.value})}
                    />
                    <Inputcss
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        aria-label="비밀번호"
                        autoComplete="current-password"
                        value={loginform.password}
                        onChange={(e)=>Setloginform({...loginform,password:e.target.value})}
                    />
                    <LoginButton type="submit" disabled={issending}>
                        {issending?"로그인 중...":"로그인"}
                    </LoginButton>
                </Form>

                <Divider>또는</Divider>

                <Authdiv>
                    <GoogleButton type="button" onClick={()=>oauthredirect("google")}>
                        <GoogleMark/> Google
                    </GoogleButton>
                    <NaverButton type="button" onClick={()=>oauthredirect("naver")}>
                        <NaverMark/> 네이버
                    </NaverButton>
                </Authdiv>

                {showresend &&
                <Resendbox>
                    <Resendtitle>인증메일 다시 받기</Resendtitle>
                    <Resendtext>가입하신 이메일을 입력하시면 새 인증 링크를 보내드립니다.</Resendtext>
                    <Resendrow>
                        <Resendinput
                            type="email"
                            value={resendemail}
                            placeholder="이메일"
                            aria-label="인증메일을 받을 이메일"
                            onChange={(e)=>setResendemail(e.target.value)}
                            onKeyDown={(e)=>{ if(e.key==="Enter") resend() }}
                        />
                        <Resendbutton type="button" onClick={resend} disabled={resending}>
                            {resending?"보내는 중...":"다시 받기"}
                        </Resendbutton>
                    </Resendrow>
                </Resendbox>}

                <Findformdiv>
                    <Subtag type="button" onClick={()=>navigate("/memberidfind")}>아이디 찾기</Subtag>
                    <Dot>·</Dot>
                    <Subtag type="button" onClick={()=>navigate("/memberpasswordfind")}>비밀번호 찾기</Subtag>
                </Findformdiv>

                <Bottomdiv>
                    <Guidetext>아직 계정이 없으신가요?</Guidetext>
                    <Navitag type="button" onClick={()=>navigate("/membercreate")}>회원가입</Navitag>
                </Bottomdiv>
            </Card>
        </Wrapper>
    )
}

export default Loginmain;
