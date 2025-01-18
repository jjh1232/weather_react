import React, { useState } from "react";
import Commentform from "../../../../Noticepage/Commentform";
import Adminnoticereply from "./Adminnoticereply";
import AdminNoticecommentupdate from "./Adminnoticecommentupdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAxios from "../../../../customhook/CreateAxios";

export default function Adminnoticecomment(props){
    const {comment,comments,noticeid,commentcreate}=props;
    const [isreply,setIsreply]=useState(false);
    const [iscoupdate,setIscoupdate]=useState(false)
    const axiosinstance=CreateAxios();
    const replyhandler=()=>{
        setIsreply(!isreply)
    }
    const queryclient=useQueryClient();

    const deletecomment=useMutation({
        mutationFn:(data)=>{
            return axiosinstance.delete(`/admin/commentdelete/${data.commentid}`)
        },
        onSuccess:()=>{
            queryclient.invalidateQueries([`noticeData`])
        }
    })

    const commentdelete=(id)=>{
        if(confirm("삭제하시겠습니까?")){
            deletecomment.mutate({commentid:id})
        }
    }
   
    return (
        <>{iscoupdate?
        <><AdminNoticecommentupdate comment={comment} setisupdate={setIscoupdate}/>
        
        
        </>
        :<>
        <div onClick={replyhandler}>
        {comment.nickname}<br/>
        {comment.username}
       
       <br/>
       {comment.text}
        <br/>
        {comment.redtime}
        <br/>
        
        </div>
        <button onClick={()=>{setIscoupdate(!iscoupdate)}}>댓글수정</button>
        <button onClick={()=>{commentdelete(comment.id)}}>댓글삭제</button><br/>
        </>
        }
        
        {isreply&&<><Commentform 
        noticenum={noticeid}
        depth="1"
        cnum={comment.id}
        commentsubmit={commentcreate}
        /></>}
        {comments.map((co)=>{
            return (
                <>
                {co.cnum===comment.id&&
                <>
            
                 <Adminnoticereply comment={co} commentdelete={commentdelete}/>
                                            
                </>
                }
                </>
            )
            
        })
            
        }
        

        </>
    )
}