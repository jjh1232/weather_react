import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CommentList from "./list/CommentList";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import Pagenation from "../../customhook/Pagenation";
const Wrapper=styled.div`
    text-align: center;

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

    return (
        <Wrapper>
            <AdminSearchtools
                                searchdatas={querydata}
                                options={options}
                                url={"/admin/comment"}
                                />
                 <table >
                <tr>
                    <th>댓글id</th>
                    <th>댓글작성자이메일</th>
                    <th>댓글작성자닉네임</th>
                    <th>댓글작성내용</th>
                    <th>작성한게시글</th>
                    <th>댓글작성날짜</th>
                    
                    

                </tr>
                {comments&&comments.map((data,key)=>{
                    return (
                        <CommentList data={data} key={key}/>
                    )
                })}

                </table>
                <Pagenation  totalpage={totalpage}
                                      url={"/admin/comment"}
                                        querydata={querydata}
                                      />
        </Wrapper>
    )
}