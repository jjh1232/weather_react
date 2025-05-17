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
                console.log(res)
                return res.data
            },
            getNextPageParam:(lastPage,allPages)=>{
                console.log("페이지파람:"+lastPage)
                if(lastPage.last) return undefined;
                return lastPage.number + 2;
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
        

        {imgnoticelist&&imgnoticelist.pages.map((data,pageindex)=>{
            return (
                <>
                {console.log(pageindex)}
                {console.log(data)}
                {data.content.map((da)=>{
                    return (
                        <>
                            {da.title}
                     {da.mainimage}
                        </>
                    )
                })}
                  
                      
           
                </>
            )
        })}
         <div ref={ref} >
        {isFetchingNextPage&&<>...로딩중..</>}
         </div>
        </Wrapper>
    )
}