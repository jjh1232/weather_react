import React, { useState } from "react";
import Commentform from "../../Noticepage/Commentform";
import styled from "styled-components";
import Replycomment from "../../UI/Replycomment";

const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
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
        <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%"}}
  
                />
                
     </Profileview>
    {comment.nickname}님 <br/>
    @{comment.username}

    
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
