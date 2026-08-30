import styled, { keyframes } from "styled-components";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthCheck from "../../customhook/authCheck";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import ImageListitem from "./ImageListitem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX as close } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import ReactDom from "react-dom";

//=====================================================================
// 게시글 이미지 미리보기
//  - 색·굴곡은 전부 테마 토큰. 예전에는 파란 테두리와 검은 X 가 박혀 있었다.
//  - 타일 안에서 렌더하면 안 보인다(아래 포털 주석 참고).
//=====================================================================

const fadein = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const popin = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

const Modalout=styled.div`
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    /* 예전엔 흰색 30% 라 뒤가 뿌옇게 밝아지기만 했다. 어둡게 깔아야 앞이 떠 보인다. */
    background: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    animation: ${fadein} 140ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Modalin=styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(880px, 100%);
    max-height: min(760px, 88vh);
    overflow: hidden;
    background: ${(props)=>props.theme.surface};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};
    animation: ${popin} 180ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Header=styled.div`
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 16px 14px 20px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Title=styled.h3`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
`
//몇 장인지 옆에 조용히 붙인다. 제목에 "57번글" 같은 내부 번호를 넣지 않는다.
const Countchip=styled.span`
    font-size: 12px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.accentSoft};
    color: ${(props)=>props.theme.accent};
`
const CloseButton=styled.button`
    margin-left: auto;
    flex: none;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: none;
    color: ${(props)=>props.theme.textFaint};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 1px;
    }
`
const MainListWrapper=styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 18px;
`
//장수에 따라 칸이 알아서 늘어난다. 예전에는 200px 고정이라 여백이 들쭉날쭉했다.
const MainList=styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 10px;
`
const Emptybox=styled.div`
    padding: 48px 16px;
    text-align: center;
    font-size: 14px;
    color: ${(props)=>props.theme.textMuted};
`

export default function ImageListmodal(props){

    const axiosinstance=AuthCheck()? CreateAxios():axios;
    const modalRef=useRef(null);

    useEffect(()=>{
      //시작시 외부 스크롤없애기
   document.body.style.cssText=`overflow:hidden;`;


    return ()=>{
       document.body.style.cssText=` overflow:auto; `;
      }
      },[])

      //외부클릭시닫히게
      useEffect(()=>{

        document.addEventListener("mousedown",Clickhandler);
        return ()=>{
          document.removeEventListener("mousedown",Clickhandler);
        }
      },[])

      const Clickhandler=(e)=>{
             if(modalRef.current && !modalRef.current.contains(e.target)){
          props.ispreview(false);
        }

      }

      //Esc 로도 닫힌다.
      useEffect(()=>{
        const onkey=(e)=>{ if(e.key==="Escape"){ e.stopPropagation(); props.ispreview(false); } }
        window.addEventListener("keydown",onkey);
        return ()=>window.removeEventListener("keydown",onkey);
      },[])

    const {data:imagedata,isSuccess,isLoading,error}=useQuery({
        queryKey:["imagepreview",props.noticeid],
        queryFn:async ()=>{
            const res=await axiosinstance.get(`/open/noticeimagepreview/${props.noticeid}`)

            console.log("이미지리스트",res.data);
            return res.data;
        }


    })

    //타일(Wrapper)에 hover transform 이 걸려 있어서, 그 안에서 렌더하면
    //position:fixed 가 화면이 아니라 "타일" 기준이 된다(transform 은 fixed 의 기준을 만든다).
    //게다가 타일은 overflow:hidden 이라 모달이 통째로 잘려 안 보였다.
    //앱 레이아웃 밖(#modal-root)에 그려서 그 영향을 벗어난다.
    const portaltarget=document.getElementById("modal-root")||document.body;

    return ReactDom.createPortal(
        <Modalout onMouseDown={(e)=>e.stopPropagation()}>
            <Modalin ref={modalRef} role="dialog" aria-modal="true" aria-label="이미지 미리보기">

            <Header>
                <Title>이미지 미리보기</Title>
                {imagedata&&imagedata.length>0 && <Countchip>{imagedata.length}장</Countchip>}
                <CloseButton type="button" aria-label="닫기"
                  onClick={(e)=>{e.stopPropagation(); props.ispreview(false)}}>
                  <FontAwesomeIcon icon={close}/>
                </CloseButton>
            </Header>

            <MainListWrapper>
              {isLoading && <Emptybox>불러오는 중...</Emptybox>}
              {error && <Emptybox>이미지를 불러오지 못했습니다.</Emptybox>}
              {isSuccess && imagedata.length===0 && <Emptybox>첨부된 이미지가 없습니다.</Emptybox>}

              {imagedata&&imagedata.length>0 &&
              <MainList>
                {imagedata.map((data)=>{
                    return (
                        <ImageListitem data={data} key={data.id}/>
                    )
                })}
              </MainList>}
            </MainListWrapper>

            </Modalin>
        </Modalout>
    , portaltarget)
}
