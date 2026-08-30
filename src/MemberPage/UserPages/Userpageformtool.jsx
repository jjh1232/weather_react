import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";

/* 유저페이지 탭.
   검색은 Userpagesearch 로 떼어내 프로필 헤더 줄로 올렸고,
   여기는 탭만 남아 한 줄을 다 쓴다. */

const MenuDiv=styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${(props)=>props.theme.border};
`
const ActiveLink=styled(NavLink)`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 5px;

  font-size: 15px;
  font-weight: ${(props)=>props.Active?750:600};
  letter-spacing: -0.02em;
  color: ${(props)=>props.Active?props.theme.text:props.theme.textMuted};
  cursor: pointer;
  transition: background ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition};

  &:hover{
    background: ${(props)=>props.theme.surfaceHover};
    color: ${(props)=>props.theme.text};
  }

  /* 활성 탭 밑줄 - 예전엔 회색 배경만 깔려서 어디가 켜졌는지 잘 안 보였다 */
  &::after{
    content: "";
    position: absolute;
    left: 50%;
    bottom: -1px;
    transform: translateX(-50%);
    width: ${(props)=>props.Active?"56px":"0px"};
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: ${(props)=>props.theme.accent};
    transition: width ${(props)=>props.theme.transition};
  }
`

export default function Userpageformtool({profileid}){
  const location=useLocation();

  const isPostsActive     = location.pathname === `/userpage/${profileid}`;
  const isPhotoActive     = location.pathname === `/userpage/${profileid}/photo`;
  const isHighlightActive = location.pathname === `/userpage/${profileid}/highlight`;

  return (
    <MenuDiv>
      <ActiveLink to={`/userpage/${profileid}`} Active={isPostsActive} end>
        Posts
      </ActiveLink>
      <ActiveLink to={`/userpage/${profileid}/photo`} Active={isPhotoActive}>
        Image
      </ActiveLink>
      {/* 좋아요 많은 순으로 정렬된 인기글 */}
      <ActiveLink to={`/userpage/${profileid}/highlight`} Active={isHighlightActive}>
        Highlight
      </ActiveLink>
    </MenuDiv>
  );
}
