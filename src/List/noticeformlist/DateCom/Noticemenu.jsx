import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import CreateAxios from "../../../customhook/CreateAxios";
import { useMutation, useQueries } from "@tanstack/react-query";
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
    
   


    const {followcheck,isLoading,error}=useQuery({
        queryKey:["followcheck"],
        queryFn: ()=>{
            const res = axiosinstance.get(`/followcheck?friendname=${friendname}`)
           console.log("유즈쿼리실행중")
            return res.data;
        }
    } 
    )

    const userfollow= useMutation({
        mutationFn:()=>axiosinstance.get(`/follow?friendname=${noticeuser}`)
    })
    const deletefollow= useMutation({
        mutationFn:()=> axiosinstance.delete(`/followdelete/${noticeuser}`)
    })

    const usermove=()=>{
        navigate(`/userpage/${username}`)
    }
   
    const followhandler=()=>{
        userfollow.mutate();
    }
    const unfollowhandler=()=>{
        deletefollow.mutate();
    }
 
   


    return (
        <Wrapper>
            {isowner&&<>
                <Innerdiv onClick={()=>{deletemethod()}}>
                게시글삭제@{nickname}
                
            </Innerdiv>
                <Innerdiv onClick={()=>{updatemethod()}}>
                게시글수정@{nickname}
                
            </Innerdiv>
            </>
            }
                <Innerdiv onClick={()=>{usermove()}}>
                        유저페이지이동@{nickname}
                        
                    </Innerdiv>
                    {followcheck?<Innerdiv onClick={()=>{unfollowhandler()}}>
                        언팔로우@{nickname}
                        
                    </Innerdiv>
                     :<Innerdiv onClick={()=>{followhandler()}}>
                        팔로우@{nickname}
                        
                    </Innerdiv>}
                    
                    <Innerdiv onClick={()=>{usermove()}}>
                        게시글신고@{nickname}
                        
                    </Innerdiv>
        </Wrapper>
    )
}