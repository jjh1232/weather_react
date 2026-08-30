import React from "react";
import CreateAxios from "../../../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Tr, Td, Button, Badge, Countcell, Mono, Clamp, Linkcell } from "../../AdminUI";
import { useConfirm, useToast } from "../../../UI/Feedback/FeedbackProvider";

export default function Chatroomlist(props){

    const queryclient=useQueryClient();
    const {data}=props;
    const axiosinstance=CreateAxios();
    const navigate=useNavigate();
    const confirm=useConfirm();
    const toast=useToast();

    /* 예전 주석에 "이 화면엔 확인창 provider 가 없다"고 적혀 있었지만,
       FeedbackProvider 는 App.js 에서 라우트 전체를 감싸고 있어 여기서도 쓸 수 있다. */
    const deletechatroom=async(roomid)=>{
        const ok=await confirm({
            title:"이 채팅방을 삭제할까요?",
            description:"방에 오간 대화가 모두 사라집니다. 되돌릴 수 없습니다.",
            confirmText:"삭제",
            danger:true,
        })
        if(!ok) return;

        axiosinstance.delete(`/admin/roomdelete/${roomid}`)
        .then((res)=>{
            toast.success(res.data||"삭제되었습니다.")
            queryclient.invalidateQueries({ queryKey: ["adminchatroomlist"] });
        }).catch((err)=>{
            toast.error(err)
        })
    }

    const members=data.namelist||[];

    return (
        <Tr>
            <Td $align="center"><Mono>{data.roomid}</Mono></Td>

            <Td style={{minWidth:"140px"}}>
                <Linkcell onClick={()=>navigate(`/admin/room/${data.roomid}`)}>
                    <Clamp $lines={1}>{data.roomname}</Clamp>
                </Linkcell>
            </Td>

            {/* 예전엔 닉네임을 쉼표로 이어붙여 한 줄로 흘렸다. 뱃지로 끊어야 눈에 들어온다 */}
            <Td style={{minWidth:"180px",maxWidth:"280px"}}>
                <Countcell style={{flexWrap:"wrap",gap:"4px"}}>
                    {members.slice(0,4).map((name)=>(
                        <Badge key={name.id||name.membernickname}>{name.membernickname}</Badge>
                    ))}
                    {members.length>4 && <Badge $tone="accent">+{members.length-4}</Badge>}
                </Countcell>
            </Td>

            <Td style={{minWidth:"200px",maxWidth:"360px"}}>
                <Linkcell onClick={()=>navigate(`/admin/room/${data.roomid}`)}>
                    <Clamp $lines={2}>{data.latelychat}</Clamp>
                </Linkcell>
            </Td>

            <Td $align="center">{data.chatnum}</Td>
            <Td><Mono>{data.lastchatred}</Mono></Td>
            <Td><Mono>{data.red}</Mono></Td>

            <Td $align="center">
                <Countcell>
                    <Button type="button" $small
                        onClick={()=>navigate(`/admin/room/${data.roomid}`)}>보기</Button>
                    <Button type="button" $small $variant="danger"
                        onClick={()=>deletechatroom(data.roomid)}>삭제</Button>
                </Countcell>
            </Td>
        </Tr>
    )
}
