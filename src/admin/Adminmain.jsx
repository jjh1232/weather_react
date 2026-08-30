import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import CreateAxios from "../customhook/CreateAxios";
import { Page, Pagehead, Pagetitle, Pagemeta } from "./AdminUI";

//=====================================================================
// 관리자 첫 화면.
// 예전에는 회색 띠에 "관리자페이지" 라는 글자 하나뿐이라 들어와도 할 게 없었다.
// 각 목록의 총 건수를 보여주고 그 자리에서 바로 넘어가게 한다.
// (건수는 이미 있는 목록 API 의 totalElements 를 쓴다. 따로 만든 집계 API 가 아니다)
//=====================================================================

const Cards=styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
`
const Card=styled.button`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 18px 18px 20px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadowSm};
    text-align: left;
    cursor: pointer;
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition},
                transform ${(props)=>props.theme.transition};

    &:hover {
        border-color: ${(props)=>props.theme.accent};
        box-shadow: ${(props)=>props.theme.shadow};
        transform: translateY(-1px);
    }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
const Cardlabel=styled.span`
    font-size: 12.5px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
`
const Cardvalue=styled.span`
    font-size: 28px;
    font-weight: 750;
    letter-spacing: -0.03em;
    color: ${(props)=>props.theme.text};
`
const Cardunit=styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
    margin-left: 3px;
`
const Cardgo=styled.span`
    font-size: 12px;
    font-weight: 600;
    color: ${(props)=>props.theme.accent};
`

const SECTIONS=[
    {key:"member",   label:"회원",    unit:"명", url:"/admin/membermanage",   to:"/admin/member"},
    {key:"notice",   label:"게시글",  unit:"건", url:"/admin/noticemanage",   to:"/admin/notice"},
    {key:"comment",  label:"댓글",    unit:"건", url:"/admin/commentmanage",  to:"/admin/comment"},
    {key:"chatroom", label:"채팅방",  unit:"개", url:"/admin/chatroommanage", to:"/admin/chatroom"},
]

export default function Adminmain(){

    const axiosinstance=CreateAxios();
    const navigate=useNavigate();

    const results=useQueries({
        queries:SECTIONS.map((section)=>({
            queryKey:["admincount",section.key],
            queryFn:async()=>{
                const res=await axiosinstance.get(section.url,{params:{page:1}});
                return res.data.totalElements;
            },
        }))
    })

    return (
        <Page>
            <Pagehead>
                <Pagetitle>대시보드</Pagetitle>
                <Pagemeta>카드를 누르면 해당 관리 화면으로 이동합니다</Pagemeta>
            </Pagehead>

            <Cards>
                {SECTIONS.map((section,index)=>{
                    const result=results[index];
                    return (
                        <Card key={section.key} type="button" onClick={()=>navigate(section.to)}>
                            <Cardlabel>{section.label}</Cardlabel>
                            <Cardvalue>
                                {result.isLoading?"—"
                                    :result.isError?"?"
                                    :Number(result.data??0).toLocaleString()}
                                <Cardunit>{section.unit}</Cardunit>
                            </Cardvalue>
                            <Cardgo>관리하기 →</Cardgo>
                        </Card>
                    )
                })}
            </Cards>
        </Page>
    )
}
