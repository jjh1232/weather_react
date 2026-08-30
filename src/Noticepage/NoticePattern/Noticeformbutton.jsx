import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AuthCheck from "../../customhook/authCheck";
import { useToast } from "../../UI/Feedback/FeedbackProvider";

const Buttonlist=styled.div`
width: 100%;
display: flex;
align-items: center;
gap: 4px;
padding: 3px;
border: 1px solid ${(props)=>props.theme.border};
border-radius: ${(props)=>props.theme.radiusPill};
background: ${(props)=>props.theme.surfaceAlt};
`
// 세그먼트 탭 형태의 필터 버튼
// 지금 보고 있는 탭은 흰 알약이 올라온 것처럼 띄운다(iOS 세그먼트 컨트롤과 같은 방식).
// 예전에는 :active 뿐이라 "누르는 순간"에만 색이 변하고,
// 정작 어느 목록을 보고 있는지는 화면 어디에도 표시되지 않았다.
const CreateButton=styled.div`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  border-radius: ${(props)=>props.theme.radiusPill};
  white-space: nowrap;
  color: ${(props)=>props.$active?props.theme.accent:props.theme.textMuted};
  background: ${(props)=>props.$active?props.theme.surface:"transparent"};
  box-shadow: ${(props)=>props.$active?props.theme.shadowSm:"none"};
  font-weight: ${(props)=>props.$active?700:600};
  font-size: 0.85rem;
  letter-spacing: -0.01em;
  cursor: pointer;
  padding: 0 12px;
  /* 컨테이너 패딩(3px*2)+테두리(1px*2)를 더해 정확히 36px 이 되게 한다.
     글작성하기 버튼과 검색 컨트롤도 36px 이다. */
  height: 28px;
  user-select: none;

  transition: background ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition};

  &:hover {
   color: ${(props)=>props.$active?props.theme.accent:props.theme.text};
   background: ${(props)=>props.$active?props.theme.surface:props.theme.surfaceHover};
  }
  &:active {
    color: ${(props)=>props.theme.accent};
    background: ${(props)=>props.$active?props.theme.surface:props.theme.accentSoft};
  }
`
export default function Noticeformbutton(){

    const navigate=useNavigate();
    const location=useLocation();
    const toast=useToast();
    let islogin=AuthCheck();

    //메인 타임라인은 /main, / 로도 들어올 수 있다(Twitformver 가 그렇게 분기한다).
        const path=location.pathname;
    const isliked=path==="/notice/twitform/liked";
    const isfollowing=path==="/notice/twitform/following";
    const isimage=path.startsWith("/notice/imgform");
    const isnormal=!isliked&&!isimage&&!isfollowing;

        const Likebuttonhandler=()=>{

        if(islogin){
          navigate(`/notice/twitform/liked`)

        }
        else{
          toast.info("로그인하면 좋아요한 글을 모아볼 수 있습니다.")
        }
    }

    //팔로잉은 "내가 팔로우한 사람" 목록이 있어야 성립한다. 비로그인은 막는다.
    const Followingbuttonhandler=()=>{
        if(islogin){
          navigate(`/notice/twitform/following`)
        }
        else{
          toast.info("로그인하면 팔로우한 사람들의 글만 모아볼 수 있습니다.")
        }
    }

    return (
        
                <Buttonlist role="tablist">

            <CreateButton role="tab" aria-selected={isnormal} $active={isnormal}
            onClick={()=>{navigate(`/notice/twitform`)}}>
                전체
            </CreateButton >
            <CreateButton role="tab" aria-selected={isfollowing} $active={isfollowing}
            onClick={()=>{ Followingbuttonhandler(); }}>
                팔로잉
            </CreateButton >
            <CreateButton role="tab" aria-selected={isliked} $active={isliked}
            onClick={()=>{ Likebuttonhandler(); }}>
                좋아요
            </CreateButton >
             <CreateButton role="tab" aria-selected={isimage} $active={isimage}
             onClick={()=>{navigate("/notice/imgform")}}>
                사진
            </CreateButton >
            </Buttonlist>
        
    )

}