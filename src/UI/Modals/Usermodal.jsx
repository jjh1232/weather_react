import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../customhook/authCheck";
import ReactDom from "react-dom"
import { useQueryClient } from "@tanstack/react-query";
import { useToast, messageFromError } from "../Feedback/FeedbackProvider";
import { API_BASE } from "../../config/api";
//바깥클릭 감지용 투명 오버레이.
//이전에는 position:absolute + height:100% + top:22px 이라
//포털 대상(#phone-ui, height 570px) 밖으로 22px 넘쳐서
//메뉴를 열고 닫을 때마다 레이아웃/스크롤이 흔들렸다.
//fixed + inset:0 이면 뷰포트 기준이라 부모 레이아웃에 전혀 영향을 주지 않는다.
const Outdiv=styled.div`
    position: fixed;
    inset: 0;
    z-index: 30;
`
const Wrapper=styled.div`
display: flex;
flex-direction: column;

position:fixed; 
justify-content:center;
top:${(props)=>props.modaly}px;
left:${(props)=>props.modalx}px;
z-index: 40;

min-width: 150px;
overflow: hidden;
border: 1px solid ${(props)=>props.theme.border};
border-radius: ${(props)=>props.theme.radius};
background: ${(props)=>props.theme.surface};
box-shadow: ${(props)=>props.theme.shadowLg};
`
// 메뉴 항목 - 사이를 선으로 구분
const Menulist=styled.div`
    padding: 9px 14px;
    cursor: pointer;
    font-size: 13.5px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: ${(props)=>props.theme.text};
    border-bottom: 1px solid ${(props)=>props.theme.border};
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:last-child { border-bottom: none; }

    &:hover {
        background: ${(props)=>props.theme.accentSoft};
        color: ${(props)=>props.theme.accent};
    }
`


function Usermodal(props){
    const {ModalX,ModalY,username, usernickname,chatroomdata,setismodal,profileid}=props;
    //const [modalref]=useRef();
    const axiosinstance=CreateAxios();
    const [followcheck,setFollowcheck]=useState();
    const navigate=useNavigate();
    const queryclient=useQueryClient();
    const toast=useToast();

    //이 모달은 팔로잉/팔로워/즐겨찾기 세 목록에서 공용으로 쓰인다.
    //팔로우 상태가 바뀌면 세 목록이 전부 영향을 받으므로 같이 무효화한다.
    //키의 앞부분만 적으면 뒤에 붙은 userid 와 상관없이 매칭된다(prefix 매칭).
    const refreshfollowlists=()=>{
        queryclient.invalidateQueries({queryKey:["followlistdata"]})
        queryclient.invalidateQueries({queryKey:["followerlist"]})
        queryclient.invalidateQueries({queryKey:["favoritelistdata"]})
    }
 //유스이펙트로 모달외클릭 감지하기
    const logincheck=AuthCheck();

   const [userdata,setUserdata]=useState({
   username:[username],
   usernickname:[usernickname]
   });
    //의존성이 [followcheck] 이면 onfollowcheck 가 setFollowcheck 를 호출하면서
    //자기 자신을 다시 트리거한다(요청 2배). 대상 유저가 바뀔 때만 확인하면 된다.
    useEffect(()=>{
        onfollowcheck();
    },[username])

    //팔로우체크
    const onfollowcheck=()=>{
        if(logincheck){
            console.log("로그인되있음")
            axiosinstance.get("/followcheck?friendname="+username)
            .then((res)=>{
                console.log(res.data)
                setFollowcheck(res.data)
            }).catch((err)=>{
                console.log("에러")
            })
        }
        else{
            console.log("로그인안되있음")
        }
    }
    //팔로우 추가
    const onfollow=(e)=>{
        e.preventDefault();
        console.log("팔로잉실행!")
        if(logincheck){
        axiosinstance.get("/follow?friendname="+username)
        .then((res)=>{
            //성공 알림은 두지 않는다. 메뉴 라벨과 목록이 즉시 바뀌는 것으로 충분하다.
            setFollowcheck(true)      //메뉴 라벨을 "팔로우해제"로 즉시 전환
            refreshfollowlists()      //목록 UI 실시간 반영
        }).catch((err)=>{
            toast.error(messageFromError(err,"팔로우하지 못했습니다."))
        })
    } else{
        toast.info("로그인이 필요합니다.")
    }
    }
    //팔로우취소
    const onunfollow=(e)=>{
        e.preventDefault();
        console.log("언팔로우!실행")
    
        axiosinstance.delete(`/followdelete/${username}`)
        .then((res)=>{
            //성공 알림 없음. 목록에서 사라지고 모달이 닫히는 것으로 결과가 보인다.
            setFollowcheck(false)
            refreshfollowlists()      //해제한 유저가 목록에서 바로 빠지도록
            setismodal(false)         //대상이 사라지므로 모달도 닫는다

        }).catch((err)=>{
            toast.error(messageFromError(err,"팔로우를 해제하지 못했습니다."))
        })
    }

    //1대1채팅만들기
    const makechatroom=(e)=>{
        e.preventDefault()
       console.log("채팅시작");
        if(logincheck){
        axiosinstance.post(`${API_BASE}/createchatroom`,{
            
        usernickname:userdata.usernickname,
        memberlist:userdata.username
    }
        ).then((res)=>{
            console.log(res.data)//룸아이디
            chatroomdata(res.data)
            
            
        }).catch((error)=>{
            //예전에는 콘솔에만 찍혀서 사용자는 아무 반응 없이 기다렸다.
            toast.error(messageFromError(error,"채팅방을 만들지 못했습니다."))
        })
    }else{
        toast.info("로그인이 필요합니다.")
    }
    }


    return ReactDom.createPortal(
        <Outdiv onClick={(e)=>{
            e.stopPropagation()
            setismodal(false)}}>
        <Wrapper modalx={ModalX} modaly={ModalY}>
            {followcheck?<Menulist onClick={(e)=>{
                e.stopPropagation()
                onunfollow(e)}}>팔로우해제</Menulist>
            :<Menulist onClick={(e)=>{
                e.stopPropagation()
                onfollow(e)}}>팔로우</Menulist>}
            
            <Menulist onClick={(e)=>{
                e.stopPropagation()
                makechatroom(e)}}>채팅하기</Menulist>
            <Menulist onClick={()=>navigate(`/userpage/${profileid}`)}>유저페이지</Menulist>

            {/* "프로필아이디:xxx" 줄은 뺐다. 메뉴는 할 수 있는 동작을 고르는 곳인데
                누를 수 없는 정보 한 줄이 섞여 있어 눌러도 아무 일이 안 일어났다.
                아이디는 바로 위 목록에 이미 @아이디로 보인다. */}
        </Wrapper>
        </Outdiv>
    ,document.getElementById('phone-ui')  
)

}export default Usermodal;