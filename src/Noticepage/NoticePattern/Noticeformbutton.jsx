import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Buttonlist=styled.div`
width: 100%;
border:1px solid black;
display: flex;

`
const CreateButton=styled.div`
    //display: inline-flex;
  align-items: center;
  outline: none;
  border: 1px solid black;
  border-radius: 4px;
  white-space: nowrap;
  color: ${(props)=>{props.theme.text}};
  font-weight: bold;
  cursor: pointer;
  padding: 0 1rem;
  height: 2.25rem;
  font-size: 1rem;
  
  transition: background 0.2s;
  /* 기본 그림자 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  &:hover {
   color: #339af0;
   box-shadow: 0 4px 16px rgba(0,0,0,0.15);
   background-color: gray;
  }
  &:active {
    color: #1c7ed6;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
`
export default function Noticeformbutton(){

    const navigate=useNavigate();


    return (
        
        <Buttonlist>

        
            <CreateButton onClick={()=>{navigate(`/notice/twitform`)
window.location.reload();

            }}>
                일반게시글
            </CreateButton >
            <CreateButton  onClick={()=>{navigate(`/notice/twitform/liked`)
              window.location.reload();
            }}>
                좋아요 한게시글
            </CreateButton >
             <CreateButton  
            >
                이미지
            </CreateButton >
            </Buttonlist>
        
    )

}