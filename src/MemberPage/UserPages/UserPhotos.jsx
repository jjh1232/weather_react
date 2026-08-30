import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import { useInView } from "react-intersection-observer";
import Imageformlist from "../../List/noticeformlist/Imageform/Imageformlist";
import { useOutletContext, useSearchParams } from "react-router-dom";
import styled from "styled-components";


const Wrapper=styled.div`
position: relative;

width:100%;
/* 고정폭 타일 + flex-wrap 이라 화면마다 줄이 달라지고 남는 자리가 생겼다.
   auto-fill 로 칸 수를 브라우저가 정하게 한다. (top:8% 는 옛 보정값) */
display: grid;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 10px;
padding: 12px;

 color:${props => props.theme.text};
 background: transparent;

@media (max-width: 620px) {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  padding: 8px;
}
`

export default function UserPhotos(){
const {userinfo} =useOutletContext();
const [searchParams]=useSearchParams();
const option=searchParams.get("option") ||"";
const keyword=searchParams.get("query")|| "";
const axiosinstance=CreateAxios();

    const {data:imagelist,fetchNextPage,hasNextPage,isFetchingNextPage,status}=useInfiniteQuery({
        queryKey:["userpageimage",userinfo?.userid,keyword,option],
        queryFn:async ({pageParam=1})=>{
            const res=await axiosinstance.get(`/open/userpage/userimagepost/${userinfo.userid}`,{
                params:{page:pageParam,keyword:keyword,option:option,}
            })
            return res.data;
        },
        getNextPageParam:(lastPage,allPages)=>{
             if(lastPage.last) return undefined;

                
                return lastPage.number + 2; 
        }
    })
    const [ref,inView]=useInView();

    useEffect(()=>{

        if(inView&&hasNextPage&&!isFetchingNextPage){
            fetchNextPage();
        }
    },[inView,hasNextPage,fetchNextPage,isFetchingNextPage])


    return (<Wrapper>
    
        {imagelist&&imagelist.pages.map((data,key)=>{
            return <>
            {data.content.map((da,key)=>{
                return (
                    <Imageformlist content={da} key={key} />
                    
                )
            })}
            </>
        })}

        {imagelist && //이미지리스트가 있을경우만있어야함 아니면두번됨
              <div ref={ref} >
        {isFetchingNextPage&&<>...로딩중..</>}
         </div>
        }
    </Wrapper>)
}