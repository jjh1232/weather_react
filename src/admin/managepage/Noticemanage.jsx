import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import Pagenation from "../../customhook/Pagenation";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import { useCookies } from "react-cookie";
import AdNoticeList from "./list/AdNoticeList";
import AdminNoticecreate from "../../customhook/Admintools/AdminNoticecreate";
import AdminHeader from "../../customhook/Admintools/AdminCss/AdminHeader";
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
    width:100%;
    height: 8%;
    position: relative;
    border:3px solid green
`
const Noticecrbutton=styled.button`
    position: relative;
    float:left;
    
    top:70%;
    
`
const Noticesearch=styled.div`
    position: absolute;
    float: right;
    right: 0%;
    bottom: 0%;
   
`
const Maintable=styled.table`
position: relative;
width:100%;
top:0.5%;
vertical-align: top;
float   :left ;
background-color: white;
border-spacing: 0px;
border-collapse: collapse;
font-size: 15px;

`
const TableHeader=styled.thead`
    background-color:rgb(44,44,44);
`
const Thcss=styled.th`
    color: white;
    height: 5px;
    
`

export default function noticemanage(){

    const axiosintance=CreateAxios();
    const [notice,setNotice]=useState();
    const [totalpage,setTotalpage]=useState();
    const [totalelement,setTotalelement]=useState();
    const [iscreate,setIscreate]=useState(false);
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
        <Wrapper>
        {iscreate?<AdminNoticecreate setiscreate={setIscreate}/>:""}
            <AdminHeader>
            <h2 style={{border:"1px solid blue" , width:"10%", position:"absolute",left:"45%"}} 
            onClick={()=>{navigate("/admin/notice")}}>게시글관리</h2>
             
        

        <Noticecrbutton onClick={()=>{setIscreate(true)}}>게시글작성</Noticecrbutton>
        <h6 style={{border:"1px solid black",width:"10%",float:"right",position:"relative"
                ,textAlign:"right",right:"0.3%"
                    
                }} >
                총페이지:{totalpage}/게시글수:{totalelement}
                </h6>   
        <Noticesearch>
        
        <AdminSearchtools
        options={options}
        searchdatas={querydata}
        url={"/admin/notice"}
        />
        </Noticesearch>
    
            
            </AdminHeader>


            <Maintable>
                <TableHeader>
                <tr>
                    
                <Thcss>글번호</ Thcss>
                    <Thcss>
                    작성자프로필</Thcss>
                    <Thcss>
                    작성자이메일</Thcss>

                    <Thcss>
                    작성자닉네임</Thcss>
                    
                    <Thcss>
                    제목</Thcss>
                    
                   
                    <Thcss>
                    작성일</Thcss>
                    <Thcss>
                    좋아요수</Thcss>
                    <Thcss>
                    댓글수</Thcss>
                    <Thcss>
                    이미지수</Thcss>
                    <Thcss>게시글관리</Thcss>
                    

                </tr>
                </TableHeader>
            {notice&&notice.map((data,key)=>{
                return (<>
                    <AdNoticeList data={data} key={key} deletemethod={deletenotice}/>
                </>)
            })}
            </Maintable>
            <Pagenation  totalpage={totalpage}
          url={"/admin/notice"}
            querydata={querydata}
          />
        </Wrapper>
        </>
    )
}