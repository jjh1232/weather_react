import React from "react";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import Reasonmodal from "./Reasonmodal";

/* 게시글 차단.
   껍데기는 Reasonmodal 이 갖고, 여기는 "차단은 이런 것" 만 정의한다.
   props(ismodal, noticeid, setisblock)는 예전과 그대로라 부르는 쪽은 바뀔 게 없다. */

const blocklist={
    spam:"스팸 및 광고",
    discomfort:"불쾌감을 주는 글",
    violent:"폭력적인 글",
    nsfw:"선정적인 글",
    nointerested:"관심 없는 글",
    baduser:"올바르지 않은 유저",
    noreason:"이유 없음",
    etc:"기타"
}

export default function Noticeblockmodal(props){
    const {ismodal,noticeid,setisblock}=props;

    return (
        <Reasonmodal
            tone="block"
            icon={faBan}
            title="이 게시글을 차단할까요?"
            description="차단하면 내 피드에서 이 글이 가려집니다. 언제든 ⋯ 메뉴에서 해제할 수 있어요."
            reasons={blocklist}
            endpoint="/noticeblock"
            invalidatekey="blockcheck"
            submitlabel="차단하기"
            successmessage="게시글을 차단했습니다"
            noticeid={noticeid}
            ismodal={ismodal}
            onDone={()=>{setisblock(true)}}
        />
    )
}
