import React, { useState } from "react";
import ReactDOM from "react-dom";
import AdminUpdateform from "../../../customhook/Admintools/AdminUpdateform";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-regular-svg-icons"
import {faComments} from "@fortawesome/free-regular-svg-icons"
import {faSheetPlastic} from "@fortawesome/free-solid-svg-icons"
import { Tr, Td, Button, Iconbutton, Badge, Countcell, Mono, Clamp } from "../../AdminUI";
import UserMenu from "../../UserMenu";

//회원 한 줄.
//예전엔 이 컴포넌트가 <tbody> 를 통째로 만들어서 회원 수만큼 tbody 가 생겼고,
//수정 모달(div)이 <table> 안에 형제로 끼어 있어 마크업이 깨졌다.
//지금은 <tr> 하나만 돌려주고, 모달은 body 로 포털한다(모달은 position:fixed 다).
export default function Membermanagelist(props){
    const {data,deletemember}=props

    const [isupdate,setIsupdate]=useState(false);
    const navigate=useNavigate();

    const noticesearch=(username)=>{
        navigate(`/admin/notice?page=1&option=email&keyword=${username}`)
    }
    const commentsearch=(username)=>{
        navigate(`/admin/comment?page=1&option=email&keyword=${username}`)
    }
    const roomsearch=(username)=>{
        navigate(`/admin/chatroom?page=1&option=email&keyword=${username}`)
    }

    const userhistoryon=(username)=>{
        window.open(`/admin/loginhistory?username=${username}`,"로그인기록",
            "noopener,noreferreor,location=no,menubar=no,toolbar=no,scrollbars=no,width=600px,height=500px")
    }

    return(<>
        {isupdate && ReactDOM.createPortal(
            <AdminUpdateform setIsupdate={setIsupdate} currentdata={data}/>,
            document.body)}

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

            <Td $align="center"><Badge>{data.provider||"local"}</Badge></Td>
            <Td $align="center">
                <Badge $tone={data.role==="ROLE_Admin"?"accent":undefined}>
                    {data.role==="ROLE_Admin"?"관리자":"회원"}
                </Badge>
            </Td>
            <Td><Clamp $lines={1}>{data.homeaddress?.juso}</Clamp></Td>

            <Td $align="center">
                <Countcell>
                    {data.usernotice}
                    <Iconbutton type="button" title="이 회원의 게시글 보기"
                        onClick={()=>noticesearch(data.username)}>
                        <FontAwesomeIcon icon={faSheetPlastic}/>
                    </Iconbutton>
                </Countcell>
            </Td>
            <Td $align="center">
                <Countcell>
                    {data.usercomments}
                    <Iconbutton type="button" title="이 회원의 댓글 보기"
                        onClick={()=>commentsearch(data.username)}>
                        <FontAwesomeIcon icon={faComment}/>
                    </Iconbutton>
                </Countcell>
            </Td>
            <Td $align="center">
                <Countcell>
                    {data.userchatroom}
                    <Iconbutton type="button" title="이 회원의 채팅방 보기"
                        onClick={()=>roomsearch(data.username)}>
                        <FontAwesomeIcon icon={faComments}/>
                    </Iconbutton>
                </Countcell>
            </Td>

            <Td><Mono>{data.red}</Mono></Td>

            <Td $align="center">
                <Countcell>
                    <Button type="button" $small
                        onClick={()=>userhistoryon(data.username)}>기록</Button>
                    <Button type="button" $small
                        onClick={()=>setIsupdate(true)}>수정</Button>
                    <Button type="button" $small $variant="danger"
                        onClick={()=>deletemember(data.id)}>삭제</Button>
                </Countcell>
            </Td>
        </Tr>
    </>)
}
