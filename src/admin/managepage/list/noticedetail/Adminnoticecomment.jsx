import React, { useState } from "react";
import Commentform from "../../../../Noticepage/Commentform";
import Adminnoticereply from "./Adminnoticereply";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAxios from "../../../../customhook/CreateAxios";
import styled from "styled-components";
import { Button } from "../../../AdminUI";
import UserMenu from "../../../UserMenu";
import { useConfirm, useToast } from "../../../../UI/Feedback/FeedbackProvider";
import { Commentcard, Replyindent, Avatar, Commentbody, Commenthead,
         Nickname, Email, Time, Commentactions, Commenttext,
         Blockedtag, Blockeddim } from "./CommentUI";
import profileimage from "../../../../UI/profileimage";

//원글 댓글 + 그 아래 답글들
const Group=styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`
const Replyform=styled.div`
    margin-left: clamp(16px, 4%, 40px);
`

export default function Adminnoticecomment(props){
    const {comment,comments,noticeid,oncommentcreated}=props;
    const [isreply,setIsreply]=useState(false);
    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();
    const confirm=useConfirm();
    const toast=useToast();

    const deletecomment=useMutation({
        mutationFn:(data)=>{
            return axiosinstance.delete(`/admin/commentdelete/${data.commentid}`)
        },
        onSuccess:()=>{
            toast.success("댓글을 삭제했습니다.")
            queryclient.invalidateQueries({ queryKey: [`noticeData`] })
        },
        onError:(err)=>{ toast.error(err) }
    })

    const commentdelete=async(id)=>{
        const ok=await confirm({
            title:"이 댓글을 삭제할까요?",
            description:"답글이 달려 있으면 같이 사라집니다. 되돌릴 수 없습니다.",
            confirmText:"삭제",
            danger:true,
        })
        if(ok) deletecomment.mutate({commentid:id})
    }


    //운영자 차단 / 해제. 삭제와 달리 원문을 지우지 않아 되돌릴 수 있다.
    const blockmutation=useMutation({
        mutationFn:({id,block})=>{
            return axiosinstance.put(`/admin/comment${block?"block":"unblock"}/${id}`)
        },
        onSuccess:(res,variable)=>{
            toast.success(variable.block?"댓글을 차단했습니다.":"차단을 해제했습니다.")
            queryclient.invalidateQueries({ queryKey: [`noticeData`] })
        },
        onError:(err)=>{ toast.error(err) }
    })

    const toggleblock=async(target)=>{
        const block=!target.isblocked;
        const ok=await confirm(block?{
            title:"이 댓글을 차단할까요?",
            description:"본문 대신 \"운영자에 의해 차단된 댓글입니다\" 가 보입니다. 나중에 해제할 수 있습니다.",
            confirmText:"차단",
            danger:true,
        }:{
            title:"차단을 해제할까요?",
            description:"원래 내용이 다시 보이게 됩니다.",
            confirmText:"해제",
        })
        if(ok) blockmutation.mutate({id:target.id,block})
    }

    //이 댓글에 달린 답글만 추린다
    const replies=(comments||[]).filter((co)=>co.cnum===comment.id);

    return (
        <Group>
            <Commentcard>
                    <Avatar src={profileimage(comment.userprofile)} alt=""/>
                    <Commentbody>
                        <Commenthead>
                            {comment.isblocked && <Blockedtag>차단됨</Blockedtag>}
                            <UserMenu email={comment.username} nickname={comment.nickname}>
                                <Nickname>{comment.nickname}</Nickname>
                            </UserMenu>
                            <UserMenu email={comment.username} nickname={comment.nickname}>
                                <Email>{comment.username}</Email>
                            </UserMenu>
                            <Time>{comment.redtime}</Time>
                            <Commentactions>
                                {/* 예전엔 카드 전체에 onClick 이 걸려 있어서 수정·삭제를
                                    누를 때마다 답글창까지 같이 열렸다 닫혔다 했다.
                                    답글 열기는 버튼으로 분리한다. */}
                                <Button type="button" $small
                                    onClick={()=>{setIsreply(!isreply)}}>
                                    {isreply?"답글닫기":"답글"}
                                </Button>
                                <Button type="button" $small
                                    $variant={comment.isblocked?undefined:"danger"}
                                    onClick={()=>{toggleblock(comment)}}>
                                    {comment.isblocked?"차단해제":"차단"}
                                </Button>
                                <Button type="button" $small $variant="danger"
                                    onClick={()=>{commentdelete(comment.id)}}>삭제</Button>
                            </Commentactions>
                        </Commenthead>
                        {comment.isblocked
                            ? <Blockeddim><Commenttext>{comment.text}</Commenttext></Blockeddim>
                            : <Commenttext>{comment.text}</Commenttext>}
                    </Commentbody>
            </Commentcard>

            {isreply &&
                <Replyform>
                    <Commentform
                        noticenum={noticeid}
                        depth="1"
                        cnum={comment.id}
                        onCreated={oncommentcreated}/>
                </Replyform>}

            {/* 예전엔 전체 댓글을 돌면서 안 맞는 것도 빈 <div> 를 만들어
                답글 사이에 유령 여백이 생겼다. 먼저 걸러서 그린다. */}
            {replies.map((co)=>(
                <Replyindent key={co.id}>
                    <Adminnoticereply comment={co} commentdelete={commentdelete}
                        toggleblock={toggleblock}/>
                </Replyindent>
            ))}
        </Group>
    )
}
