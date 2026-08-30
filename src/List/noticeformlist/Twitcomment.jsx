import React, { useEffect, useRef, useState } from "react"
import Twitcommentlistitem from "./Twitcommentlistitem"
import Commentform from "../../Noticepage/Commentform"
import Replycomment from "../../UI/Replycomment"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import CreateAxios from "../../customhook/CreateAxios"
import styled from "styled-components"
import Commentlist from "../Commentlist"
import CommentPagination from "../../Noticepage/CommentPagination"


/* 댓글 영역 전체.
   작성창 / 목록 / 페이지네이션을 하나의 세로 흐름으로 묶는다. */
const Wrapper=styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 12px;
    scroll-margin-top: 70px;   // 페이지 이동 시 헤더에 가려지지 않게
`
/* "댓글 12" 같은 제목 줄 */
const Sectionheader=styled.div`
    display: flex;
    align-items: baseline;
    gap: 6px;
    padding: 2px 2px 0;
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.text};
`
const Countbadge=styled.span`
    font-size: 13px;
    font-weight: 600;
    color: ${(props)=>props.theme.accent};
`
const Loadingdiv=styled.div`
    padding: 24px 16px;
    text-align: center;
    font-size: 13.5px;
    color: ${(props)=>props.theme.textFaint};
`
const Pagenationcss=styled.div`

    display: flex;
    align-items: center;         // 세로 중앙정렬
    justify-content: center;     // 가로 중앙정렬
    padding: 4px 0 8px;
`

export default function Twitcomment(props){


    const {noticeid}=props
    const [page,setPage]=useState(1)
    
    const ref=useRef();
const axiosinstance=CreateAxios();
    
    const {data:comments,isLoading : commentsloading,error:commentserror}=useQuery({
        queryKey:["comments",Number(noticeid),Number(page)], //두번째는 식별자 왠만하면이렇게쓰는게좋다함
        queryFn:async ()=>{
            const res= await axiosinstance.get("/open/commentshow",{
                params:{
                    noticeid:noticeid
                    ,page:page
                }
            })
             
            console.log("코멘츠",res.data)
            return res.data
        }
    })
   
    const queryclient=useQueryClient();

     useEffect(() => {
            //데이터가 갈아끼워진 뒤에 스크롤해야 위치가 맞는다
            const timer=setTimeout(() => {
       if (ref.current) {
         ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }
         }, 200);
         return ()=>clearTimeout(timer);
     }, [page]);
    

    return (
        <Wrapper ref={ref}>
  
        <Commentform noticenum ={noticeid} depth="0" cnum="" page={page} setPage={setPage}/>
    
        {commentsloading&&<Loadingdiv>댓글을 불러오는 중...</Loadingdiv>}

        {comments?.content&&
                <>
                <Sectionheader>
                    댓글
                    <Countbadge>{comments.totalElements ?? comments.content.length}</Countbadge>
                </Sectionheader>

               <Commentlist comments={comments.content} noticeid={noticeid} page={page}   />
                 <Pagenationcss>
                             <CommentPagination currentpage={page} totalpage={comments?.totalPages} setpage={setPage}/>
                
                 </Pagenationcss>      
            </>
        }
       


</Wrapper>
    )
}
