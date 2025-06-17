import React from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import AuthCheck from "../../customhook/authCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreateAxios from "../../customhook/CreateAxios";
import { use } from "react";
import { useNavigate } from "react-router-dom";

const Wrapper=styled.div`
    background-color: gray;
    position: absolute;
    width: 150px;
    right: 5px;
    border: 1px solid black;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.9);  // 부드러운 그림자
  border-radius: 8px;        
    z-index: 10;
    &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25); // 호버 시 그림자 강조
  }
`
const Commentmenulist=styled.div`
    width: 100%;
    color:${(props)=>props.color};
    cursor: pointer;
`

export default function CommentMenu(props){
    const {nickname,ismenu,isupdate,commentid,noticeid,page,cid,cusername,textcopy}=props;
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

             const stringnoticeid=String(noticeid);
            queryclient.invalidateQueries(["comments",stringnoticeid,page])

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
            alert("팔로우성공")
            queryclient.invalidateQueries(["followcheck",cookie.userinfo.userid,cid])
            queryclient.invalidateQueries(["followlistdata",cookie.userinfo.userid])
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
            queryclient.invalidateQueries(["followcheck",cookie.userinfo.userid,cid])
             queryclient.invalidateQueries(["followlistdata",cookie.userinfo.userid])
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
       {label:"유저페이지",onClick:()=>{navigate(`/userpage/${cusername}`)},color:"black"},
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