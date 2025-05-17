import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
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
    
    const {data : imgnoticelist}=useQuery({
        queryKey:["imgnoticelist"],
        queryFn:async ()=>{
            const res=await axios.get("/open/notice/imagelist")
            console.log(res)
            return res.data.content;
        }

    })

    return (
        <Wrapper>
        이미지리스트dd
        d
        d
        d 
        d 
        d 

        {imgnoticelist&&imgnoticelist.map((data)=>{
            return (
                <>
                {data.title}
                {data.mainimage}
                </>
            )
        })}
        </Wrapper>
    )
}