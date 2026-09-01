import React, { useEffect } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import AdNoticeList from "./list/AdNoticeList";
import AdminNoticecreate from "../../customhook/Admintools/AdminNoticecreate";
import { Page, Pagehead, Pagetitle, Pagemeta, Headright, Panel,
         Tablewrap, Table, Th, Emptyrow, Button, Adminpaging } from "../AdminUI";

export default function Noticemanage(){

    const axiosintance=CreateAxios();
    const [notice,setNotice]=useState();
    const [totalpage,setTotalpage]=useState();
    const [totalelement,setTotalelement]=useState();
    const [iscreate,setIscreate]=useState(false);
    //목록을 못 불러온 상태. "비어 있음" 과 구분해서 보여준다.
    const [loaderror,setLoaderror]=useState(false);

    const options = [
        {value:"title",name:"제목"},
        {value:"text",name:"내용"},
        {value:"titletext",name:"제목+내용"},
        {value:"name",name:"닉네임"},
        {value:"email",name:"이메일"}
    ]

    const [query]=useSearchParams();
    const querydata={
        page:parseInt(query.get("page")) || 1,
        option:query.get("option") ,
        keyword:query.get("keyword")
    }

    useEffect(()=>{
        getnotice();
    },[querydata.page,querydata.option,querydata.keyword])

    const getnotice=()=>{
        axiosintance.get("/admin/noticemanage",{
            params:{page:querydata.page,
                option:querydata.option,
                searchtext:querydata.keyword
            }
        })
        .then((res)=>{
            setLoaderror(false)
            setNotice(res.data.content)
            setTotalpage(res.data.totalPages)
            setTotalelement(res.data.totalElements)
        }).catch(()=>{
            //실패를 조용히 넘기면 "게시글이 없습니다" 라고 거짓말을 하게 된다.
            setLoaderror(true)
            setNotice([])
            setTotalelement(0)
        })
    }

    const deletenotice=(noticeid)=>{
        axiosintance.delete(`/admin/notice/${noticeid}/delete`)
        .then((res)=>{
            getnotice()
        }).catch((err)=>{
            console.log("삭제실패")
        })
    }

    return (
        <Page>
            <Pagehead>
                <Pagetitle>게시글 관리</Pagetitle>
                <Pagemeta>총 {totalelement??0}건 · {totalpage??1}페이지</Pagemeta>

                <Headright>
                    <AdminSearchtools
                        options={options}
                        searchdatas={querydata}
                        url={"/admin/notice"}
                    />
                    <Button type="button" $variant="primary" onClick={()=>setIscreate(true)}>
                        게시글 작성
                    </Button>
                </Headright>
            </Pagehead>

            {iscreate && <AdminNoticecreate setiscreate={setIscreate}/>}

            <Panel>
                <Tablewrap>
                    <Table>
                        <thead>
                            <tr>
                                <Th $align="center">번호</Th>
                                <Th $align="center">프로필</Th>
                                <Th>이메일</Th>
                                <Th>닉네임</Th>
                                <Th>제목</Th>
                                <Th>작성일</Th>
                                <Th $align="center">좋아요</Th>
                                <Th $align="center">댓글</Th>
                                <Th $align="center">이미지</Th>
                                <Th $align="center">신고</Th>
                                <Th $align="center">관리</Th>
                            </tr>
                        </thead>

                        {notice && notice.length>0
                            ? <tbody>
                                {notice.map((data)=>(
                                    <AdNoticeList key={data.num} data={data}
                                        deletemethod={deletenotice}/>
                                ))}
                              </tbody>
                            : <Emptyrow colspan={11}>
                                {loaderror
                                    ? "목록을 불러오지 못했습니다. 새로고침하거나 광고 차단 확장을 꺼보세요."
                                    : querydata.keyword?"검색 결과가 없습니다":"게시글이 없습니다"}
                              </Emptyrow>}
                    </Table>
                </Tablewrap>
            </Panel>

            <Adminpaging totalpage={totalpage} url={"/admin/notice"} querydata={querydata}/>
        </Page>
    )
}
