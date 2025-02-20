import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import CreateAxios from "../../../customhook/CreateAxios";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Noticeblockmodal from "./Menumodal/Noticeblockmodal";
import Noticedeclmodal from "./Menumodal/Noticedeclmodal";
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
    const {updatemethod,deletemethod,isowner,username,nickname,noticeuser,noticeid}=props;
    const navigate=useNavigate();
    const axiosinstance=CreateAxios();
    const queryClient=useQueryClient();
    const [isnoticeblockform,setIsnoticeblockform]=useState(false)
   const [followcheck,setFollowcheck]=useState();

     /*대체안되는이유를모르겠네...
    const {followcheck}=useQuery({
        queryKey:["followch"],
        queryFn:()=>{
            let res = axiosinstance.get(`/followcheck?friendname=${noticeuser}`)
           console.log("유즈쿼리실행중"+res.data)
          
           return res.data;
        }
    } 
    )
     */
    console.log("스크립트코드에선"+followcheck)
    
    const followchecks=()=>{
        axiosinstance.get(`/followcheck?friendname=${noticeuser}`).then((res)=>{setFollowcheck(res.data)})
       }

       useEffect(()=>{
        followchecks();
       },[])

  
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
        setFollowcheck(true)
        alert("유저를팔로우했습니다")
    }
    const unfollowhandler=()=>{
        deletefollow.mutate();
        setFollowcheck(false)
        alert("유저를팔로우해제했습니다")
    }
 
   
    //게시글 차단
    //테이블을만들어서 연관관계써야하나?
    const noticeblock=useMutation({
        mutationFn:(id)=>{
            axiosinstance.post(`/noticeblock`,{
                noticeid:id
            }).then((res)=>{
                alert(`해당${id}번글을 차단했습니다`)
            })
        }
    })
    const noticeblockhandler=(id)=>{
        noticeblock.mutate(id)
    }
    //게시글 신고
    //신고양식모달로 받는게맞는듯?
    const [isdeclationform,setIsdeclationform]=useState(false);
    const declation=useMutation({
        mutationFn:()=>{
            
        }
    })
    const declationhandler=()=>{

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
                   {followcheck&&<>
                    {followcheck?<Innerdiv onClick={()=>{unfollowhandler()}}>
                        언팔로우@{nickname}
                        
                    </Innerdiv>
                     :<Innerdiv onClick={()=>{followhandler()}}>
                        팔로우@{nickname}
                        
                    </Innerdiv>}
                    </>}
                    <Innerdiv onClick={()=>{setIsnoticeblockform(!isnoticeblockform)}}>
                        게시글차단
                        
                    </Innerdiv>
                    <Innerdiv onClick={()=>{setIsdeclationform(!isdeclationform)}}>
                        게시글신고
                        
                    </Innerdiv>
                    {isnoticeblockform&&<Noticeblockmodal ismodal={setIsnoticeblockform}/> }
                    {isdeclationform&&<Noticedeclmodal ismodal={setIsdeclationform}/>}
        </Wrapper>
    )
}