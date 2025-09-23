import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import { useInView } from "react-intersection-observer";
import Imageformlist from "../../List/noticeformlist/Imageform/Imageformlist";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";


const Wrapper=styled.div`
position: relative;

width:100%;
height:100%;
display: flex;
flex-wrap: wrap;
 color:${props => props.theme.text};
 background:${props => props.theme.background};
 top: 8%;
// border: 1px solid red;
gap: 5px;
`

export default function UserPhotos(){
const {userinfo} =useOutletContext();

const axiosinstance=CreateAxios();

    const {data:imagelist,fetchNextPage,hasNextPage,isFetchingNextPage,status}=useInfiniteQuery({
        queryKey:["userpageimage",userinfo?.userid],
        queryFn:async ({pageParam=1})=>{
            const res=await axiosinstance.get(`/open/userpage/userimagepost/${userinfo.userid}`,{
                params:{page:pageParam}
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