import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Tr, Td, Button, Iconbutton, Badge, Countcell, Mono, Clamp } from "../../AdminUI";
import UserMenu from "../../UserMenu";
import { useConfirm, useToast } from "../../../UI/Feedback/FeedbackProvider";
import CreateAxios from "../../../customhook/CreateAxios";

//댓글 한 줄.
//원글/답글 구분을 예전엔 줄 배경을 통째로 노랑·하늘색으로 칠해서 표시했다.
//글자가 안 읽히고 다크모드에선 더 심해서, 뱃지 하나로 바꿨다.
export default function CommentList(props){
    const {data,deletemethod,onchanged}=props

    const navigate=useNavigate();
    const confirm=useConfirm();
    const toast=useToast();
    const axiosinstance=CreateAxios();

    /* 이 목록은 react-query 가 아니라 부모(Commentmanage)의 commentget() 으로
       다시 받아온다. 그래서 invalidateQueries 가 아니라 onchanged 를 부른다. */
    const toggleblock=async()=>{
        const block=!data.isblocked;
        const ok=await confirm(block?{
            title:"이 댓글을 차단할까요?",
            description:'본문 대신 "운영자에 의해 차단된 댓글입니다" 가 보입니다. 나중에 해제할 수 있습니다.',
            confirmText:"차단",
            danger:true,
        }:{
            title:"차단을 해제할까요?",
            description:"원래 내용이 다시 보이게 됩니다.",
            confirmText:"해제",
        })
        if(!ok) return;

        axiosinstance.put(`/admin/comment${block?"block":"unblock"}/${data.id}`)
        .then(()=>{
            toast.success(block?"댓글을 차단했습니다.":"차단을 해제했습니다.")
            if(onchanged) onchanged()
        }).catch((err)=>{ toast.error(err) })
    }

    const isreply=data.depth===1;

    const deletecom=async(commentid)=>{
        const ok=await confirm({
            title:"이 댓글을 삭제할까요?",
            description:"삭제하면 되돌릴 수 없습니다. 답글이 달려 있으면 같이 사라집니다.",
            confirmText:"삭제",
            danger:true,
        })
        if(ok) deletemethod(commentid)
    }

    return(
        <Tr>
            <Td $align="center"><Mono>{data.id}</Mono></Td>
            <Td>
                <UserMenu email={data.username} nickname={data.nickname}>
                    <Clamp as="span" $lines={1}>{data.username}</Clamp>
                </UserMenu>
            </Td>
            <Td>
                <UserMenu email={data.username} nickname={data.nickname}>
                    <Clamp as="span" $lines={1}>{data.nickname}</Clamp>
                </UserMenu>
            </Td>

            <Td style={{minWidth:"260px",maxWidth:"460px"}}>
                <Countcell>
                    {isreply && <Badge $tone="accent">답글</Badge>}
                    {data.isblocked && <Badge>차단됨</Badge>}
                </Countcell>
                {/* 관리자에게는 원문을 그대로 보여준다(그래야 판단이 된다).
                    차단된 건 흐리게 + 뱃지로 구분한다. */}
                <Clamp $lines={2} style={data.isblocked?{opacity:.55}:undefined}>
                    {data.text}
                </Clamp>
            </Td>

            <Td $align="center">
                <Countcell>
                    {data.noticenum}번
                    <Iconbutton type="button" title="게시글로 이동"
                        onClick={()=>navigate(`/admin/notice/detail/${data.noticenum}`)}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>
                    </Iconbutton>
                </Countcell>
            </Td>

            <Td><Mono>{data.redtime}</Mono></Td>

            <Td $align="center">
                <Countcell>
                    <Button type="button" $small
                        $variant={data.isblocked?undefined:"danger"}
                        onClick={toggleblock}>{data.isblocked?"차단해제":"차단"}</Button>
                    <Button type="button" $small $variant="danger"
                        onClick={()=>deletecom(data.id)}>삭제</Button>
                </Countcell>
            </Td>
        </Tr>
    )
}
