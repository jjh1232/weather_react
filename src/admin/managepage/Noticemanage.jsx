import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import Pagenation from "../../customhook/Pagenation";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AdminSearchtools from "../../customhook/AdminSearchtools";

const Wrapper=styled.div`
    text-align: center;

`

export default function noticemanage(){

    const axiosintance=CreateAxios();
    const [notice,setNotice]=useState();
    const [totalpage,setTotalpage]=useState();
    const [totalelement,setTotalelement]=useState();
    const [currentpage,setCurrentpage]=useState(1);

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
        searchdatas={querydata}
        url={"/admin/notice"}
        />
        <br/>
        쿼리{querydata.page}
            게시판관리
           현재페이지:{currentpage} 토탈페이지:{totalpage}/총게시글:{totalelement}
         

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

                </tr>
            {notice&&notice.map((data)=>{
                return (<tr>
                            <td>{data.num} </td>
                            <td style={{width:"10%"}}>
                                 <img   src={process.env.PUBLIC_URL+"/userprofileimg"+data.userprofile}
   style={{objectFit:"fill",width:"50%",height:"10%"}}
  
                /></td>
                            <td>{data.username} </td>
                            <td>{data.nickname} </td>
                            
                            <td>{data.title}</td>
                            <td>{data.text>300?<>{data.text.slice(0,235)}</>:<>{data.text}</>}</td>
                            <td>{data.red}</td>
                            <td>{data.likes} </td>
                            <button onClick={()=>{deletenotice(data.num)}}>삭제하기</button>
                </tr>)
            })}
            </table>
            <Pagenation  totalpage={totalpage}
            setCurrentpage={setCurrentpage} url={"/admin/notice"}
            querydata={querydata}
          />
        </Wrapper>
        </>
    )
}