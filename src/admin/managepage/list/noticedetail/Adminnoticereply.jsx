import React, { useState } from "react";
import AdminNoticecommentupdate from "./Adminnoticecommentupdate";


export default function Adminnoticereply(props){
    const {comment,commentdelete}=props;
    const [isupdate,setIsupdate]=useState();

    const deletecomment=(id)=>{
    
      commentdelete(id)
      
    }

    return (
      
              <>
              {isupdate?<>
              <AdminNoticecommentupdate comment={comment} setisupdate={setIsupdate}/>
              </>:<>
              대댓글
               {comment.nickname}<br/>
              {comment.username}
             
             <br/>
             {comment.text}
              <br/>
              {comment.redtime}
              <br/>
              <button onClick={()=>{setIsupdate(!isupdate)}} >댓글수정</button>
            <button onClick={()=>{deletecomment(comment.id)}} >댓글삭제</button>
            <br/>
              </>}
          
              </>
            )

    
    
}