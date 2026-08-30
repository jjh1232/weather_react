import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CreateAxios from "./CreateAxios";
import { useConfirm, useToast } from "../UI/Feedback/FeedbackProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../admin/AdminUI";
import { Modalout, Modalin, Head, Headtitle, Headsub, Closebutton, Emptybox }
    from "../admin/AdminModal";
import profileimage from "../UI/profileimage";
import { API_BASE } from "../config/api";

//=====================================================================
// 게시글 첨부 이미지 보기(관리자). 여기서 이미지 차단/해제를 한다.
//
// 예전엔 큰 이미지가 width:1280px; height:780px; top:10%; right:30% 에
// border:10px solid green 까지 붙은 채 고정이었다. 화면이 그보다 좁으면
// 잘리고, 사이드바는 float:right + width:20% 라 따로 놀았다.
// 구분선도 "======유저정보======" 처럼 등호 문자열이었다.
//=====================================================================

const BANIMAGE="/front/Subimages/chdan.png";
const isbanned=(path)=>typeof path==="string"&&path.startsWith(BANIMAGE);

//뷰어 + 사이드 2단
const Split=styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    flex: 1;
    min-height: 0;

    @media (max-width: 900px) {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr) auto;
    }
`
const Viewer=styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    min-height: 0;
    padding: 14px;
    background: ${(props)=>props.theme.mode==="dark"?"#0b0f14":"#101418"};
`
//큰 이미지 - 남는 자리에 맞춰 들어간다
const Bigimage=styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: ${(props)=>props.theme.radiusSm};
`
const Navbutton=styled.button`
    position: absolute;
    ${(props)=>props.$side}: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition};

    &:hover{ background: rgba(0, 0, 0, 0.7); }
`
//현재 몇 장째인지
const Counter=styled.div`
    position: absolute;
    left: 50%;
    bottom: 12px;
    transform: translateX(-50%);
    padding: 3px 11px;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 11.5px;
    font-weight: 600;
`
const Bannedmark=styled.div`
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 3px 10px;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: rgba(255, 82, 82, 0.9);
    color: #fff;
    font-size: 11.5px;
    font-weight: 700;
`

const Side=styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-left: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surface};

    @media (max-width: 900px) {
        border-left: none;
        border-top: 1px solid ${(props)=>props.theme.border};
    }
`
const Writer=styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Avatar=styled.img`
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Writermeta=styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
`
const Writername=styled.span`
    font-size: 12.5px;
    font-weight: 700;
`
const Writersub=styled.span`
    font-size: 11px;
    color: ${(props)=>props.theme.textFaint};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Noticemeta=styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 10px 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    font-size: 11.5px;
    color: ${(props)=>props.theme.textMuted};

    b{ color: ${(props)=>props.theme.text}; font-weight: 700; }
`
const Sidebar2=styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Sidetitle=styled.span`
    font-size: 12px;
    font-weight: 700;
`
const Thumbs=styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    padding: 10px 14px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;

    @media (max-width: 900px) {
        max-height: 190px;
    }
`
const Thumbbox=styled.label`
    position: relative;
    display: block;
    aspect-ratio: 1 / 1;
    border-radius: ${(props)=>props.theme.radiusSm};
    overflow: hidden;
    cursor: pointer;
    border: 2px solid ${(props)=>props.$on
        ? props.theme.accent
        : "transparent"};
    outline: 1px solid ${(props)=>props.theme.border};
    outline-offset: -1px;
`
const Thumbimg=styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: ${(props)=>props.$dim?.45:1};
`
const Thumbcheck=styled.input`
    position: absolute;
    top: 4px;
    left: 4px;
    margin: 0;
    accent-color: ${(props)=>props.theme.accent};
    cursor: pointer;
`
const Thumbbanned=styled.span`
    position: absolute;
    bottom: 3px;
    left: 3px;
    right: 3px;
    text-align: center;
    padding: 1px 0;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: rgba(255, 82, 82, 0.85);
    color: #fff;
    font-size: 9.5px;
    font-weight: 700;
`
const Sidefoot=styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px 14px;
    border-top: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`

export default function Imagebook(props){
    const {images,setisimage,userdata,noticedata}=props;
    const [activeindex,setActiveindex]=useState(0);
    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();
    const confirm=useConfirm();
    const toast=useToast();
    const [checkboxdata,setCheckboxdata]=useState([]);
    //단체수정
    const [isupdate,setIsupdate]=useState(false)

    const list=images||[];
    const current=list[activeindex];

    const close=()=>setisimage(false);

    const nextslide=()=>{
        if(activeindex<list.length-1) setActiveindex(activeindex+1);
    }
    const prevslide=()=>{
        if(activeindex>0) setActiveindex(activeindex-1);
    }

    //좌우 화살표로 넘기고 Esc 로 닫는다
    useEffect(()=>{
        const onkey=(e)=>{
            if(e.key==="Escape") close();
            if(e.key==="ArrowRight") nextslide();
            if(e.key==="ArrowLeft") prevslide();
        }
        document.addEventListener("keydown",onkey)
        return ()=>document.removeEventListener("keydown",onkey)
    },[activeindex,list.length])

    //단일이미지벤
    const imageban=useMutation({
        mutationFn:(detachid)=>{
            return axiosinstance.put(`/admin/imageban/${detachid}`)
        },
        onSuccess:()=>{
            toast.success("차단되었습니다.")
            queryclient.invalidateQueries({ queryKey: [`noticeData`] })
        },
        onError:(err)=>{ toast.error(err) }
    })
    //차단 해제
    const imagerestore=useMutation({
        mutationFn:(detachid)=>{
            return axiosinstance.put(`/admin/imagerestore/${detachid}`)
        },
        onSuccess:()=>{
            toast.success("차단을 해제했습니다.")
            queryclient.invalidateQueries({ queryKey: [`noticeData`] })
        },
        //원본 정보가 없는 옛날 차단 건은 서버가 사유를 알려준다
        onError:(err)=>{ toast.error(err) }
    })
    //이미지벤다수
    const manyimageban=useMutation({
        mutationFn:(data)=>{
            return axiosinstance.put(`/admin/manyimageban`,{detachids:data})
        },
        onSuccess:()=>{
            toast.success("선택한 이미지를 차단했습니다.")
            queryclient.invalidateQueries({ queryKey: [`noticeData`] })
            setIsupdate(false)
            setCheckboxdata([])
        },
        onError:(err)=>{ toast.error(err) }
    })

    const imagebanhandler=async(data)=>{
        const ok=await confirm({
            title:"이 이미지를 차단할까요?",
            description:"원본 대신 차단 안내 이미지가 보이게 됩니다. 글 본문에도 바로 반영됩니다.",
            confirmText:"차단",
            danger:true,
        })
        if(ok) imageban.mutate(data.id)
    }
    const imagerestorehandler=async(data)=>{
        const ok=await confirm({
            title:"차단을 해제할까요?",
            description:"원래 이미지가 다시 보이게 됩니다.",
            confirmText:"해제",
        })
        if(ok) imagerestore.mutate(data.id)
    }
    const manyimagebanhandler=async(data)=>{
        if(!data||data.length===0){
            toast.info("차단할 이미지를 먼저 선택해주세요.")
            return;
        }
        const ok=await confirm({
            title:`선택한 ${data.length}장을 차단할까요?`,
            description:"원본 대신 차단 안내 이미지가 보이게 됩니다. 글 본문에도 바로 반영됩니다.",
            confirmText:"차단",
            danger:true,
        })
        if(ok) manyimageban.mutate(data)
    }

    const Checkhandler=(checked,id)=>{
        if(checked){
            setCheckboxdata([...checkboxdata,id])
        }else{
            /* 담기는 건 e.target.value 라 "문자열 id" 다. 예전엔 item.id 로
               비교해서(문자열엔 .id 가 없다) 체크를 풀어도 안 빠졌다. */
            setCheckboxdata(checkboxdata.filter(item=>item !==id));
        }
    }

    return (
        <Modalout onMouseDown={close}>
        <Modalin $size="full" onMouseDown={(e)=>e.stopPropagation()}>

            <Head>
                <Headtitle>첨부 이미지</Headtitle>
                <Headsub>{list.length}장</Headsub>
                <Closebutton type="button" onClick={close} title="닫기(Esc)">×</Closebutton>
            </Head>

            {list.length===0
                ? <Emptybox>첨부된 이미지가 없습니다.</Emptybox>
                : <Split>
                    <Viewer>
                        {activeindex>0 &&
                            <Navbutton type="button" $side="left" onClick={prevslide}
                                title="이전 이미지(←)">
                                <FontAwesomeIcon icon={faChevronLeft}/>
                            </Navbutton>}

                        {current && <Bigimage src={API_BASE+current.path} alt=""/>}
                        {current && isbanned(current.path) && <Bannedmark>차단됨</Bannedmark>}

                        {activeindex<list.length-1 &&
                            <Navbutton type="button" $side="right" onClick={nextslide}
                                title="다음 이미지(→)">
                                <FontAwesomeIcon icon={faChevronRight}/>
                            </Navbutton>}

                        <Counter>{activeindex+1} / {list.length}</Counter>
                    </Viewer>

                    <Side>
                        <Writer>
                            <Avatar src={profileimage(userdata.profileimg)} alt=""/>
                            <Writermeta>
                                <Writername>{userdata.nickname||userdata.username}</Writername>
                                <Writersub>{userdata.username}</Writersub>
                            </Writermeta>
                        </Writer>

                        <Noticemeta>
                            <span><b>{noticedata.title}</b></span>
                            <span>좋아요 {noticedata.likes} · {noticedata.red}</span>
                        </Noticemeta>

                        <Sidebar2>
                            <Sidetitle>이미지 목록</Sidetitle>
                            {isupdate &&
                                <Headsub style={{marginLeft:"auto"}}>{checkboxdata.length}장 선택</Headsub>}
                        </Sidebar2>

                        <Thumbs>
                            {list.map((data,key)=>{
                                const banned=isbanned(data.path);
                                return (
                                    <Thumbbox key={data.id??key} $on={activeindex===key}
                                        onClick={()=>{ if(!isupdate) setActiveindex(key) }}>
                                        {isupdate &&
                                            <Thumbcheck type="checkbox" value={data.id}
                                                checked={checkboxdata.includes(String(data.id))}
                                                onChange={(e)=>{Checkhandler(e.target.checked,e.target.value)}}
                                                onClick={(e)=>e.stopPropagation()}/>}
                                        <Thumbimg src={API_BASE+data.path} $dim={banned} alt=""/>
                                        {banned && <Thumbbanned>차단됨</Thumbbanned>}
                                    </Thumbbox>
                                )
                            })}
                        </Thumbs>

                        <Sidefoot>
                            {isupdate
                                ? <>
                                    <Button type="button" $small $variant="danger"
                                        onClick={()=>{manyimagebanhandler(checkboxdata)}}>선택 차단</Button>
                                    <Button type="button" $small
                                        onClick={()=>{setIsupdate(false); setCheckboxdata([])}}>선택 취소</Button>
                                  </>
                                : <>
                                    {current && (isbanned(current.path)
                                        ? <Button type="button" $small
                                            onClick={()=>{imagerestorehandler(current)}}>차단해제</Button>
                                        : <Button type="button" $small $variant="danger"
                                            onClick={()=>{imagebanhandler(current)}}>이 이미지 차단</Button>)}
                                    <Button type="button" $small
                                        onClick={()=>{setIsupdate(true)}}>여러 장 선택</Button>
                                  </>}
                        </Sidefoot>
                    </Side>
                  </Split>}

        </Modalin>
        </Modalout>
    )
}
