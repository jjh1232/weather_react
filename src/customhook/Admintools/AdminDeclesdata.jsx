import React from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import CreateAxios from "../CreateAxios";
import Pagenation from "../Pagenation";
import SimplePagenation from "./AdminCss/SimplePagenation";
import { useState } from "react";

const Modalout=styled.div`
justify-content: center;
align-items: center;
width: 40%;
height: 50%;
top: 15%;
left :55%;
position: fixed;
background:rgba(0,0,0,0.5);
z-index: 10;

`

const ModalIn=styled.div`

padding: 10px;
width: 90%;
height: 80%;
left:4%;
top:8%;
position: relative;
background-color: #FFFFFF;
//overflow: auto;
`
const Exitbutton  =styled.div`
position: absolute;
top: 15px;
left:0%;

z-index: 10;

display: inline-block;


 &::before {
    content: "";
    width: 40px;
    top: 0%;
    left: 0%;
    position: absolute;
    border-bottom: 10px solid black;
    transform:  rotate(45deg);
  }

  &::after {
    top: 0%;
    
    content: "";
    width: 40px;
    left:0%;
    position: absolute;
    border-bottom: 10px solid black;
    transform:  rotate(-45deg);
  }
`
const DecleTable=styled.table`
    border: 1px solid black;
    width: 700px;
    height:250px;
`
const Decleth=styled.thead`
    width: 100%;
`
const Decletd=styled.td`
    
`
const Decledatath=styled.tr`
    
`
const DecleList=styled.td`
   
    border:1px solid gray;
    height: 9.2%;
`
export default function AdminDeclesdata(props){
const {noticeid,isdecles}=props;
    const axiosinstance=CreateAxios();
    const [currentpage,setCurrentpage]=useState(1);
    const {isLoading,error,data}=useQuery({
        queryKey:[`decledata`,currentpage],
        queryFn: async ()=> { 
            
            let res=await axiosinstance.get(`/admin/noticedecle/${noticeid}?page=${currentpage}`).then((res)=>{
                return res.data
            })
        
            return res;
        }
    })

    if(isLoading){
        return <>Loading...</>
    }

    if(error){
        return <>에러입니다!: {error.message}</>
    }
    return (
        <Modalout>
            <Exitbutton onClick={()=>{isdecles(false)}}/>
            <ModalIn>
            엘리{data.totalElements}
            {data&&<DecleTable>
                <Decleth>
                    <Decletd>글번호</Decletd>
                    <Decletd>이메일</Decletd>
                    <Decletd>사유</Decletd>
                    <Decletd>신고날짜</Decletd>
                </Decleth>
            {data.content.map((decle,key)=>{
                return (
                    <Decledatath>
                    <DecleList style={{width:"45px"}}>
                    {decle.noticeid}
                    </DecleList>
                     <DecleList style={{textAlign:"left",width:"200px"}}>
                    {decle.username}
                    </DecleList>
                    <DecleList style={{width:"200px"}}>
                    {decle.reason}
                    </DecleList>
                    <DecleList style={{width:"130px"}}>
                    {decle.datetime}
                    </DecleList>
                    </Decledatath>
                    
                )
            })}
            </DecleTable>}
            {data.totalPages}
            <SimplePagenation setcurrent={setCurrentpage} currentpage={currentpage} totalpage={data.totalPages}/>
            </ModalIn>
        </Modalout>
    )
}