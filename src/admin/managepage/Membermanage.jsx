import React, { useEffect } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import AdminMembercreate from "../../customhook/Admintools/AdminMembercreate";
import Membermanagelist from "./list/Membermanagelist";
import { useConfirm, useToast } from "../../UI/Feedback/FeedbackProvider";
import { Page, Pagehead, Pagetitle, Pagemeta, Headright, Panel,
         Tablewrap, Table, Th, Emptyrow, Button, Adminpaging } from "../AdminUI";

//회원 목록. 화면 골격(좌측 네비·여백)은 AdminLayout 이 잡는다.
export default function Membermanage(){

    const axiosinstance=CreateAxios();
    const confirm=useConfirm();
    const toast=useToast();
    const [memberlist,setMemberlist]=useState();
    const [totalpage,setTotalpage]=useState();
    const [totalelement,setTotalelement]=useState();
    const [iscreate,setIscreate]=useState(false);
    //목록을 못 불러온 상태. "비어 있음" 과 구분해서 보여준다.
    const [loaderror,setLoaderror]=useState(false);

    //유저검색
    const options = [
        {value:"email",name:"이메일"},
        {value:"nickname",name:"닉네임"},
    ]

    const [query]=useSearchParams();
    const querydata={
        page:parseInt(query.get("page")) || 1,
        option:query.get("option") ,
        keyword:query.get("keyword")
    }

    useEffect(()=>{
        getmember()
    },[querydata.page,querydata.option,querydata.keyword])

    const getmember=()=>{
        axiosinstance.get("/admin/membermanage",{
            params:{page:querydata.page,
                option:querydata.option,
                searchtext:querydata.keyword
            }
        }).then((res)=>{
            setLoaderror(false)
            setMemberlist(res.data.content)
            setTotalpage(res.data.totalPages)
            setTotalelement(res.data.totalElements)
        }).catch(()=>{
            /* 실패를 조용히 넘기면 화면이 "회원이 없습니다" 라고 거짓말을 한다.
               실제로 광고 차단 확장이 /admin/ 요청을 막아서 회원 3명이
               0명으로 보인 적이 있다. 서버 로그에는 요청 흔적조차 없어서
               원인을 찾는 데 한참 걸렸다. */
            setLoaderror(true)
            setMemberlist([])
            setTotalelement(0)
        })
    }

    //window.confirm 과 달리 확인창이 실행을 멈추지 않는다. 답을 await 로 받는다.
    const deletemember=async(userid)=>{
        const ok=await confirm({
            title:"이 회원을 삭제할까요?",
            description:"회원이 쓴 글·댓글도 함께 사라집니다. 되돌릴 수 없습니다.",
            confirmText:"삭제",
            danger:true,
        })
        if(!ok) return;

        axiosinstance.delete(`/admin/member/${userid}/delete`)
        .then((res)=>{
            toast.success(res.data||"삭제되었습니다.")
            getmember();
        }).catch((err)=>{
            toast.error(err)
        })
    }

    return (
        <Page>
            <Pagehead>
                <Pagetitle>회원 관리</Pagetitle>
                <Pagemeta>총 {totalelement??0}명 · {totalpage??1}페이지</Pagemeta>

                <Headright>
                    <AdminSearchtools
                        searchdatas={querydata}
                        options={options}
                        url={"/admin/member"}
                    />
                    <Button type="button" $variant="primary" onClick={()=>setIscreate(true)}>
                        회원 추가
                    </Button>
                </Headright>
            </Pagehead>

            {iscreate && <AdminMembercreate setIscreate={setIscreate}/>}

            <Panel>
                <Tablewrap>
                    <Table>
                        <thead>
                            <tr>
                                <Th $align="center">번호</Th>
                                <Th>이메일</Th>
                                <Th>닉네임</Th>
                                <Th $align="center">가입경로</Th>
                                <Th $align="center">권한</Th>
                                <Th>주소</Th>
                                <Th $align="center">게시글</Th>
                                <Th $align="center">댓글</Th>
                                <Th $align="center">채팅방</Th>
                                <Th>가입일</Th>
                                <Th $align="center">관리</Th>
                            </tr>
                        </thead>

                        {memberlist && memberlist.length>0
                            ? <tbody>
                                {memberlist.map((data)=>(
                                    <Membermanagelist key={data.id} data={data}
                                        deletemember={deletemember}/>
                                ))}
                              </tbody>
                            : <Emptyrow colspan={11}>
                                {loaderror
                                    ? "목록을 불러오지 못했습니다. 새로고침하거나 광고 차단 확장을 꺼보세요."
                                    : querydata.keyword?"검색 결과가 없습니다":"회원이 없습니다"}
                              </Emptyrow>}
                    </Table>
                </Tablewrap>
            </Panel>

            <Adminpaging totalpage={totalpage} url={"/admin/member"} querydata={querydata}/>
        </Page>
    )
}
