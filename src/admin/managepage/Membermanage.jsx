import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Pagenation from "../../customhook/Pagenation";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import AdminMembercreate from "../../customhook/Admintools/AdminMembercreate";
import AdminUpdateform from "../../customhook/Admintools/AdminUpdateform";
import Membermanagelist from "./list/Membermanagelist";
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

const Memcrbutton=styled.button`
    position: relative;
    float:left;
    border: 1px solid black;
`
const Usersearch=styled.div`
    position: relative;
    float: right;
    right: 0%;
   
`
const Maintable=styled.table`
//position: relative;
width:100%;
height: 10px;
 border: 1px solid black;
float   :left ;
background-color: white;
border-spacing: 0px;
`
const TableHeader=styled.thead`
    background-color:rgb(44,44,44);
`
const Thcss=styled.th`
    color: white;
`

export default function Membermanage(){

    const axiosinstance=CreateAxios();
    const [memberlist,setMemberlist]=useState();
       const [totalpage,setTotalpage]=useState();
        const [totalelement,setTotalelement]=useState();
    const [iscreate,setIscreate]=useState(false);
    
//유저검색
const options = [
    {value:"email",name:"이메일"}, 
    {value:"nickname",name:"닉네임"}, 
    
  ]

        const [query,setQuery]=useSearchParams();
            const navigate=useNavigate();
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
        setMemberlist(res.data.content)
        setTotalpage(res.data.totalPages)
    })
   }
    

    const deletemember=(userid)=>{
        if(window.confirm("정말로삭제하겠습니까?")){
            axiosinstance.delete(`/admin/member/${userid}/delete`)
            .then((res)=>{
                alert(res.data)
                getmember();
            }).catch((err)=>{
                alert("삭제실패")
            })
        }
        else{
            alert("삭제가취소되었습니다")
        }
    }

  
    

    return (

        <Wrapper>
          <AdminHeader>
            
            <h2 style={{color:"white"}}>회원정보관리</h2>
            <Usersearch>
            <AdminSearchtools
                    searchdatas={querydata}
                    options={options}
                    url={"/admin/member"}
                    />
            </Usersearch>

                      <Memcrbutton onClick={()=>{
                setIscreate(true)
            }}>회원추가</Memcrbutton>

                    </AdminHeader>


            {iscreate?<AdminMembercreate setIscreate={setIscreate}/>:""}
                          
            <br/>
                                        
            <Maintable>
            <TableHeader>
                <tr>
                    <Thcss>회원번호</Thcss>
                    <Thcss>회원이메일</Thcss>
                    <Thcss>회원닉네임</Thcss>
                    
                    <Thcss>회원가입사이트</Thcss>
                    <Thcss>회원권한</Thcss>
                    <Thcss>회원주소</Thcss>
                    <Thcss>작성게시글</Thcss>
                    <Thcss>작성코멘트</Thcss>
                    <Thcss>참여채팅방</Thcss>
                    <Thcss>가입날자</Thcss>
                    <Thcss>회원정보관리</Thcss>
                </tr>
                </TableHeader>
                
            {memberlist&&memberlist.map((data,key)=>{
                return(
                   <>
                    <Membermanagelist data={data} key={key}
                    deletemember={deletemember}
                    />
                        
                   </>
                )
                
            })}
           
            </Maintable>
             <Pagenation  totalpage={totalpage}
                      url={"/admin/member"}
                        querydata={querydata}
                      />
        </Wrapper>
    )
}