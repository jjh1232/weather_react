import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import CreateAxios from "../../../../customhook/CreateAxios";

export default function AdminNoticecommentupdate(props){
    const {comment,setisupdate}=props;
    const axiosintance=CreateAxios();
    const [newtext,setNewtext]=useState(comment.text);
    const queryclient=useQueryClient();

    const commentupdate=useMutation({
        mutationFn:(data)=>{
            return axiosintance.put(`/admin/commentupdate/${comment.id}`,
                {
                    noticeid:comment.id,
                    depth:comment.depth,
                    cnum:comment.cnum,
                    username:comment.username,
                    nickname:comment.nickname,
                    text:newtext
                }
            )
        },
        onSuccess:()=>{
            setisupdate(false)
            queryclient.invalidateQueries([`noticeData`])
        }
    })
    

    return (
        <>
        
      <div>
      {comment.nickname}<br/>
      {comment.username}
      <br/>
        <input type="text" defaultValue={newtext} onChange={(e)=>{setNewtext(e.target.value)}}/>
        
       
       <br/>
      
        <br/>
        {comment.redtime}
        <br/>
        
        </div>
        <button onClick={()=>{commentupdate.mutate()}}>수정완료</button>
        <button onClick={()=>{setisupdate(false)}}>수정취소</button><br/>
        </>
    )
}