import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CreateAxios from "../customhook/CreateAxios";

const Wrapper=styled.div`

    top: 10px;
    
    width: 300px;
    height: 340px;
    background-color: white;
    border: 1px solid black;
`
const Header=styled.div`
    width: 100%;
    height: 5%;
`
const Noticemaindiv=styled.div`
    border: 1px solid blue;
    width: 100%;
    height: 88%;
`
const Noticss=styled.div`
    color: ${(props)=>props.isread?"gray":"black" };
`
const Pagenationdiv=styled.div`
    height: 7%;
    border: 1px solid black;
`

export default function UserNotification(props){
        //const {notifidata}=props;
        const axiosinstance=CreateAxios();
        const [currentpage,setCurrentpage]=useState(1)
        const {data:notifidata,isLoading,error,isSuccess}=useQuery({
            queryKey:["notificationdata",currentpage],
            queryFn:async() =>{
              const res= await axiosinstance.get("/notification")

              return res.data;
            }
        })

        const notifiRead=useMutation({
            mutationFn:async()=>{
                await axiosinstance.post("/notification/readall");
            },
            onSuccess:()=>{
                //근데 구지패치할필요없음
            }
        })

        useEffect(()=>{
            if(isSuccess&&notifidata){
                notifiRead.mutate();
            }
        },[isSuccess,notifidata])
        
    return (
        <Wrapper>
            <Header>
            창닫기
            </Header>
            <Noticemaindiv>
               {notifidata&&notifidata.content.map((data)=>{
                return(
                    <Noticss isread={data.isread}>
                    {data.message}
                    {data.red}
                    
                    </Noticss>
                )
               })}
               </Noticemaindiv>
<Pagenationdiv>
    {currentpage}
</Pagenationdiv>
        </Wrapper>
    )
}