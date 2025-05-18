import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { InView, useInView } from "react-intersection-observer";
import styled from "styled-components";
import Imageformlist from "./Imageformlist";

const Wrapper=styled.div`
position: relative;

width:100%;
height:100%;
display: flex;
flex-wrap: wrap;
 color:${props => props.theme.text};
 background:${props => props.theme.background};
 top: 8%;
 border: 1px solid red;

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
        data:imgnoticelist, //받아온전체데이터 (페이지별로쌓인다)
        fetchNextPage, //다음페이지를 불러오는함수
        hasNextPage, //다음페이지존재여부
        isFetchingNextPage, //다음페이지불러오는중인지여부
        status, //쿼리상태 loading ,error ,success등
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
                //올페이지는 지금까지 fetchNextPage로받아온 모든응답데이터가 배열로쌓여서 들어옴
                //그래서 allPages.length로 페이징도가능
                console.log("페이지파람:"+lastPage)
                if(lastPage.last) return undefined;

                //number는 서버가 마지막으로반환한값 1로처리했지만 0시작임으로 0이들어옴 때문에
                //2를해야 1번데이터 거기서 3이되서 2번데이터 그담2를받고2더해4를 넘기면 3데이터
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
                        
                        <Imageformlist content={da} />
                       
                        
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