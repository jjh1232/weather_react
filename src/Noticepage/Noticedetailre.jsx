import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import styled from "styled-components";

const Wrapper=styled.div`
    
`
export default function Noticedetailre(props){
    const {noticeid}=props;
    const [page,setPage]=useState();

    const {data:post,isLoading:noticeloading,error:noticeerror}=useQuery({queryKey:["post",noticeid],
        queryFn:async ()=>{
            const res=await axios.get(`/open/noticedetail/`+detailnum.num);
            
            return res.data;
        }
    })

      const {data:comment,isLoading:commentloading,error:commenterror}=useQuery({queryKey:["comments",noticeid,page],
        queryFn:async ()=>{
            const res=await axios.get( "/open/commentshow"+detailnum.num);
            
            return res.data;
        }
    })

    return (
<Wrapper>
        

</Wrapper>
    )
}