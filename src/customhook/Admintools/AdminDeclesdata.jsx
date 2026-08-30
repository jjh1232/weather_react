import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import CreateAxios from "../CreateAxios";
import SimplePagenation from "./AdminCss/SimplePagenation";
import { Badge } from "../../admin/AdminUI";
import { Modalout, Modalin, Head, Headtitle, Headsub, Closebutton, Body, Emptybox }
    from "../../admin/AdminModal";

//=====================================================================
// 게시글 신고 내역.
//
// 예전엔 Modalout 이 width:40%; height:50%; top:15%; left:55% 로 화면
// 오른쪽 아래 귀퉁이에 고정돼 있었다(그것도 반투명 검정 배경째로).
// 창 크기가 달라지면 표가 잘리거나 화면 밖으로 나갔다.
// 다른 관리자 모달과 같은 껍데기(AdminModal)를 쓴다.
//=====================================================================

const Table=styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
`
const Th=styled.th`
    padding: 8px 10px;
    text-align: left;
    white-space: nowrap;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${(props)=>props.theme.textFaint};
    background: ${(props)=>props.theme.surfaceAlt};
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Td=styled.td`
    padding: 9px 10px;
    vertical-align: middle;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    color: ${(props)=>props.theme.text};
    word-break: break-all;
`
const Tablewrap=styled.div`
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    overflow-x: auto;
`
//사유는 여러 개가 붙어 오므로 알약으로 끊어 읽기 쉽게
const Reasons=styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
`
const Reason=styled.span`
    padding: 1px 8px;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: rgba(255, 82, 82, 0.12);
    color: ${(props)=>props.theme.warning};
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
`
const Mono=styled.span`
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11.5px;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;
`
const Statebox=styled.div`
    padding: 40px 12px;
    text-align: center;
    font-size: 13px;
    color: ${(props)=>props.theme.textMuted};
`

//이유 단어 문자열 각각변경
const DICTIONARY={
    spam:"스팸 및 광고",
    discomfort:"불쾌감",
    violent:"폭력적",
    nsfw:"선정적",
    baduser:"잘못된 유저",
    etc:"기타"
}
const translatereason=(reason)=>DICTIONARY[reason.toLowerCase()]||reason;

//"[spam, nsfw]" 처럼 들어오는 문자열을 알약 목록으로
const Reasonlist=({text})=>{
    const list=String(text||"")
        .replace(/[\[\]]/g,'')     //정규식으로대괄호제거
        .split(',')                //스플릿으로단어나누기
        .map(w=>w.trim())          //공백제거해야 뒤에것도 인식함
        .filter(Boolean)
        .map(translatereason);

    if(list.length===0) return <Mono>-</Mono>;
    return <Reasons>{list.map((r,i)=><Reason key={i}>{r}</Reason>)}</Reasons>;
}

export default function AdminDeclesdata(props){
    const {noticeid,isdecles}=props;
    const axiosinstance=CreateAxios();
    const [currentpage,setCurrentpage]=useState(1);

    const {isLoading,error,data}=useQuery({
        queryKey:[`decledata`,noticeid,currentpage],
        queryFn: async ()=> {
            const res=await axiosinstance.get(`/admin/noticedecle/${noticeid}`,{
                params:{page:currentpage}
            })
            return res.data;
        }
    })

    const close=()=>isdecles(false);

    //ESC 로 닫기
    useEffect(()=>{
        const onkey=(e)=>{ if(e.key==="Escape") close() }
        document.addEventListener("keydown",onkey)
        return ()=>document.removeEventListener("keydown",onkey)
    },[])

    const total=data?.totalElements??0;

    return (
        <Modalout onMouseDown={close}>
        <Modalin onMouseDown={(e)=>e.stopPropagation()}>

            <Head>
                <Headtitle>게시글 신고 내역</Headtitle>
                <Headsub>{noticeid}번 글</Headsub>
                {!isLoading && !error && total>0 && <Badge>총 {total}건</Badge>}
                <Closebutton type="button" onClick={close} title="닫기(Esc)">×</Closebutton>
            </Head>

            <Body>
                {isLoading
                    ? <Statebox>불러오는 중…</Statebox>
                    : error
                    ? <Statebox>신고 내역을 불러오지 못했습니다. {error.message}</Statebox>
                    : total===0
                    ? <Emptybox>신고된 내역이 없습니다.</Emptybox>
                    : <>
                        <Tablewrap>
                            <Table>
                                <thead>
                                    <tr>
                                        <Th>글번호</Th>
                                        <Th>신고한 회원</Th>
                                        <Th>사유</Th>
                                        <Th>신고일</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.content.map((decle,key)=>(
                                        <tr key={key}>
                                            <Td><Mono>{decle.noticeid}</Mono></Td>
                                            <Td>{decle.username}</Td>
                                            <Td><Reasonlist text={decle.reason}/></Td>
                                            <Td><Mono>{decle.datetime}</Mono></Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tablewrap>

                        <SimplePagenation setcurrent={setCurrentpage}
                            currentpage={currentpage} totalpage={data.totalPages}/>
                      </>}
            </Body>

        </Modalin>
        </Modalout>
    )
}
