import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { InView, useInView } from "react-intersection-observer";
import styled from "styled-components";

const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;

 color:${props => props.theme.text};
 background:${props => props.theme.background};
 top: 8%;

`

export default function Imageform(){
    /*
    const {data : imgnoticelist}=useQuery({
        queryKey:["imgnoticelist"],
        queryFn:async ()=>{
            const res=await axios.get("/open/notice/imagelist")
            console.log(res)
            return res.data.content;
        }

    })
        */
    //무한스크롤용 인피니티쿼리
    const {
        data:imgnoticelist,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    }= useInfiniteQuery({
            queryKey:["imgnoticelist"],
            queryFn: async ({pageParam=1})=>{
                const res=await axios.get("/open/notice/imagelist",{
                    params:{page:pageParam}
                })
                return res.data.content
            },
            getNextPageParam:(lastPage,allPages)=>{

                if(lastPage.last) return undefined;
                return lastPage.number+1;
            }
    })
    const {ref,inView}=useInView();

    useEffect(()=>{
        if(inView&&hasNextPage&&!isFetchingNextPage){
            fetchNextPage();
        }
    },[inView,hasNextPage,isFetchingNextPage,fetchNextPage])

    return (
        <Wrapper>
        

        {imgnoticelist&&imgnoticelist.pages.map((data)=>{
            return (
                <>
                {console.log(data)}
                {data.map((da)=>{
                    return (
                        <>
                        {console.log(da)}
                          {da.title}
                     {da.mainimage}
                        </>
                    )
                })}
              
                </>
            )
        })}
        </Wrapper>
    )
}