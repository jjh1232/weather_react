import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages as imagesicon } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullheart } from "@fortawesome/free-solid-svg-icons";
import CreateAxios from "../../../customhook/CreateAxios";
import AuthCheck from "../../../customhook/authCheck";
import theme from "../../../UI/Manyim/Themecss";
import ImageListmodal from "../../Noticeimage/ImageListmodal";
import { useNavigate } from "react-router-dom";
import { faChartSimple as view } from "@fortawesome/free-solid-svg-icons";
import Viewtrans from "../DateCom/Viewtrans";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import profileimage, { detachimage } from "../../../UI/profileimage";
import { API_BASE } from "../../../config/api";


//====================================================================
// 이미지 타일. 예전에는 위쪽 50px 헤더에 닉네임과 제목을 같은 크기로
// 세로로 붙여놔서 어느 쪽이 제목인지 구분이 안 됐다.
// 이제 이미지가 타일 전체를 채우고, 그 위에
//   - 좌상단 반투명 칩  = 작성자 (부가정보)
//   - 하단 스크림 위    = 제목 (주인공)
// 두 층으로 나눠 얹는다. 서로 다른 레이어라 헷갈릴 여지가 없다.
//====================================================================
const Wrapper=styled.div`
    position: relative;
    width: 100%;
    /* 타일을 정사각형으로 고정해야 격자 리듬이 흐트러지지 않는다.
       (제목 길이에 따라 높이가 들쭉날쭉하던 문제) */
    aspect-ratio: 1 / 1;
    overflow: hidden;
    cursor: pointer;

    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surfaceAlt};
    transition: transform 0.18s ${(props)=>props.theme.ease},
                box-shadow 0.18s ${(props)=>props.theme.ease};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${(props)=>props.theme.shadowLg};
    }
    &:hover img {
        transform: scale(1.04);
    }
`
const MainImage=styled.img`
    width: 100%;
    height: 100%;
    /* fill 은 이미지를 늘려 찌그러뜨린다. cover 로 잘라서 비율을 지킨다. */
    object-fit: cover;
    display: block;
    transition: transform 0.35s ${(props)=>props.theme.ease};
`
// 상단 한 줄 바.
// 작은 알약 칩 대신 타일 폭 전체를 쓰는 한 줄로 둔다(트위터 타임라인의 작성자 줄처럼).
// 왼쪽에 작성자, 오른쪽에 이미지 장수가 한 줄에 나란히 앉는다.
const Topbar=styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;

    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 11px;

    /* 배경을 비우는 대신 blur 를 세게 걸어 어떤 이미지 위에서든 읽히게 한다 */
    background: rgba(0, 0, 0, 0.26);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    backdrop-filter: blur(12px) saturate(140%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.14);
    color: #fff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
`
// 아래쪽 그라데이션 - 제목/지표가 앉는 자리
const BottomScrim=styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 28px 10px 9px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: linear-gradient(
        0deg,
        rgba(0,0,0,0.80) 0%,
        rgba(0,0,0,0.45) 55%,
        transparent 100%
    );
`
const Profileimg=styled.img`
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    background-color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.35);
`
const Nicknamediv=styled.div`
    flex: 1;
    min-width: 0;
    font-size: 13px;
    font-weight: 650;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
// 제목 - 타일에서 가장 강한 텍스트
const Titlediv=styled.div`
    color: #ffffff;
    font-size: 13.5px;
    font-weight: 650;
    line-height: 1.35;
    letter-spacing: -0.02em;
    word-break: break-word;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);

    /* 긴 제목은 두 줄까지만 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`
const Metarow=styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.92);
    font-size: 12px;
    font-weight: 600;
`
const Imagenumdiv=styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    opacity: 0.92;
    transition: opacity ${(props)=>props.theme.transition};

    &:hover { opacity: 1; }
`
const Likebuttondiv=styled.div`
    display: flex;
    align-items: center;
    padding: 2px;
    transition: transform ${(props)=>props.theme.transition};

    &:hover { transform: scale(1.15); }
`
const Viewsdiv=styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`

export default function Imageformlist(props){
    //옵션과키워드는 쿼리리페치를위해
    const {content,option,keyword}=props;
    const [isPreview,setisPreview]=useState(false);
    let logincheck=AuthCheck();
   let axiosinstance=CreateAxios()
   const navigate=useNavigate();
   const queryclient=useQueryClient();

 const likemutation=useMutation({
     mutationFn:async (noticeid)=>{
         const res=await axiosinstance.post(`/noticelike/${noticeid}`);
 
         console.log("데이터여부:"+res.data);
         return res.data
     },onSuccess:(data,noticeid)=>{
         //쿼리키 데이터가져오기
        
         queryclient.setQueryData(["imgnoticelist",option,keyword],(oldData)=>{
             if(!oldData) return oldData;
             //좋아요관련 데이터업데이트
             return {
                 ...oldData,
                 //pages는 useinfinitequery의 여러페이지배열 
                 //page는 배열내한페이지에 해당하는데이터객체 
                 //content는 각페이지데이터객체안의실제아이템배열(서버응답구조에따라다름)
                 pages:oldData.pages.map(page=>({
                    ...page,
                    content:page.content.map(item=>
                        item.id===noticeid 
                        ?{...item,likeusercheck:data,likes:item.likes+(data ?1 :-1)}
                        :item
                    )
                 }))
           
             }
         })
     },onError:()=>{
         alert("잠시후다시시도해주세요")
     }
 })
    const Noticelikehandler=(noticeid)=>{
        if(logincheck){
             
            likemutation.mutate(noticeid)
            
        }else{
            alert("로그인후이용해주세요")
        }
    }

    return (
        <Wrapper onClick={()=>{navigate(`/notice/detail/${content.id}`)}}>

            {content.blockcheck
            ? <MainImage src={process.env.PUBLIC_URL+"/front/Subimages/chdan.png"}/>
            : <MainImage src={detachimage(content.mainimage)}/>}

            {/* 작성자 + 이미지 장수를 한 줄에 */}
            <Topbar>
                <Profileimg src={profileimage(content.userprofile)}/>
                <Nicknamediv>{content.nickname}</Nicknamediv>

                {!content.blockcheck &&
                <Imagenumdiv onClick={(e)=>{
                        //타일 전체가 상세로 이동하므로 여기서 전파를 끊는다
                        e.stopPropagation();
                        setisPreview(true)
                }}>
                    {isPreview&&<ImageListmodal noticeid={content.id} ispreview={setisPreview}/>}

                    <FontAwesomeIcon icon={imagesicon} /> {content.imagenum}
                </Imagenumdiv>}
            </Topbar>

            <BottomScrim>
                <Titlediv>{content.title}</Titlediv>

                <Metarow>
                    <Viewsdiv>
                        <FontAwesomeIcon icon={view}/>
                        {Viewtrans(content.views)}
                    </Viewsdiv>

                    <Likebuttondiv onClick={(e)=>{
                        e.stopPropagation();
                        Noticelikehandler(content.id)}}>
                        <FontAwesomeIcon
                            icon={content.likely?fullheart:heart}
                            size="lg"
                            color={content.likely?"#ff5c8a":"#ffffff"}
                        />
                    </Likebuttondiv>
                </Metarow>
            </BottomScrim>

        </Wrapper>
    )

}
