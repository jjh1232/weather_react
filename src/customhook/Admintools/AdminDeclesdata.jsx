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
width: 30%;
height: 40%;
top: 15%;
left :60%;
position: fixed;
background:rgba(0,0,0,0.5);
z-index: 10;

`

const ModalIn=styled.div`
padding: 10px;
width: 80%;
height: 80%;
left:8%;
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
const DecleTable=styled.div`
    border: 1px solid black;
`
const DecleList=styled.div`
    border:1px solid blue
`
export default function AdminDeclesdata(props){
const {noticeid,isdecles}=props;
    const axiosinstance=CreateAxios();
    const [currentpage,setCurrentpage]=useState();
    const {isLoading,error,data}=useQuery({
        queryKey:[`decledata`],
        queryFn: async ()=> { 
            
            let res=await axiosinstance.get(`/admin/noticedecle/${noticeid}`).then((res)=>{
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
            {data.content.map((decle,key)=>{
                return (
                    <DecleList>
                    {decle.noticeid}번글
                    {decle.username}
                    {decle.reason}
                    {decle.datetime}
                    </DecleList>
                )
            })}
            </DecleTable>}
            {data.totalPages}
            <SimplePagenation setcurrent={setCurrentpage} currentpage={currentpage} totalpage={data.totalPages}/>
            </ModalIn>
        </Modalout>
    )
}