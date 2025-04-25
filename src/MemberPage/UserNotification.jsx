import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import styled from "styled-components";
import CreateAxios from "../customhook/CreateAxios";

const Wrapper=styled.div`

    top: 10px;
    
    width: 250px;
    height: 300px;
    background-color: white;
`
const Noticss=styled.div`
    color: ${(props)=>props.isread?"gray":"black" };
`

export default function UserNotification(props){
        //const {notifidata}=props;
        const axiosinstance=CreateAxios();

        const {data:notifidata,isLoading,error,isSuccess}=useQuery({
            queryKey:["notificationdata"],
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
               {notifidata&&notifidata.content.map((data)=>{
                return(
                    <Noticss isread={data.isread}>
                    {data.message}
                    {data.red}
                    {data.isread}
                    </Noticss>
                )
               })}
        </Wrapper>
    )
}