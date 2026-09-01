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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
const Wrapper=styled.div`
    position: absolute;
    right: 0px;
    top: 32px;
    width: 200px;
    display: flex;
    
    flex-direction: column;
    z-index: 1000;

    overflow: hidden;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadowLg};
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
// 메뉴 항목.
// 아이콘 자리를 고정폭으로 두어 글자가 세로로 맞아떨어지게 한다.
// $danger 는 신고/삭제처럼 되돌리기 어려운 동작에만 쓴다.
const Innerdiv=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    font-size: 13.5px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: ${(props)=>props.$danger?props.theme.warning:props.theme.text};
    background-color: ${(props)=>props.theme.surface};
    border-bottom: 1px solid ${(props)=>props.theme.border};
    cursor: pointer;
    z-index: 1000;
    white-space: nowrap;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:last-child { border-bottom: none; }

    /* 내용이 없는 항목은 빈 줄로 보이므로 감춘다 */
    &:empty { display: none; }

    &:hover {
        background-color: ${(props)=>props.$danger
            ?"rgba(255, 82, 82, 0.12)"
            :props.theme.accentSoft};
        color: ${(props)=>props.$danger?props.theme.warning:props.theme.accent};
    }
`
// 아이콘 칸 - 라벨 시작점을 맞춰준다
const Iconslot=styled.span`
    flex-shrink: 0;
    width: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    opacity: .85;
`
// 팔로우/차단·신고 를 성격별로 나누는 얇은 구분선
const Groupline=styled.div`
    height: 5px;
    background: ${(props)=>props.theme.surfaceAlt};
    border-bottom: 1px solid ${(props)=>props.theme.border};
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
            queryClient.invalidateQueries({queryKey:[`followlistdata`,cookies.userinfo?.userid]})
            alert("유저를팔로우했습니다")
        },onError:()=>{
            alert("잠시후시도해주세요")
        }
    })
    const deletefollow= useMutation({
        mutationFn:()=> axiosinstance.delete(`/followdelete/${noticeuser}`)
        ,onSuccess:()=>{//캐시업데이트
            queryClient.invalidateQueries({queryKey:[`followch`,noticeuser]})
            queryClient.invalidateQueries({queryKey:[`followlistdata`,cookies.userinfo?.userid]})
            alert("유저를팔로우해제했습니다")
        },onError:()=>{
            alert("잠시후시도해주세요")
        }
    })

    const usermove=()=>{
        navigate(`/userpage/${cookies.userinfo?.profileid||username}`)
    }
   
    //알림은 onSuccess 로 옮겼다. 여기서 부르면 요청이 끝나기도 전에,
    //그리고 실패했을 때도 "팔로우했습니다" 가 떠버린다.
    const followhandler=()=>{
        userfollow.mutate();
    }
    const unfollowhandler=()=>{
        deletefollow.mutate();
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
                {/* 내 글에는 팔로우/차단/신고를 띄우지 않는다.
                    자기 자신을 팔로우하거나 자기 글을 신고하는 건 말이 안 되는데
                    isowner 를 수정/삭제에만 쓰고 있어서 그대로 노출돼 있었다. */}
                {!isowner&&<>
                    {followcheck?<Innerdiv onClick={()=>{unfollowhandler()}}>
                        <Iconslot><FontAwesomeIcon icon={faUserMinus}/></Iconslot>
                        팔로우 해제
                    </Innerdiv>
                     :<Innerdiv onClick={()=>{followhandler()}}>
                        <Iconslot><FontAwesomeIcon icon={faUserPlus}/></Iconslot>
                        팔로우
                    </Innerdiv>}

                    <Groupline/>

                   {blockcheck?
                   <Innerdiv onClick={()=>{blockcancel(noticeid)}}>
                       <Iconslot><FontAwesomeIcon icon={faEye}/></Iconslot>
                       차단 해제
                   </Innerdiv>
                   :<Innerdiv onClick={()=>{setIsnoticeblockform(!isnoticeblockform) }}>
                        <Iconslot><FontAwesomeIcon icon={faBan}/></Iconslot>
                        이 게시글 차단
                    </Innerdiv>}

                    {declecheck?
                    <Innerdiv onClick={()=>{declecancel(noticeid)}}>
                        <Iconslot><FontAwesomeIcon icon={faFlag}/></Iconslot>
                        신고 취소
                    </Innerdiv>
                    :<Innerdiv $danger onClick={()=>{setIsdeclationform(!isdeclationform)}}>
                        <Iconslot><FontAwesomeIcon icon={faFlag}/></Iconslot>
                        이 게시글 신고
                    </Innerdiv>}
                </>}

                   {/* 내 글이면 위쪽 그룹(팔로우/차단/신고)이 통째로 없으므로
                       구분선도 필요 없다. 그리면 메뉴 맨 위에 줄만 덩그러니 남는다. */}
                   {isowner&&<>
                <Innerdiv onClick={()=>{updatemethod()}}>
                <Iconslot><FontAwesomeIcon icon={faPen}/></Iconslot>
                게시글 수정
            </Innerdiv>
                <Innerdiv $danger onClick={()=>{deletemethod()}}>
                <Iconslot><FontAwesomeIcon icon={faTrash}/></Iconslot>
                게시글 삭제
            </Innerdiv>
            </>
            }
                    {isnoticeblockform&&<Noticeblockmodal ismodal={setIsnoticeblockform} noticeid={noticeid} setisblock={setisblock}/> }
                    {isdeclationform&&<Noticedeclmodal ismodal={setIsdeclationform} noticeid={noticeid}/>}
        </Wrapper>

    )
}