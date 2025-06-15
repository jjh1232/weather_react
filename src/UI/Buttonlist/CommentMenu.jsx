import React from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import AuthCheck from "../../customhook/authCheck";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAxios from "../../customhook/CreateAxios";

const Wrapper=styled.div`
    background-color: gray;
    position: absolute;
    width: 150px;
    right: 5px;
    border: 1px solid black;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.9);  // 부드러운 그림자
  border-radius: 8px;        
  
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
    const {nickname,ismenu,commentid,noticeid,page}=props;
    const [cookie,setcookie,removecookie]=useCookies(["userinfo"])

    const logincheck=AuthCheck();
    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();

    const menuList=[
        {label:"팔로우",onClick:console.log("팔로우"),color:"black"},
        ...(logincheck ?[
            {label:"삭제",onClick:()=>deletehandler(commentid),color:"red"}
        ]:[])
    ]
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
    //


    return (
        <Wrapper onClick={(e)=>e.stopPropagation()}>
       {menuList.map((list)=>{
        return (
            <Commentmenulist onClick={list.onClick} color={list.color}>
                {list.label}
            </Commentmenulist>
            
        )
       })}

        </Wrapper>
    )
}