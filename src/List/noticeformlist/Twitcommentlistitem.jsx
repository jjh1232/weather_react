import React, { useState } from "react";
import Commentform from "../../Noticepage/Commentform";
import styled from "styled-components";
import Replycomment from "../../UI/Replycomment";


export default function Twitcommentlistitem(props)
{
const {comment,noticeid,commentsubmit} =props;
const [isreple,setIsreple]=useState(false);
    

return (
    <>
    ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    <br/>
    <div onClick={()=>{
        setIsreple(!isreple)
    }}> 
    {comment.nickname}@{comment.username}

    
    <br/>
    {comment.text}
    <br/>
    {comment.redtime}
    <br/>
    </div>
     
    {isreple&&<>
        <Commentform 
        noticenum={noticeid}
        depth="1"
        cnum={comment.id}
        commentsubmit={commentsubmit}
        />
       
</>
    }
    
    </>
)
}
