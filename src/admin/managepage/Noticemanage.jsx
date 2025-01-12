import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import Pagenation from "../../customhook/Pagenation";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import { useCookies } from "react-cookie";
import AdNoticeList from "./list/AdNoticeList";

const Wrapper=styled.div`
    text-align: center;

`

export default function noticemanage(){

    const axiosintance=CreateAxios();
    const [notice,setNotice]=useState();
    const [totalpage,setTotalpage]=useState();
    const [totalelement,setTotalelement]=useState();
    const [loginuser,setloginuser,removeloginuser]=useCookies();
    const options = [
        {value:"title",name:"제목"}, 
        {value:"text",name:"내용"}, 
        {value:"titletext",name:"제목+내용"}, 
        {value:"name",name:"닉네임검색"} ,
        {value:"email",name:"이메일검색"}
      ]
    

    const [query,setQuery]=useSearchParams();
    const navigate=useNavigate();
    const querydata={
        page:parseInt(query.get("page")) || 1,
        option:query.get("option") ,
        keyword:query.get("keyword") 

    }
    

      useEffect(()=>{
            getnotice();
        },[querydata.page,querydata.option,querydata.keyword])
    
        const getnotice=()=>{
            console.log("검색어"+querydata.keyword)
            axiosintance.get("/admin/noticemanage",{
                params:{page:querydata.page,
                    option:querydata.option,
                    searchtext:querydata.keyword
                }
            })
            .then((res)=>{
                console.log("관리자멤버"+res)
                setNotice(res.data.content)
                setTotalpage(res.data.totalPages)
                setTotalelement(res.data.totalElements)
            })
        }

        
        const deletenotice=(noticeid)=>{
            console.log("삭제요청"+noticeid)
            axiosintance.delete(`/admin/notice/${noticeid}/delete`)
            .then((res)=>{
                console.log("삭제성공")
                getnotice()
            }).catch((err)=>{
                console.log("삭제실패")
            })
        }
    return (<> 
        <Wrapper><br/>
    
        <button onClick={()=>{navigate("/admin/notice")}}>게시판메인</button>
        <AdminSearchtools
        options={options}
        searchdatas={querydata}
        url={"/admin/notice"}
        />
        <br/>
        쿼리{querydata.page}
            게시판관리
            토탈페이지:{totalpage}/총게시글:{totalelement}
         

            <table style={{width:"80vw",height:"20vh"}}>
                <tr>
                    <th>글번호</th>
                    <th>작성자프로필</th>
                    <th>작성자이메일</th>
                    <th>작성자닉네임</th>
                    
                    <th>제목</th>
                    <th>내용</th>
                    <th>작성일</th>
                    <th>좋아요수</th>
                    <th>댓글수</th>
                    <th>이미지수</th>

                </tr>
            {notice&&notice.map((data,key)=>{
                return (<>
                    <AdNoticeList data={data} key={key} deletemethod={deletenotice}/>
                </>)
            })}
            </table>
            <Pagenation  totalpage={totalpage}
          url={"/admin/notice"}
            querydata={querydata}
          />
        </Wrapper>
        </>
    )
}