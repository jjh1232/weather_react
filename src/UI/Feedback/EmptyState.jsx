import React from "react";
import styled, { keyframes } from "styled-components";

//=====================================================================
// 목록이 비었을 때 보여주는 공용 화면.
//
// 예전에는 각 목록이 "친구와채팅을 이용해보세요!" 같은 맨 텍스트를 뿌리거나
// (Chatroomlist), 아예 아무것도 안 그렸다(Followmenus 3종).
// 비어 있는 것과 로딩에 실패한 것이 구분되지 않아서 사용자는 고장인 줄 안다.
//
// 쓰는 법
//   <EmptyState variant="chat" title="아직 대화가 없어요"
//               desc="팔로우한 친구에게 먼저 말을 걸어보세요" />
//=====================================================================

//구름이 아주 천천히 떠다닌다. 앱 전체가 하늘 테마라 거기에 맞춘다.
const float = keyframes`
  0%   { transform: translateY(0)     }
  50%  { transform: translateY(-6px)  }
  100% { transform: translateY(0)     }
`;

const Wrap = styled.div`
  //부모가 flex 든 block 이든 가운데에 오도록 한다.
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  //목록 영역을 채워서 위쪽에 붙어 보이지 않게 한다.
  min-height: 220px;
  height: 100%;
  padding: 28px 20px;
  text-align: center;
  //마우스 이벤트를 먹지 않게 한다. 뒤에 버튼이 있어도 눌린다.
  user-select: none;
`;

const IconRing = styled.div`
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  //accentSoft 는 반투명이라 라이트/다크 어디서든 배경에 자연스럽게 앉는다.
  background: ${(props) => props.theme.accentSoft};
  animation: ${float} 4.5s ease-in-out infinite;

  svg {
    width: 34px;
    height: 34px;
    //선만 있는 아이콘이라 색은 stroke 로 준다.
    stroke: ${(props) => props.theme.accent};
    stroke-width: 1.6;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.85;
  }

  //움직임을 불편해하는 사용자 설정을 존중한다.
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.text};
`;

const Desc = styled.div`
  font-size: 12.5px;
  line-height: 1.6;
  color: ${(props) => props.theme.textMuted};
  max-width: 220px;
`;

//선 아이콘 모음. 외부 아이콘 라이브러리를 새로 들이지 않으려고 직접 그렸다.
const icons = {
  //말풍선 두 개
  chat: (
    <svg viewBox="0 0 24 24">
      <path d="M4 5.5h11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
      <path d="M19 9.5h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v2.5l-3-2.5h-3" />
    </svg>
  ),
  //사람 + 플러스
  follow: (
    <svg viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M18.5 8v6M15.5 11h6" />
    </svg>
  ),
  //사람 여럿
  follower: (
    <svg viewBox="0 0 24 24">
      <circle cx="8.5" cy="8" r="3.5" />
      <path d="M2 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 5.4a3.5 3.5 0 0 1 0 6.7M18 14.4c2.4.7 4 2.7 4 5.6" />
    </svg>
  ),
  //별
  favorite: (
    <svg viewBox="0 0 24 24">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
    </svg>
  ),
  //돋보기 (검색 결과 없음)
  search: (
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  ),
  //구름 (기본값)
  cloud: (
    <svg viewBox="0 0 24 24">
      <path d="M7 18h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6.6 9.4 3.8 3.8 0 0 0 7 18Z" />
    </svg>
  ),
};

function EmptyState({ variant = "cloud", title, desc }) {
  return (
    <Wrap>
      <IconRing>{icons[variant] || icons.cloud}</IconRing>
      {title && <Title>{title}</Title>}
      {desc && <Desc>{desc}</Desc>}
    </Wrap>
  );
}

export default EmptyState;
