import React, { useEffect } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import { useToast } from "../../UI/Feedback/FeedbackProvider";
import { useSearchParams } from "react-router-dom";
import CommentList from "./list/CommentList";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import { Page, Pagehead, Pagetitle, Pagemeta, Headright, Panel,
         Tablewrap, Table, Th, Emptyrow, Adminpaging } from "../AdminUI";

export default function Commentmanage(){

    const axiosinstance=CreateAxios();
    const toast=useToast();
    const [comments,setComments]=useState();
    const [totalpage,setTotalpage]=useState();
    const [totalelement,setTotalelement]=useState();

    const [query]=useSearchParams();
    const querydata={
        page:parseInt(query.get("page")) || 1,
        option:query.get("option") ,
        keyword:query.get("keyword")
    }

    const options = [
        {value:"email",name:"이메일"},
        {value:"nickname",name:"닉네임"},
        {value:"noticenum",name:"게시글 번호"}
    ]

    useEffect(()=>{
        commentget()
    },[querydata.page,querydata.option,querydata.keyword])

    const commentget=()=>{
        axiosinstance.get(`/admin/commentmanage`,{
            params:{
                page:querydata.page,
                option:querydata.option,
                searchtext:querydata.keyword
            }
        }).then((res)=>{
            setComments(res.data.content)
            setTotalpage(res.data.totalPages)
            setTotalelement(res.data.totalElements)
        })
    }

    const deletecomment=(commentid)=>{
        axiosinstance.delete(`/admin/commentdelete/${commentid}`)
        .then((res)=>{
            toast.success("삭제완료되었습니다")
            commentget()
        }).catch((err)=>{
            toast.error(err)
        })
    }

    return (
        <Page>
            <Pagehead>
                <Pagetitle>댓글 관리</Pagetitle>
                <Pagemeta>총 {totalelement??0}건 · {totalpage??1}페이지</Pagemeta>

                <Headright>
                    <AdminSearchtools
                        searchdatas={querydata}
                        options={options}
                        url={"/admin/comment"}
                    />
                </Headright>
            </Pagehead>

            <Panel>
                <Tablewrap>
                    <Table>
                        <thead>
                            <tr>
                                <Th $align="center">번호</Th>
                                <Th>작성자 이메일</Th>
                                <Th>닉네임</Th>
                                <Th>내용</Th>
                                <Th $align="center">게시글</Th>
                                <Th>작성일</Th>
                                <Th $align="center">관리</Th>
                            </tr>
                        </thead>

                        {comments && comments.length>0
                            ? <tbody>
                                {comments.map((data)=>(
                                    <CommentList key={data.id} data={data}
                                        deletemethod={deletecomment}
                                        onchanged={commentget}/>
                                ))}
                              </tbody>
                            : <Emptyrow colspan={7}>
                                {querydata.keyword?"검색 결과가 없습니다":"댓글이 없습니다"}
                              </Emptyrow>}
                    </Table>
                </Tablewrap>
            </Panel>

            <Adminpaging totalpage={totalpage} url={"/admin/comment"} querydata={querydata}/>
        </Page>
    )
}
