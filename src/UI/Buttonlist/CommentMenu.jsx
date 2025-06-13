import React from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import AuthCheck from "../../customhook/authCheck";

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
`

export default function CommentMenu(props){
    const {nickname,ismenu}=props;
    const [cookie,setcookie,removecookie]=useCookies(["userinfo"])

    const logincheck=AuthCheck();

    const menuList=[
        {label:"팔로우",onClick:deletemethod},
        ...(logincheck ?[
            {label:"삭제",onClick:deletemethod}
        ]:[])
    ]

    const deletemethod=()=>{

    }


    return (
        <Wrapper>
            <div>
삭제
            </div>
            
                <div>
팔로우
            </div>
                <div>
유저차단
            </div>

        </Wrapper>
    )
}