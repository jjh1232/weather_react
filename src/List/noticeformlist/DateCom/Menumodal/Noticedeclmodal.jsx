import React from "react";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import Reasonmodal from "./Reasonmodal";

/* 게시글 신고.
   차단과 달리 운영자에게 전달되는 동작이라 tone 을 warning 으로 둔다. */

const declelist={
    spam:"스팸 및 불법 광고",
    discomfort:"불쾌감을 주는 글",
    violent:"폭력적인 글",
    nsfw:"선정적인 글",
    baduser:"올바르지 않은 유저",
    etc:"기타"
}

export default function Noticedeclmodal(props){
    const {ismodal,noticeid}=props;

    return (
        <Reasonmodal
            tone="report"
            icon={faFlag}
            title="이 게시글을 신고할까요?"
            description="신고 내용은 운영자에게 전달되어 검토됩니다. 사유를 골라주세요."
            reasons={declelist}
            endpoint="/noticedecle"
            invalidatekey="declecheck"
            submitlabel="신고하기"
            successmessage="게시글을 신고했습니다"
            noticeid={noticeid}
            ismodal={ismodal}
        />
    )
}
