import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import CreateAxios from "../../../customhook/CreateAxios";
import { useQueries } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
const Wrapper=styled.div`
    position: absolute;
    right: 0px;
    width: 200px;
    display: flex;
    background-color: gray;
    flex-direction: column;

`
const Innerdiv=styled.div`
    border: 1px solid black;
    
`

export default function Noticemenu(props){
    const {updatemethod,deletemethod,isowner,username,nickname,noticeuser}=props;
    const navigate=useNavigate();
    const axiosinstance=CreateAxios();
    const queryClient=useQueryClient();
    
    const usermove=()=>{
        navigate(`/userpage/${username}`)
    }
    const menudata={}   

    if(isowner){

       menudata.삭제하기=deletemethod
       menudata.수정하기=updatemethod
    }
    if(noticeuser!==username){
    const {followcheck,isLoading,error}=useQuery({
        queryKey:["followcheck"],
        queryFn:async ()=>{
            const res = await axiosinstance.get(`/followcheck?friendname=${friendname}`)

            return res.data;
        }
    } 
    )

    if(followcheck){
        menudata.언팔로우="언팔로우"
    }else{
        menudata.팔로우="팔로우"
    }
}
    menudata.유저페이지이동=usermove

    
    
    menudata.게시글신고="게시글신고"


    return (
        <Wrapper>
            {Object.entries(menudata).map(([key,value])=>{
                return (
                    <Innerdiv onClick={()=>{value()}}>
                        {key}@{nickname}
                    </Innerdiv>
                )
            })}
        </Wrapper>
    )
}