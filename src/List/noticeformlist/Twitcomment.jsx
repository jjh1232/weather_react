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


const Wrapper=styled.div`
    
`
const Pagenationcss=styled.div`

    display: flex;
    align-items: center;         // 세로 중앙정렬
    justify-content: center;     // 가로 중앙정렬
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
            setTimeout(() => {
         
       
      
     
       // 최초가 아니라면(즉, page가 바뀌어서 useEffect가 재실행된 경우)
       if (ref.current) {
         ref.current.scrollIntoView({ behavior: 'smooth' });
       }
         }, 1500);
     }, [page]);
    

    return (
        <>
  
        <Commentform noticenum ={noticeid} depth="0" cnum="" ref={ref} page={page}/>
    
        
        {comments?.content&&
                <>
               <Commentlist comments={comments.content} noticeid={noticeid} page={page}   />
                 <Pagenationcss>
                             <CommentPagination currentpage={page} totalpage={comments?.totalPages} setpage={setPage}/>
                
                 </Pagenationcss>      
            </>
        }
       


</>
    )
}