import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Commentform from "../Noticepage/Commentform";

import styled from "styled-components";

import Replycomment from "../UI/Replycomment";
import Commentupdateitem from "./noticeformlist/Commentupdateitem";
import Commentview from "./noticeformlist/Commentview";

/* 댓글 한 칸.
   줄 전체가 클릭 영역(누르면 답글창이 열린다)이라 호버 배경으로 그걸 알려준다. */
const Wrapper=styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 12px 12px 10px;
  border-bottom: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusSm};
  cursor: ${(props)=>props.$editing?"default":"pointer"};
  transition: background ${(props)=>props.theme.transition};

  &:hover {
    background: ${(props)=>props.$editing?"transparent":props.theme.surfaceHover};
  }
`

function Commentlistitem(props){

  const {data,noticeid, page}=props
  const [replyclick,Setreplyclick]=useState(false);
  
  const [isupdate,Setisupdate]=useState(false) 
  
  
  
  

 

  return (
    <React.Fragment>
      {isupdate?
      <Wrapper className="isupdate" $editing>
        <Commentupdateitem data={data} Setisupdate={Setisupdate} noticeid={noticeid} page={page}/>
        </Wrapper>
      :<Wrapper  onClick={()=>{
        Setreplyclick(!replyclick)
    }}>
    <Commentview data={data} Setisupdate={Setisupdate} noticeid={noticeid} page={page} />
      
</Wrapper>
}
    {replyclick?
          <Commentform 
           
           noticenum={noticeid}
           
           depth="1"
           cnum={data.id}
           page={page}
             />
             :""}

          {data.childs&&data.childs.map((coment,key)=>{
           
            return (
    <Replycomment parentid={coment.id} 
                     noticeid={noticeid}
                   page={page}
                comment={coment}
                 key={key}
                 />
            )
          }

          )
     
          }
    </React.Fragment>


  )
}
export default Commentlistitem;
