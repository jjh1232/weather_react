import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Wrapper=styled.div`
   position: relative;

width:100%;
height:100%;
display: flex;
`
export default function Noticedetailre(props){
    
    const [page,setPage]=useState(1);
    const  {noticeid}=useParams();

    console.log("노티스디테일")
    const {data:post,isLoading:noticeloading,error:noticeerror}=useQuery({queryKey:["post",noticeid],
        queryFn:async ()=>{
            const res=await axios.get(`/open/noticedetail/`+noticeid);
            
            console.log("노티스:",res)
            return res.data;
        }
    })
/*
      const {data:comment,isLoading:commentloading,error:commenterror}=useQuery({queryKey:["comments",noticeid,page],
        queryFn:async ()=>{
            const res=await axios.get( "/open/commentshow/"+noticeid,{
                params:{
                    page:page
                }
            });
              console.log("댓글:",res)
            return res.data;
        }
    })
*/
    return (
<Wrapper>
        {noticeloading&&<>로딩중...</>}
        
        내용ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
</Wrapper>
    )
}