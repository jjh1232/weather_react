import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateAxios from "../../../customhook/CreateAxios";
import Adminnoticeupdatedetail from "./noticedetail/Adminnoticeupdatedetail";
import Adminnoticecomment from "./noticedetail/Adminnoticecomment";
import Commentform from "../../../Noticepage/Commentform";
import styled from "styled-components";
import { Page, Pagehead, Pagetitle, Pagemeta, Headright, Panel, Button, Badge }
    from "../../AdminUI";
import { useConfirm, useToast } from "../../../UI/Feedback/FeedbackProvider";
import UserMenu from "../../UserMenu";
import profileimage, { detachimage } from "../../../UI/profileimage";
import { API_BASE } from "../../../config/api";

//=====================================================================
// 관리자 게시글 상세.
//
// 예전엔 본문 카드 안에서 프로필이 bottom:125%, 닉네임이 bottom:50%,
// 이메일이 bottom:160% 로 서로를 밀어내고 있어서 글자가 겹쳐 찍혔다.
// 첨부 이미지 패널은 position:fixed 로 화면에 붙어 본문 위를 덮었고,
// 수정/삭제 버튼은 스타일이 없어 페이지 폭을 가로지르는 회색 띠였다.
// 좌표를 걷어내고 본문 / 첨부 두 칸짜리 grid 로 다시 짰다.
//=====================================================================

/* 넓으면 [본문+댓글] + [첨부] 를 좌우로, 좁으면 첨부가 아래로 내려간다.
   댓글을 이 그리드 밖에 두면 페이지 폭을 통째로 써서 본문보다 훨씬 넓어진다.
   본문과 같은 칸에 넣어 폭을 맞춘다. */
const Columns=styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 14px;
    align-items: start;

    @media (max-width: 1100px) {
        grid-template-columns: minmax(0, 1fr);
    }
`
//본문 + 댓글이 들어가는 왼쪽 칸
const Maincol=styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;
`
const Article=styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
`
const Articlehead=styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 18px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Titleline=styled.div`
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
`
const Articletitle=styled.h3`
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
    word-break: break-word;
    min-width: 0;
`
//글쓴이 줄
const Writer=styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
`
const Avatar=styled.img`
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Writername=styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
`
const Nickname=styled.span`
    font-size: 13.5px;
    font-weight: 700;
`
const Email=styled.span`
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
//날씨는 값마다 알약으로 끊어 읽기 쉽게
const Weatherrow=styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-left: auto;
`
const Weatherchip=styled.span`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 22px;
    padding: 0 9px;
    border-radius: ${(props)=>props.theme.radiusPill};
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
    font-size: 11.5px;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;

    b{ color: ${(props)=>props.theme.text}; font-weight: 700; }
`
//본문. 사용자가 넣은 HTML 이 그대로 들어오므로 여기서 제어한다.
const Articlebody=styled.div`
    padding: 18px;
    font-size: 14px;
    line-height: 1.75;
    word-break: break-word;

    /* 원본 크기 그대로 들어와 카드를 뚫고 나가던 걸 막는다 */
    img{
        max-width: 100%;
        height: auto;
        display: block;
        margin: 10px 0;
        border-radius: ${(props)=>props.theme.radiusSm};
    }
    p{ margin: 0 0 8px; }
`
const Articlefoot=styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 18px;
    border-top: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`

/* 첨부 이미지 패널.
   댓글까지 왼쪽 칸에 들어가면서 페이지가 길어졌다. 첨부칸도 화면 높이만큼
   늘려서 아래로 쭉 훑을 수 있게 하고, 스크롤을 내려도 따라오도록 sticky 로 둔다. */
const Sidepanel=styled(Panel)`
    display: flex;
    flex-direction: column;
    min-width: 0;

    position: sticky;
    top: 16px;
    max-height: calc(100vh - 32px);

    /* 한 칸으로 접히는 좁은 화면에서는 따라다닐 필요가 없다 */
    @media (max-width: 1100px) {
        position: static;
        max-height: none;
    }
`
const Sidehead=styled.div`
    padding: 12px 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    font-size: 13px;
    font-weight: 700;
`
const Sidebody=styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
    padding: 12px;
    /* 패널이 가진 높이를 끝까지 쓰고, 넘치면 여기서만 스크롤 */
    flex: 1;
    min-height: 0;
    overflow-y: auto;

    @media (max-width: 1100px) {
        max-height: 420px;
    }
`
const Detachitem=styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
`
const Detachimg=styled.img`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: ${(props)=>props.theme.radiusSm};
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Detachname=styled.span`
    font-size: 11px;
    color: ${(props)=>props.theme.textMuted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Sideempty=styled.div`
    padding: 28px 12px;
    text-align: center;
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
`

//댓글 영역
const Commentsection=styled(Panel)`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 18px;
`
const Commenthead=styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    font-weight: 700;
`
const Commentlist=styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`
const Statebox=styled.div`
    padding: 40px 16px;
    text-align: center;
    font-size: 13px;
    color: ${(props)=>props.theme.textMuted};
`

export default function Adminnoticedetail(props){
    const {noticeid}=useParams();
    const axiosinstance=CreateAxios();
    const [isupdate,setIsupdate]=useState(false);
    const navigate=useNavigate();
    const queryClient=useQueryClient();
    const confirm=useConfirm();
    const toast=useToast();

    const mutation=useMutation({
        mutationFn:(data)=>{
            return axiosinstance.delete(`/admin/notice/${data.id}/delete`)
        },
        onSuccess(){
            toast.success("게시글을 삭제했습니다.")
            navigate("/admin/notice")
        },
        onError:(err)=>{ toast.error(err) }
    })

    const deletenotice=async(num)=>{
        const ok=await confirm({
            title:"이 게시글을 삭제할까요?",
            description:"글에 달린 댓글도 함께 사라집니다. 되돌릴 수 없습니다.",
            confirmText:"삭제",
            danger:true,
        })
        if(ok) mutation.mutate({id:num})
    }

    /* 댓글 작성은 Commentform 이 스스로 POST 한다.
       예전엔 여기서 commentcreate 뮤테이션을 만들어 commentsubmit 으로
       넘겼는데, Commentform 은 그 prop 을 더 이상 받지 않는다
       (props 는 noticenum/depth/cnum/page/setPage/onCreated 뿐).
       그래서 이 화면의 댓글 등록 배선은 통째로 죽어 있었고,
       댓글이 달려도 목록이 갱신되지 않았다.
       실제로 불러주는 onCreated 로 붙인다. */
    const oncommentcreated=()=>{
        queryClient.invalidateQueries({queryKey:[`noticeData`]})
    }

    //데이터가져오기
    const {isLoading,error,data}=useQuery({
        queryKey:[`noticeData`],
        queryFn:async ()=>{
            const res= await axiosinstance.get(`/admin/notice/detail/${noticeid}`)
            return res.data;
        }
    })

    if(isLoading) return <Statebox>불러오는 중…</Statebox>
    if(error) return <Statebox>글을 불러오지 못했습니다. {error.message}</Statebox>
    if(!data) return <Statebox>글을 찾을 수 없습니다.</Statebox>

    if(isupdate){
        return <Adminnoticeupdatedetail data={data} setisupdate={setIsupdate}/>
    }

    const files=data.detachfiles||[];
    //원글만 위에서 돌리고, 답글은 각 원글이 자기 것만 골라 그린다
    const roots=(data.comments||[]).filter((co)=>co.depth===0);

    //==========================View========================================
    return (
        <Page>
            <Pagehead>
                <Pagetitle>게시글 상세</Pagetitle>
                <Pagemeta>{data.num}번 · {data.red}</Pagemeta>
                <Headright>
                    <Button type="button" onClick={()=>navigate("/admin/notice")}>목록</Button>
                    <Button type="button" $variant="primary"
                        onClick={()=>{setIsupdate(true)}}>수정하기</Button>
                    <Button type="button" $variant="danger"
                        onClick={()=>{deletenotice(data.num)}}>삭제하기</Button>
                </Headright>
            </Pagehead>

            <Columns>
                <Maincol>
                <Panel>
                    <Article>
                        <Articlehead>
                            <Titleline>
                                <Badge>{data.num}번</Badge>
                                <Articletitle>{data.title}</Articletitle>
                            </Titleline>

                            <Writer>
                                <Avatar src={profileimage(data.userprofile)} alt=""/>
                                <Writername>
                                    <UserMenu email={data.username} nickname={data.nickname}>
                                        <Nickname>{data.nickname}</Nickname>
                                    </UserMenu>
                                    <UserMenu email={data.username} nickname={data.nickname}>
                                        <Email>{data.username}</Email>
                                    </UserMenu>
                                </Writername>

                                <Weatherrow>
                                    <Weatherchip>하늘 <b>{data.sky}</b></Weatherchip>
                                    <Weatherchip>강수 <b>{data.pty}</b></Weatherchip>
                                    <Weatherchip>1시간 강수량 <b>{data.rain}</b></Weatherchip>
                                    <Weatherchip>기온 <b>{data.temp}℃</b></Weatherchip>
                                </Weatherrow>
                            </Writer>
                        </Articlehead>

                        <Articlebody dangerouslySetInnerHTML={{__html:data.text}}/>

                        <Articlefoot>
                            <Button type="button" onClick={()=>{setIsupdate(true)}}>수정하기</Button>
                            <Button type="button" $variant="danger"
                                onClick={()=>{deletenotice(data.num)}}>삭제하기</Button>
                        </Articlefoot>
                    </Article>
                </Panel>

                <Commentsection>
                    <Commenthead>댓글 <Badge>{(data.comments||[]).length}</Badge></Commenthead>

                    <Commentform
                        noticenum={data.num}
                        depth="0"
                        cnum=""
                        onCreated={oncommentcreated}/>

                    {roots.length===0
                        ? <Statebox>아직 댓글이 없습니다.</Statebox>
                        : <Commentlist>
                            {roots.map((co)=>(
                                <Adminnoticecomment key={co.id}
                                    comment={co} comments={data.comments} noticeid={data.num}
                                    oncommentcreated={oncommentcreated}/>
                            ))}
                          </Commentlist>}
                </Commentsection>
                </Maincol>

                <Sidepanel>
                    <Sidehead>첨부 이미지 {files.length}장</Sidehead>
                    {files.length===0
                        ? <Sideempty>첨부된 이미지가 없습니다.</Sideempty>
                        : <Sidebody>
                            {files.map((m,key)=>(
                                <Detachitem key={m.id??key}>
                                    <Detachimg src={detachimage(m.path)} alt=""/>
                                    <Detachname title={m.filename}>{m.filename}</Detachname>
                                </Detachitem>
                            ))}
                          </Sidebody>}
                </Sidepanel>
            </Columns>
        </Page>
    )
}
