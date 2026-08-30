import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CreateAxios from "../CreateAxios";
import styled from "styled-components";
import HistoryPaging from "./HistoryPaging";

//=====================================================================
// 회원 로그인 기록 (회원관리 표의 "기록" 버튼이 띄우는 작은 팝업창).
// 언제 · 어디서(IP/지역) 로그인했고 성공했는지 실패했는지를 본다.
// 계정 도용이나 반복 로그인 실패를 확인하려고 만든 화면이다.
//
// 고친 것
//  - 화면이 백지였던 건 HistoryPaging 안의 ReferenceError 때문이었다(그쪽 주석 참고).
//  - 쿼리키에 조건이 하나도 없어서(`["historydata"]`) 년/월/페이지를 바꿔도
//    같은 캐시를 보고 있었다. 그래서 setState 뒤에 refetch() 를 손으로 불렀는데,
//    setState 는 바로 반영되지 않으니 "직전 조건"으로 다시 받아왔다.
//    조건을 전부 키에 넣어 react-query 가 알아서 다시 받게 한다.
//  - 스타일이 없어 표가 그냥 텍스트 덩어리였다.
//=====================================================================

const Wrapper=styled.div`
    min-height: 100vh;
    padding: 16px 18px 24px;
    background: ${(props)=>props.theme.page};
    color: ${(props)=>props.theme.text};
`
const Head=styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding-bottom: 12px;
`
const Title=styled.h1`
    margin: 0;
    font-size: 16px;
    font-weight: 750;
    letter-spacing: -0.02em;
`
const Who=styled.span`
    font-size: 12.5px;
    color: ${(props)=>props.theme.textMuted};
    word-break: break-all;
`

const Filters=styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    margin-bottom: 12px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surface};
`
const Filterrow=styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
`
const Filterlabel=styled.span`
    flex-shrink: 0;
    width: 30px;
    font-size: 11.5px;
    font-weight: 700;
    color: ${(props)=>props.theme.textFaint};
`
const Chip=styled.button`
    height: 26px;
    padding: 0 11px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 12px;
    font-weight: ${(props)=>props.$on?700:500};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    border: 1px solid ${(props)=>props.$on
        ? props.theme.accent
        : props.theme.border};
    background: ${(props)=>props.$on
        ? props.theme.accentSoft
        : props.theme.surface};
    color: ${(props)=>props.$on
        ? props.theme.accent
        : props.theme.textMuted};

    &:hover{ border-color: ${(props)=>props.theme.accent}; }
`

const Tablewrap=styled.div`
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surface};
    overflow-x: auto;
`
const Table=styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
`
const Th=styled.th`
    padding: 9px 10px;
    text-align: left;
    white-space: nowrap;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${(props)=>props.theme.textFaint};
    border-bottom: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Td=styled.td`
    padding: 8px 10px;
    vertical-align: middle;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    color: ${(props)=>props.theme.text};
`
const Mono=styled.span`
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11.5px;
    color: ${(props)=>props.theme.textMuted};
    word-break: break-all;
`
//성공/실패 뱃지 - 실패가 눈에 띄어야 의미가 있다
const Result=styled.span`
    display: inline-flex;
    align-items: center;
    height: 19px;
    padding: 0 8px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;

    background: ${(props)=>props.$ok
        ? props.theme.accentSoft
        : "rgba(255, 82, 82, 0.12)"};
    color: ${(props)=>props.$ok
        ? props.theme.accent
        : props.theme.warning};
`
const Statebox=styled.div`
    padding: 40px 16px;
    text-align: center;
    font-size: 13px;
    line-height: 1.7;
    color: ${(props)=>props.theme.textMuted};
    word-break: break-word;
`

export default function Adminloginhistory(){

    const [param]=useSearchParams();
    const username=param.get("username")
    const axiosinstance=CreateAxios();

    const [currentpage,setCurrentpage]=useState(1)
    const [year,setYear]=useState("novalue");
    const [month,setMonth]=useState("novalue");
    const [isasc,setIsasc]=useState(false);

    //조건을 전부 키에 넣는다. 바뀌면 react-query 가 알아서 다시 받아온다.
    const {isLoading,error,data}=useQuery({
        queryKey:["historydata",username,year,month,isasc,currentpage],
        queryFn:async ()=>{
            const res=await axiosinstance.get(`/admin/loginhistory`,{
                params:{username,year,month,isasc,page:currentpage}
            })
            return res.data;
        },
        enabled: !!username,
    })

    const today=new Date();
    const currentyear=today.getFullYear();

    //최근 3개년
    const yeararr=[];
    for(let i=2;i>=0;i--){ yeararr.push(currentyear-i) }

    /* 예전엔 year(문자열) 와 getFullYear()(숫자) 를 === 로 비교해서 늘 거짓이었다.
       올해를 골랐으면 이번 달까지만 보여준다. */
    const isthisyear=Number(year)===currentyear;
    const lastmonth=isthisyear?today.getMonth()+1:12;
    const montharr=[];
    for(let i=1;i<=lastmonth;i++){ montharr.push(i) }

    //조건이 바뀌면 1페이지부터 다시 본다
    const yearset=(num)=>{
        setYear(String(num)); setMonth("novalue"); setCurrentpage(1);
    }
    const monthset=(num)=>{
        setMonth(String(num).padStart(2,"0")); setCurrentpage(1);
    }
    const resetfilter=()=>{
        setYear("novalue"); setMonth("novalue"); setCurrentpage(1);
    }

    return (
        <Wrapper>
            <Head>
                <Title>로그인 기록</Title>
                <Who>{username}</Who>
            </Head>

            <Filters>
                <Filterrow>
                    <Filterlabel>연도</Filterlabel>
                    <Chip type="button" $on={year==="novalue"} onClick={resetfilter}>전체</Chip>
                    {yeararr.map((m)=>(
                        <Chip key={m} type="button" $on={year===String(m)}
                            onClick={()=>yearset(m)}>{m}</Chip>
                    ))}
                </Filterrow>

                {year!=="novalue" &&
                <Filterrow>
                    <Filterlabel>월</Filterlabel>
                    <Chip type="button" $on={month==="novalue"}
                        onClick={()=>{setMonth("novalue"); setCurrentpage(1)}}>전체</Chip>
                    {montharr.map((m)=>(
                        <Chip key={m} type="button"
                            $on={month===String(m).padStart(2,"0")}
                            onClick={()=>monthset(m)}>{m}월</Chip>
                    ))}
                </Filterrow>}

                <Filterrow>
                    <Filterlabel>정렬</Filterlabel>
                    <Chip type="button" $on={!isasc}
                        onClick={()=>{setIsasc(false); setCurrentpage(1)}}>최신순</Chip>
                    <Chip type="button" $on={isasc}
                        onClick={()=>{setIsasc(true); setCurrentpage(1)}}>오래된순</Chip>
                </Filterrow>
            </Filters>

            {isLoading
                ? <Statebox>불러오는 중…</Statebox>
                : error
                ? <Statebox>
                    기록을 불러오지 못했습니다.<br/>
                    {error?.response?.status
                        ? `서버 응답 ${error.response.status}`
                        : error.message}
                  </Statebox>
                : !data?.content?.length
                ? <Statebox>
                    {year==="novalue"
                        ? "로그인 기록이 없습니다."
                        : "선택한 기간에 로그인 기록이 없습니다."}
                  </Statebox>
                : <>
                    <Tablewrap>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>결과</Th>
                                    <Th>로그인 시간</Th>
                                    <Th>IP</Th>
                                    <Th>지역/기기</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.content.map((user,index)=>(
                                    <tr key={`${user.logintime}_${index}`}>
                                        <Td>
                                            <Result $ok={user.islogin}>
                                                {user.islogin?"성공":"실패"}
                                            </Result>
                                        </Td>
                                        <Td><Mono>{user.logintime}</Mono></Td>
                                        <Td><Mono>{user.userip}</Mono></Td>
                                        <Td>{user.userlocale}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tablewrap>

                    <HistoryPaging
                        currentpage={currentpage}
                        totalpage={data.totalPages}
                        setCurrentpage={setCurrentpage}/>
                  </>
            }
        </Wrapper>
    )
}
