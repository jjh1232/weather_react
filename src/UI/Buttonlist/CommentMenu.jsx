import React from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import AuthCheck from "../../customhook/authCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreateAxios from "../../customhook/CreateAxios";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import { handleparam } from "../../customhook/Userhandle";

/* ⋯ 드롭다운.
   예전엔 회색 배경 + 검은 테두리라 다크모드에서 떠 보였다.
   게시글 메뉴(Noticemenu)와 같은 모양(surface + 큰 그림자)으로 통일한다.
   위치 기준점은 ⋯ 버튼(Usermenudiv, position:relative)이다. */
const Wrapper=styled.div`
    position: absolute;
    top: 30px;
    right: 0;
    width: 168px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1000;
    cursor: default;

    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadowLg};
`
// 메뉴 항목 - 항목 사이를 선으로 구분한다
const Commentmenulist=styled.div`
    width: 100%;
    padding: 10px 14px;
    font-size: 13.5px;
    font-weight: 500;
    letter-spacing: -0.01em;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    /* "red" 로 넘어오는 항목(삭제)만 경고색, 나머지는 본문색 */
    color: ${(props)=>props.color==="red"?props.theme.warning:props.theme.text};
    border-bottom: 1px solid ${(props)=>props.theme.border};
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:last-child { border-bottom: none; }

    &:hover {
        background: ${(props)=>props.color==="red"
            ?"rgba(255, 82, 82, 0.12)"
            :props.theme.accentSoft};
        color: ${(props)=>props.color==="red"?props.theme.warning:props.theme.accent};
    }
`

export default function CommentMenu(props){
    const {nickname,ismenu,isupdate,commentid,noticeid,page,cid,cusername,cprofileid,textcopy}=props;
    const [cookie,setcookie,removecookie]=useCookies(["userinfo"])

    const logincheck=AuthCheck();
    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();
    
    const navigate=useNavigate();
    
    //삭제
    const deletehandler=(commentid)=>{
        console.log("삭제시작코멘트아이디"+commentid)
        if(logincheck){
            if(confirm("정말로삭제하시겠습니까?"))
                {
            deletemutation.mutate(commentid)
                }
                else{
                    alert("삭제가취소됬습니다")
                }
        }
        else{
            alert("로그인정보를 확인해주세요")
            
        }
    }

    const deletemutation=useMutation({
        //어차피동일해서 이름값 안해도된다함
        mutationFn:(id)=>{
            return axiosinstance.delete(`/commentdelete/${id}`)
        },
        onSuccess:(data,variable)=>{
            alert("삭제성공글번호"+noticeid+"페이지"+page)

            //react-query v5 는 invalidateQueries(배열) 을 안 받는다.
            //그동안 filters.queryKey 가 undefined 라 앱 전체 쿼리가 무효화되고 있었다.
            //(키도 String 이라 Number 로 만든 실제 키와 안 맞았다)
            queryclient.invalidateQueries({queryKey:["comments",Number(noticeid)]})

        },
        onError:(err)=>{
            alert("에러남"+err)
        }
    }
    
    
       
    )
    // 업데이트관련
    const updatehandler=()=>{
        isupdate(true)
       // ismenu(true)
    }
    //팔로우체크 
    const {data:followcheck,isLoading,isError}=useQuery({
        queryKey:["followcheck",cookie.userinfo?.userid,cid],
        queryFn:async ()=>{
            const res=await axiosinstance.get(`/followchecktwo/${cid}`)
            console.log("팔로우체크 "+res.data)
            return res.data;
        },
        enabled:logincheck,

    })
    //팔로우 하기 
    const followmutation=useMutation({
        mutationFn:(cid)=> axiosinstance.post(`/follow/${cid}`),
        onSuccess:()=>{
            //성공 알림 없음. 버튼 상태가 바뀌는 것으로 결과가 보인다.
            queryclient.invalidateQueries({ queryKey: ["followcheck",cookie.userinfo.userid,cid] })
            queryclient.invalidateQueries({ queryKey: ["followlistdata",cookie.userinfo.userid] })
        },
        onError:()=>{
            alert("에러입니다잠시기다려주세요")
        }
    })

    //팔로우끊기
    const unfollowmutation=useMutation({
        mutationFn:(cid)=> axiosinstance.delete(`/follow/delete/${cid}`),
        onSuccess:()=>{
            alert("언팔로우")
            queryclient.invalidateQueries({ queryKey: ["followcheck",cookie.userinfo.userid,cid] })
             queryclient.invalidateQueries({ queryKey: ["followlistdata",cookie.userinfo.userid] })
        },
        onError:()=>{
            alert("에러입니다")
        }
    })

    //팔로우핸들러
    const followhandler=(cid)=>{
        if(followcheck){
        console.log("팔로우중")
       unfollowmutation.mutate(cid)
        }else{
 console.log("팔로우안하고있음")
         followmutation.mutate(cid)
        }
    }

    //메뉴리스트
    //삼항연산자는 표현식을 하나밖에 못쓰기떄문에 스프레드 연산자로 배열형식으로 넣어줘야함
    const menuList=[
        ...(logincheck?
        (cookie.userinfo.userid !==cid?[{
                 label:followcheck?"팔로우해제":"팔로우",onClick:()=>{
           followhandler(cid)
        },color:"black"
        }]:[
          {label:"삭제하기",onClick:()=>deletehandler(commentid),color:"red"},
        {label:"수정하기",onClick:()=>updatehandler(),color:"black"}
        ]):[]),
       {label:"유저페이지",onClick:()=>{navigate(`/userpage/${handleparam(cprofileid,cusername)}`)},color:"black"},
        {label:"텍스트복사",onClick:()=>{textcopy()},color:"black"}
      
    ]



    return (
        <Wrapper onClick={(e)=>e.stopPropagation()}>
            
       {menuList.map((list,key)=>{
        return (
            <Commentmenulist onClick={list.onClick} color={list.color} key={key}>
                {list.label}
            </Commentmenulist>
            
        )
       })}

        </Wrapper>
    )
}