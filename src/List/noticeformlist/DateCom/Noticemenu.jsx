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
import { useCookies } from "react-cookie";
const Wrapper=styled.div`
    position: absolute;
    right: 0px;
    width: 200px;
    display: flex;
    
    flex-direction: column;
    z-index: 1000;
`
//투명오버레이를 만들어서 외부클릭을막기로함
const Outclickdiv=styled.div`
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:transparent;
    z-index: 999;
    cursor: auto;
    
`
const Innerdiv=styled.div`
    background-color: gray;
    border: 1px solid black;
    z-index: 1000;
`




export default function Noticemenu(props){
    const {updatemethod,deletemethod,noticeuser,noticeid,setisblock,closeisMenu}=props;
    const navigate=useNavigate();
    const axiosinstance=CreateAxios();
    const queryClient=useQueryClient();
    //쿠키읽기 여기서하는게나은듯
    const [cookies,setCookie,removeCookie]=useCookies(["userinfo","Acesstoken"]);
    const [isnoticeblockform,setIsnoticeblockform]=useState(false)
   //const [followcheck,setFollowcheck]=useState();

   //유저체크
   const isowner=cookies.userinfo?noticeuser===cookies.userinfo["username"]?true:false:false;
   const username=cookies.userinfo?cookies.userinfo["username"]:"";
   const nickname=cookies.userinfo?cookies.userinfo["nickname"]:"";

   const {usercookie}=useCookies();

   useEffect(()=>{
    if(!cookies.userinfo){
        alert("로그인후이용해주세요!")
       closeisMenu();
    }

   },[cookies.userinfo])

   

    //많이바뀔꺼같아서 따로하긴하는데 동시에하는거랑 뭐가더 비용적으로 좋은지 모르겠음
    //한번에 데이터가져올경우 변경시 다른데이터까지 다시 가져옴
    //따로할경우 백과 연결이 잦아져서 기본적으로 비효율적이지만 변경시 좀더효율적이라보임    
    const {data : followcheck,isLoading,error}=useQuery({
        queryKey:["followch",noticeuser],
        queryFn:async ()=>{
            let res = await axiosinstance.get(`/followcheck?friendname=${noticeuser}`)
           console.log("유즈쿼리실행중"+res.data)
          
           return res.data;
        }
    } 
    )
    //블록여부
    const {data : blockcheck}=useQuery({
        queryKey:["blockcheck",Number(noticeid)],
        queryFn:async ()=>{
            let res = await axiosinstance.get(`/noticeblockcheck?noticeid=${noticeid}`)
           console.log("유즈쿼리실행중"+res.data)
          
           return res.data;
        }
    } 
    )
     //신고여부
     const {data : declecheck}=useQuery({
        queryKey:["declecheck",Number(noticeid)],
        queryFn:async ()=>{
            let res = await axiosinstance.get(`/noticedelclecheck?noticeid=${noticeid}`)
           console.log("유즈쿼리실행중"+res.data)
          
           return res.data;
        }
    } 
    )
    
    /*
    const followchecks=()=>{
        axiosinstance.get(`/followcheck?friendname=${noticeuser}`).then((res)=>{setFollowcheck(res.data)})
       }

       useEffect(()=>{
        followchecks();
       },[])
*/
  
    const userfollow= useMutation({
        mutationFn:()=>axiosinstance.get(`/follow?friendname=${noticeuser}`)
        ,onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:[`followch`,noticeuser]})
            queryClient.invalidateQueries({queryKey:[`followlistdata`,usercookie.userinfo?.userid]})
        },onError:()=>{
            alert("잠시후시도해주세요")
        }
    })
    const deletefollow= useMutation({
        mutationFn:()=> axiosinstance.delete(`/followdelete/${noticeuser}`)
        ,onSuccess:()=>{//캐시업데이트
            queryClient.invalidateQueries({queryKey:[`followch`,noticeuser]})
            queryClient.invalidateQueries({queryKey:[`followlistdata`,usercookie.userinfo?.userid]})
        },onError:()=>{
            alert("잠시후시도해주세요")
        }
    })

    const usermove=()=>{
        navigate(`/userpage/${username}`)
    }
   
    const followhandler=()=>{
        userfollow.mutate();
      //  setFollowcheck(true)
        alert("유저를팔로우했습니다")
    }
    const unfollowhandler=()=>{
        deletefollow.mutate();
        //setFollowcheck(false)
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
   
    //게시글 블록취소 
    const cancelblock=useMutation({
        mutationFn:(noticeid)=>{
            axiosinstance.delete(`/noticeblock/delete/${noticeid}`)
          
        }
        ,onSuccess:()=>{//캐시업데이트
            queryClient.invalidateQueries({queryKey:[`blockcheck`,Number(noticeid)]})
            alert("게시글차단을취소했습니다")
            setisblock(false)
        },onError:()=>{
            alert("잠시후시도해주세요")
        }
    })
    const blockcancel=(noticeid)=>{
        if(confirm("정말로차단을취소하시겠습니까?")){
            cancelblock.mutate(noticeid)
        }
    }
    //게시글신고취소
    const decleblock=useMutation({
        mutationFn:(noticeid)=>{
            axiosinstance.delete(`/noticedecle/delete/${noticeid}`)
        }  ,onSuccess:()=>{//캐시업데이트
            queryClient.invalidateQueries({queryKey:[`declecheck`,Number(noticeid)]})
            alert("게시글신고를취소했습니다")
        },onError:()=>{
            alert("잠시후시도해주세요")
        }
    })
    const declecancel=(noticeid)=>{
        if(confirm("정말로신고를취소하시겠습니까?")){
            decleblock.mutate(noticeid)
        }
    }
    
    return (
       
        <Wrapper>
              <Outclickdiv onClick={()=>{
                console.log('✅ Outclickdiv 클릭됨!');
        closeisMenu();
     }}></Outclickdiv>
                <Innerdiv onClick={()=>{usermove()}}>
                      
                        
                    </Innerdiv>
                  
                    {followcheck?<Innerdiv onClick={()=>{unfollowhandler()}}>
                        언팔로우@{nickname}
                        
                    </Innerdiv>
                     :<Innerdiv onClick={()=>{followhandler()}}>
                        팔로우@{nickname}
                        
                    </Innerdiv>}
                   {blockcheck? 
                   <Innerdiv onClick={()=>{blockcancel(noticeid)}}>
                   게시글차단해제 
                   
               </Innerdiv>
                   :<Innerdiv onClick={()=>{setIsnoticeblockform(!isnoticeblockform) }}>
                        게시글차단 
                        
                    </Innerdiv>}
                    {declecheck? <Innerdiv onClick={()=>{declecancel(noticeid)}}>
                        게시글신고해제
                        
                    </Innerdiv>: <Innerdiv onClick={()=>{setIsdeclationform(!isdeclationform)}}>
                        게시글신고
                        
                    </Innerdiv>}
                   {isowner&&<>
                <Innerdiv onClick={()=>{deletemethod()}}>
                게시글삭제@{nickname}
                
            </Innerdiv>
                <Innerdiv onClick={()=>{updatemethod()}}>
                게시글수정@{nickname}
               
            </Innerdiv>
            
            </>
            }
                    {isnoticeblockform&&<Noticeblockmodal ismodal={setIsnoticeblockform} noticeid={noticeid} setisblock={setisblock}/> }
                    {isdeclationform&&<Noticedeclmodal ismodal={setIsdeclationform} noticeid={noticeid}/>}
        </Wrapper>

    )
}