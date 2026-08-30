import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Commentlistitem from "./Commentlistitem";
import Commentform from "../Noticepage/Commentform";
import Replycomment from "../UI/Replycomment";
import CommentTree from "./CommentTree";

const Listwrapper=styled.div`
  display: flex;
  flex-direction: column;
`
/* 댓글이 하나도 없을 때 - 그냥 텍스트 한 줄이면 빈 화면처럼 보여서
   높이를 가진 안내 영역으로 만든다. */
const Emptydiv=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 34px 16px;
  color: ${(props)=>props.theme.textFaint};
  font-size: 14px;
`
const Emptysub=styled.span`
  font-size: 12.5px;
  color: ${(props)=>props.theme.textFaint};
  opacity: 0.8;
`

function Commentlist(props){

  const {comments,noticeid,page}=props
 
  
if (!comments || comments.length===0){
  return (
    <Emptydiv>
      <span>아직 댓글이 없습니다</span>
      <Emptysub>첫 번째 댓글을 남겨보세요</Emptysub>
    </Emptydiv>
  )
}
     
  return (
    <Listwrapper>
              {comments&&comments.map((comment,key)=>{
                return(
                  
                   <React.Fragment key={key}>
                 <Commentlistitem 

                  key={key}
                  data={comment}
                  noticeid={noticeid}
                  page={page}
               
                 />

                 </React.Fragment>
            
                )
              })}
    </Listwrapper>
  )
}
export default Commentlist;
