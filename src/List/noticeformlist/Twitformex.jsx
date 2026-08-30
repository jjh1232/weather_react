import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Twitformlist from "./Twitformlist";

import axios from "axios";
import Searchtool from "../../UI/Noticetools/Searchtool";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Noticeformbutton from "../../Noticepage/NoticePattern/Noticeformbutton";
import Noticecreate from "../../Noticepage/Noticecreate"
import Twitnoticecreate from "./Twitnoticecreate";
import CreateAxios from "../../customhook/CreateAxios";
import AuthCheck from "../../customhook/authCheck";


const Wrapper=styled.div`
position: relative;

width:100%;
height:100%;

 color:${props => props.theme.text};
 /* 배경은 바깥 MainCss 패널(유리 효과)이 갖는다 */
 background: transparent;
 /* top:8% 는 예전 고정 레이아웃을 맞추려던 보정값. grid 로 바뀐 뒤엔
    내용만 아래로 밀려 패널 아래가 잘린다. */
 
 

`
/* 예전엔 top/left 없이 position:fixed + 45%x85% 라, 오버레이가 화면을 다 덮지도
   못하고 시트가 흐름상의 위치(화면 한참 아래)에 걸려 있었다. */
const Modalout=styled.div`
position: fixed;
inset: 0;
padding: 20px;
background:${props => props.theme.overlay};
-webkit-backdrop-filter: blur(2px);
backdrop-filter: blur(2px);
display:flex;
justify-content:center;//가로 중앙
align-items:center; //세로 중앙
z-index: 100;
`

const Modalin=styled.div`
position: relative;
padding: 20px;
width: min(92vw, 780px);
max-height: 86vh;
overflow-y: auto;
background-color: ${props => props.theme.surface};
color: ${props => props.theme.text};
border: 1px solid ${props => props.theme.border};
border-radius: ${props => props.theme.radiusLg};
box-shadow: ${props => props.theme.shadowLg};
`
// 모달 닫기 버튼
const Modalclose=styled.button`
    float: right;
    height: 30px;
    padding: 0 12px;
    border: 1px solid ${props => props.theme.border};
    border-radius: ${props => props.theme.radiusPill};
    background: ${props => props.theme.surfaceAlt};
    color: ${props => props.theme.textMuted};
    font-size: 13px;
    font-weight: 600;
    transition: background ${props => props.theme.transition},
                color ${props => props.theme.transition};

    &:hover {
        background: ${props => props.theme.surfaceHover};
        color: ${props => props.theme.text};
    }
`
//헤더
const Headerdiv=styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 16px;
    border-bottom: 1px solid ${props => props.theme.border};
`
const Creatediv=styled.div`
    flex-shrink: 0;
`
const CreateButton=styled.button`
  display: inline-flex;
  align-items: center;
  outline: none;
  border: none;
  border-radius: ${props => props.theme.radiusPill};
  white-space: nowrap;
  color: #fff;
  font-weight: 650;
  cursor: pointer;
  padding: 0 18px;
  height: 2.25rem;
  font-size: 0.9rem;
  letter-spacing: -0.01em;
  background: ${props => props.theme.accent};
  box-shadow: 0 2px 8px ${props => props.theme.accentSoft};
  transition: background ${props => props.theme.transition},
              box-shadow ${props => props.theme.transition},
              transform ${props => props.theme.transition};

  &:hover {
    background: ${props => props.theme.accentHover};
    box-shadow: 0 6px 16px ${props => props.theme.accentSoft};
  }
  &:active {
    background: ${props => props.theme.accentActive};
    transform: translateY(1px);
  }
`
//탭이 헤더로 올라가면서 이 줄에는 글작성 버튼과 검색만 남았다.
//flex:1 로 두면 검색창이 남는 폭을 전부 먹어 한없이 길어진다.
//오른쪽에 붙이고 폭에 상한을 둔다.
const Searchdiv=styled.div`
     margin-left: auto;
     width: min(360px, 100%);
     min-width: 0;

     /* 좁은 화면에서는 원래대로 남는 폭을 쓴다 */
     @media (max-width: 620px) {
       margin-left: 0;
       width: auto;
       flex: 1;
     }
`
//탭(전체/팔로잉/좋아요/사진)은 데스크톱에서는 헤더 가운데 패널로 올라간다.
//헤더의 가운데 패널이 620px 이하에서 숨겨지기 때문에, 좁은 화면에서는 여기 것만 보인다.
//경로가 곧 상태(useLocation)라 두 군데에 그려도 어긋날 일이 없다.
const Formdiv=styled.div`
     flex: 1 0 100%;   /* 모바일에서는 한 줄을 통째로 쓴다 */
     order: 3;

     @media (min-width: 621px) {
       display: none;
     }
`
const Maindatadiv=styled.div`
   
`

export default function Twitformex(props){
    //const {posts,onClickItem,noticecreate,querydatas
        //로케이션으로 좋아요 와 일반게시글차이만들자
     
   
       // const axiosinstance=CreateAxios();

      

       const [iscreate,setIscreate]=useState(false)
       //글 목록 state 는 Outlet 자식(Twitformver)이 갖고 있어서 여기서 직접 못 비운다.
       //이 숫자를 올려주면 자식이 그걸 신호로 목록을 처음부터 다시 받는다.
       const [refreshkey,setRefreshkey]=useState(0)
       let logincheck=AuthCheck();

       //글 작성 성공 - 모달을 닫고 목록 새로고침을 요청한다(페이지 리로드 없이)
       const noticerefresh=()=>{
            setIscreate(false)
            setRefreshkey((prev)=>prev+1)
       }
       const createnoticeon=()=>{

            if(logincheck){
                setIscreate(true)
            }
            else {
                alert("로그인후이용해주세요!")
            }
       }

       //==============렌더링!==============================================================
       return (
        <>
       
        
       
        <Wrapper>
        <Headerdiv>
        
            <Creatediv>
        <CreateButton onClick={()=>{
            createnoticeon();
        }}> 글작성하기 </CreateButton>
        </Creatediv>
       
       <Formdiv>
        <Noticeformbutton/>
    </Formdiv>
        
        <Searchdiv>
            <Searchtool/>   
        
         </Searchdiv>
 
</Headerdiv>

        {iscreate &&<Modalout>

        <Modalin><Modalclose onClick={()=>{setIscreate(false)}}>닫기</Modalclose>
        <Twitnoticecreate setIscreate={setIscreate} redataget={noticerefresh}/>
        </Modalin>
        
        </Modalout>}
       
            

        <Maindatadiv>
            <Outlet context={{refreshkey}}/>
         </Maindatadiv>   
            
            
        
            
      
        </Wrapper>
        </>
    )
}
