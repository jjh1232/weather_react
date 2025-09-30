import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useOutlet, useOutletContext, useSearchParams } from "react-router-dom";
import CreateAxios from "../../customhook/CreateAxios";
import Twitformlist from "../../List/noticeformlist/Twitformlist";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";


const Wrapper=styled.div`
 
`

export default function UserHighlight(){
const {userinfo} =useOutletContext();
const axiosinstance=CreateAxios();

const [searchParams]=useSearchParams();
const option=searchParams.get("option") ||"title";
const keyword=searchParams.get("query")|| "";

const Sortoption="highlight";

   //유저작성글
    const {data:userposts,
        fetchNextPage,//다음페이지를불러오는함수
        hasNextPage,//다음페이지존재여부 존재할시true
        isFetchingNextPage,//다음페이지불러오는중인지여부
        status//상태코드
    }=useInfiniteQuery({
        queryKey:["userposts",userinfo?.userid,option,keyword],
        queryFn:async({pageParam=1})=>{
            
            const res=await axiosinstance.get(`/open/userpage/userpost/${userinfo.userid}`,{
              params:{page:pageParam,option:option,keyword:keyword,sortoption:Sortoption}
            })
            console.log("포스트데이터:",res)
            return res.data;

        },
          getNextPageParam:(lastPage,allPages)=>{
                //올페이지는 지금까지 fetchNextPage로받아온 모든응답데이터가 배열로쌓여서 들어옴
                //그래서 allPages.length로 페이징도가능
                console.log("라스트페이지",lastPage)
                console.log("올페이지스",allPages)
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
    
    //배열형태로 받아야한다함 
    const posts = userposts?.pages?.flatMap(page => page.content || []) || [];

    return (<>
             {posts.map((post, key) => (
      <Wrapper key={key}>
        <Twitformlist post={post} />

 
      </Wrapper>
    
    ))}
    {posts &&
       <div ref={ref}>
                 {isFetchingNextPage&&<>...로딩중..</>}
    </div>
    
}
    {!hasNextPage && !isFetchingNextPage && (
        <div style={{ textAlign: "center", color: "#888", margin: "20px 0" }}>
          마지막입니다!
        </div>
      )}
    </>);
}