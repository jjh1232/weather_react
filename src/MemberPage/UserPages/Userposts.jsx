import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useOutlet, useOutletContext } from "react-router-dom";
import CreateAxios from "../../customhook/CreateAxios";
import Twitformlist from "../../List/noticeformlist/Twitformlist";
import { useInView } from "react-intersection-observer";

export default function Userposts(){
const {userinfo} =useOutletContext();
const axiosinstance=CreateAxios();
 
   //유저작성글
    const {data:userposts,
        fetchNextPage,//다음페이지를불러오는함수
        hasNextPage,//다음페이지존재여부 존재할시true
        isFetchingNextPage,//다음페이지불러오는중인지여부
        status//상태코드
    }=useInfiniteQuery({
        queryKey:["userposts",userinfo?.userid],
        queryFn:async({pageParam=0})=>{
            const res=await axiosinstance.get(`/open/userpage/userpost/${userinfo.userid}`,{
                page:pageParam
            })
            console.log("포스트데이터:",res)
            return res.data;

        },
          getNextPageParam:(lastPage,allPages)=>{
                //올페이지는 지금까지 fetchNextPage로받아온 모든응답데이터가 배열로쌓여서 들어옴
                //그래서 allPages.length로 페이징도가능
             
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
    
    const posts = userposts?.pages?.flatMap(page => page.content || []) || [];

    return (<>
             {posts.map((post, key) => (
      <div key={key}>
        <Twitformlist post={post} />

 
      </div>
    
    ))}
       <div ref={ref}>
                마지막
    </div>
    </>);
}