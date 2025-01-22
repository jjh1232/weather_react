import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CommentList from "./list/CommentList";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import Pagenation from "../../customhook/Pagenation";
const Wrapper=styled.div`
    position: absolute;
    top: 0%;
    left:18%;
    width: 80%;
    height: 99%;
    border: 1px solid black;
    text-align: center;

`
const Header=styled.div`
    
`

const Commentsearch=styled.div`
    position: relative;
    float: right;
    right: 0%;
   
`
const Maintable=styled.table`
width:100%;
height: 80%;
border: 1px solid black;
float   :left ;
`
const TableHeader=styled.thead`
    background-color:rgb(44,44,44);
`
const Thcss=styled.th`
    color: white;
`

export default function Commentmanage(){

const axiosinstance=CreateAxios();
const [comments,setComments]=useState();
const [totalpage,setTotalpage]=useState();


const [query,setQuery]=useSearchParams();
            
            const querydata={
                page:parseInt(query.get("page")) || 1,
                option:query.get("option") ,
                keyword:query.get("keyword") 
        
            }

            const options = [
                {value:"email",name:"이메일"}, 
                {value:"nickname",name:"닉네임"},
                {value:"noticenum",name:"작성된게시글"} 
                
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
    })
}

    const deletecomment=(commentid)=>{
        console.log("코멘트아이디"+commentid)
        axiosinstance.delete(`/admin/commentdelete/${commentid}`)
        .then((res)=>{
            alert("삭제완료되었습니다")
            commentget()
        }).catch((err)=>{
            alert(err)
        })
    }

    return (
        <Wrapper>
            <Header>
                <h3>회원댓글관리</h3>
                
            <Commentsearch>
            <AdminSearchtools
                                searchdatas={querydata}
                                options={options}
                                url={"/admin/comment"}
                                />
            </Commentsearch>
            </Header>

                 <Maintable>
                    <TableHeader>
                <tr>
                    <Thcss>댓글id</Thcss>
                    <Thcss>댓글작성자이메일</Thcss>
                    <Thcss>댓글작성자닉네임</Thcss>
                    <Thcss>댓글작성내용</Thcss>
                    <Thcss>작성한게시글</Thcss>
                    <Thcss>댓글작성날짜</Thcss>
                    <Thcss>회원댓글관리</Thcss>
                    
                    

                </tr>
                </TableHeader>
                {comments&&comments.map((data,key)=>{
                    return (
                        <CommentList data={data} key={key} deletemethod={deletecomment}/>
                    )
                })}

                </Maintable>
                <br/>
                <Pagenation  totalpage={totalpage}
                                      url={"/admin/comment"}
                                        querydata={querydata}
                                      />
        </Wrapper>
    )
}