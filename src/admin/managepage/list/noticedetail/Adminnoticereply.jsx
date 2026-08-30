import React from "react";
import { Button } from "../../../AdminUI";
import UserMenu from "../../../UserMenu";
import { useConfirm } from "../../../../UI/Feedback/FeedbackProvider";
import { Commentcard, Avatar, Commentbody, Commenthead, Nickname,
         Email, Time, Commentactions, Commenttext, Replytag,
         Blockedtag, Blockeddim } from "./CommentUI";
import profileimage from "../../../../UI/profileimage";

//답글 한 개. 모양은 CommentUI 가 갖고, 여기는 내용만 채운다.
export default function Adminnoticereply(props){
    const {comment,commentdelete,toggleblock}=props;
    const confirm=useConfirm();

    const remove=async()=>{
        const ok=await confirm({
            title:"이 답글을 삭제할까요?",
            description:"삭제하면 되돌릴 수 없습니다.",
            confirmText:"삭제",
            danger:true,
        })
        if(ok) commentdelete(comment.id)
    }

    return (
        <Commentcard $reply>
            <Avatar src={profileimage(comment.userprofile)} alt=""/>
            <Commentbody>
                <Commenthead>
                    <Replytag>답글</Replytag>
                    {comment.isblocked && <Blockedtag>차단됨</Blockedtag>}
                    <UserMenu email={comment.username} nickname={comment.nickname}>
                        <Nickname>{comment.nickname}</Nickname>
                    </UserMenu>
                    <UserMenu email={comment.username} nickname={comment.nickname}>
                        <Email>{comment.username}</Email>
                    </UserMenu>
                    <Time>{comment.redtime}</Time>
                    <Commentactions>
                        <Button type="button" $small
                            $variant={comment.isblocked?undefined:"danger"}
                            onClick={()=>{toggleblock(comment)}}>
                            {comment.isblocked?"차단해제":"차단"}
                        </Button>
                        <Button type="button" $small $variant="danger"
                            onClick={remove}>삭제</Button>
                    </Commentactions>
                </Commenthead>
                {comment.isblocked
                    ? <Blockeddim><Commenttext>{comment.text}</Commenttext></Blockeddim>
                    : <Commenttext>{comment.text}</Commenttext>}
            </Commentbody>
        </Commentcard>
    )
}
