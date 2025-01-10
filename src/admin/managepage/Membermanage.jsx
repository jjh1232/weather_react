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


const Wrapper=styled.div`
    text-align: center;

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
          
            {iscreate?<AdminMembercreate setIscreate={setIscreate}/>:""}
               <AdminSearchtools
                    searchdatas={querydata}
                    options={options}
                    url={"/admin/member"}
                    />
            멤버관리페이지 {memberlist?"tre":"fals"}
            <br/>
            <button onClick={()=>{
                setIscreate(true)
            }}>회원추가</button>
               
               
            <table >
            <thead>
                <tr>
                    <th>회원번호</th>
                    <th>회원이메일</th>
                    <th>회원닉네임</th>
                    
                    <th>회원가입사이트</th>
                    <th>회원권한</th>
                    <th>회원주소</th>
                    <th>가입날자</th>
                </tr>
                </thead>
                
            {memberlist&&memberlist.map((data,key)=>{
                return(
                   <>
                    <Membermanagelist data={data} key={key}
                    deletemember={deletemember}
                    />
                        
                   </>
                )
                
            })}
           
            </table>
             <Pagenation  totalpage={totalpage}
                      url={"/admin/member"}
                        querydata={querydata}
                      />
        </Wrapper>
    )
}