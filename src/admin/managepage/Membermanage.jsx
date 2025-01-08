import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Pagenation from "../../customhook/Pagenation";
const Wrapper=styled.div`
    text-align: center;

`

export default function Membermanage(){

    const axiosinstance=CreateAxios();
    const [memberlist,setMemberlist]=useState();
       const [totalpage,setTotalpage]=useState();
        const [totalelement,setTotalelement]=useState();
        const [currentpage,setCurrentpage]=useState(1);    

    //쿼리사용해보자
    /*
    const getmember=async()=>{
        const data=await axiosinstance.get("/admin/membermanage").then((res)=>{
          
            
            return res
           
        })
        console.log("연결성공"+data)
       return data
      
    }
    const {isPending,iserror,memberlist}=useQuery({
        queryKey:["memberdata"],
        queryFn:()=>{getmember()},
        staleTime:1000*10,
    
            
        
    })
    

 
    if(isPending) return "loading...."
    if(iserror) return "error"
*/
useEffect(()=>{
    getmember()
},[])


   const getmember=()=>{
    axiosinstance.get("/admin/membermanage",{
        params:{page:currentpage}
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
            멤버관리페이지 {memberlist?"tre":"fals"}
            <br/>
            
            <table >
            <button>회원추가</button>
                <tr>
                    <th>회원번호</th>
                    <th>회원이메일</th>
                    <th>회원닉네임</th>
                    
                    <th>회원가입사이트</th>
                    <th>회원권한</th>
                    <th>가입날자</th>
                </tr>
            {memberlist&&memberlist.map((data,key)=>{
                return(
                    
                        <tr>
                            <td>{data.id} </td>
                            <td>{data.username} </td>
                            <td>{data.nickname} </td>
                            
                            <td>{data.provider}</td>
                            <td>{data.role}</td>
                            <td>{data.red} </td>

                            <button>회원정보수정</button> &nbsp;
                            <button onClick={()=>{deletemember(data.id)}}>회원삭제</button>
                        </tr>
                       
                        
                   
                )
                
            })}
            </table>
            <Pagenation currentpage={currentpage} totalpage={totalpage}
                        setCurrentpage={setCurrentpage}
                        />
        </Wrapper>
    )
}