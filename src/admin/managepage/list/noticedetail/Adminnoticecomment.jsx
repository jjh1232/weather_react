import React, { useState } from "react";
import Commentform from "../../../../Noticepage/Commentform";
import Adminnoticereply from "./Adminnoticereply";
import AdminNoticecommentupdate from "./Adminnoticecommentupdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAxios from "../../../../customhook/CreateAxios";
import styled from "styled-components";

const Wrapper=styled.div`
    position: relative;
    border: 1px solid blue;
    width: 1000px;
    height: 58px;
    max-height: fit-content;
   
    
    
`

const Firstline=styled.div`
    position: relative;
   border: 1px solid yellow;
   bottom: 60px;
   height: 20px;
   left:6.5%;
   width: 93%;
   
`

const Profileimg=styled.img`
    position: relative;
    display: inline-block;
    width: 60px;
    height: 57px;
    border: 1px solid black;
`
const NickCss=styled.h3`
position: relative;
display: inline;
margin-left:3px;
margin-right: 10px;
/*
    position: relative;
    display: inline-block;
    
    margin-left:3px;
    margin-right: 10px;
*/
`

const Usernamecss=styled.h5`
position: relative;
display: inline;
color: gray;
/*
 position: relative;
 display: inline-block;
 
 color: gray;
 

*/
`

const Textcss=styled.div`
    position: relative;
    left: 65px;
    bottom: 60px;
    min-height: 32px;
    border: 1px solid green;
    width: 930px;
    margin:0px;
    max-height: fit-content;
    white-space: pre-line;
    
`
const Timecss=styled.div`
position: relative;
display: inline;
float: right;
/*
    position: relative;
    float: right;
    width: fit-content;
    bottom:127px;
    right: 5px;
*/
    
`
const Updatediv=styled.div`
position: relative;
display: inline;
float: right;

/*
position: relative;

bottom:106px;
width: fit-content;
float: right;
  */  
`

const RepleWrapper=styled.div`
    position: relative;
    //border: 1px solid black;
    left: 50px;
    width:950px;
    `

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
        :<Wrapper onClick={replyhandler}>
        
      
       
        <Profileimg src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile} />
        <Firstline>
            <NickCss>{comment.nickname}</NickCss>
            <Usernamecss>{comment.username}</Usernamecss>
        
           


            <Updatediv>
        <button onClick={()=>{setIscoupdate(!iscoupdate)}}>댓글수정</button>
        <button onClick={()=>{commentdelete(comment.id)}}>댓글삭제</button>
        </Updatediv>
        <Timecss>
        {comment.redtime}
        </Timecss>
        </Firstline>

        <Textcss>
       {comment.text}
       </Textcss>
                               
       
    
        </Wrapper>
        }
        
        {isreply&&<><Commentform 
        noticenum={noticeid}
        depth="1"
        cnum={comment.id}
        commentsubmit={commentcreate}
        /></>}

        {comments.map((co)=>{
            return (
                <RepleWrapper>
                {co.cnum===comment.id&&
                
            
                 <Adminnoticereply comment={co} commentdelete={commentdelete}/>
                                            
                
                }
                </RepleWrapper>
            )
            
        })
            
        }
        

        </>
    )
}