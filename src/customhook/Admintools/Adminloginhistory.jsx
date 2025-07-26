import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CreateAxios from "../CreateAxios";
import styled from "styled-components";
import Pagenation from "../../UI/WeatherPagenation";
import HistoryPaging from "./HistoryPaging";

const Headers=styled.div`
    
`
const MainTable=styled.table`
    
`

export default function Adminloginhistory(){

    const [param,setParam]=useSearchParams();
    const [currentpage,setCurrentpage]=useState(1)
    const username=param.get("username")
    const axiosinstance=CreateAxios();
    const [year,setYear]=useState("novalue");
    const [month,setMonth]=useState("novalue");
    const [isasc,setIsasc]=useState(false);

    
   
    //쿼리
    const {isLoading,error,data,refetch}=useQuery({
        queryKey:[`historydata`],
        queryFn:async ()=>{
            const res=await axiosinstance.get(`/admin/loginhistory?username=${username}&year=${year}&month=${month}&isasc=${isasc}&page=${currentpage}`)
        
            
            return res.data;
        },
        
        
    })
    if(isLoading) return `Loading....`

    if(error) return "eroos.."+error.message
   
    let today = new Date();
    let currentyear=today.getFullYear();

    const yearset=async(num)=>{
        await setYear(num)
        await setMonth("novalue")
        refetch();
    }
    const monthset=async(num)=>{
        await setMonth("0"+num)
        refetch();
    }

    let yeararr=[];

    for(let i=0;i<3;i++){
        yeararr.push(currentyear-i)
    }
    let montharr=[]
    if(year===today.getFullYear()){
        for(let i=1;i<=today.getMonth()+1;i++){
            montharr.push(i)
        }
    }else{
        for(let i=1;i<=12;i++){
            montharr.push(i)
        }
    }
   
    return (
        <>

            <Headers>
            {username}님의 로그인기록<br/>
                {yeararr.reverse().map((m)=>{
                    return (
                        <button onClick={()=>{yearset(m)}}>
                            {m}
                        </button>
                    )
                })}
                
                <br/>
                {year!=="novalue"&&<>
                  {montharr.map((m)=>{
                    return (
                        <button onClick={()=>{monthset(m)}}>
                            {m}월
                        </button>
                    )
                })}
                </>
            }
                
            </Headers>
            <MainTable>
                <tr>
                <th>유저이름</th>
                <th>성공여부</th>
                <th>로그인지역</th>
                <th>요청ip주소</th>
                <th>로그인시간</th>
                </tr>
            {data&&data.content.map((user)=>{
                return (
                    <tr>
                   <td> {user.username}</td>
                   <td>{user.islogin?"성공":"실패"}</td>
                   <td>{user.userlocale}</td>
                   <td>{user.userip}</td>
                   <td>{user.logintime}</td>
                   
                    </tr>
                )
            })}
          </MainTable>
          
            <HistoryPaging refetch={refetch}
            currentpage={currentpage} totalpage={data.totalPages} setCurrentpage={setCurrentpage}/>
        </>
    )


}