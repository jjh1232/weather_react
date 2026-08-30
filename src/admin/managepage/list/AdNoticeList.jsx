import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import AdminNoticeupdate from "../../../customhook/Admintools/AdminNoticeupdate";
import Imagebook from "../../../customhook/Imagebook";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faImages} from "@fortawesome/free-solid-svg-icons"
import {faComment} from "@fortawesome/free-regular-svg-icons"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import AdminDeclesdata from "../../../customhook/Admintools/AdminDeclesdata";
import { useConfirm } from "../../../UI/Feedback/FeedbackProvider";
import { Tr, Td, Button, Iconbutton, Countcell, Mono, Clamp, Linkcell } from "../../AdminUI";
import UserMenu from "../../UserMenu";
import profileimage from "../../../UI/profileimage";

//목록의 작은 프로필. 예전엔 width/height 100% 라 칸 크기에 따라 제멋대로 늘어났다.
const Profile=styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
export default function AdNoticeList(props) {

    const {data,deletemethod}=props;
    const navigate=useNavigate();
    const [isupdate,setIsupdate]=useState(false);
    const [isimagebook,setIsimagebook]=useState(false);
    const [isdecledata,setIsdecledata]=useState(false);
    const confirm=useConfirm();   //window.confirm 을 가린다. 여기서는 이쪽이 맞다.

    const commentsearch=(noticenum)=>{
        navigate(`/admin/comment?page=1&option=noticenum&keyword=${noticenum}`)
    }

    //window.confirm 과 달리 확인창은 실행을 멈추지 않는다. 답을 await 로 받는다.
    const deletes=async(num)=>{
        const ok=await confirm({
            title:"이 게시글을 삭제할까요?",
            description:"삭제하면 되돌릴 수 없습니다.",
            confirmText:"삭제",
            danger:true,
        })
        if(ok) deletemethod(num)
    }
    const noticedetail=(noticeid)=>{
        navigate(`/admin/notice/detail/${noticeid}`)
    }

    const filecount=data.detachfiles?.length||0;

    //모달들은 전부 position:fixed 다. <table> 안에 두면 마크업이 깨지므로 body 로 포털한다.
    const overlays=(<>
        {isupdate && <AdminNoticeupdate noticeid={data.num} setisupdate={setIsupdate}/>}
        {isimagebook &&
            <Imagebook images={data.detachfiles}
                setisimage={setIsimagebook}
                userdata={{username:data.username,nickname:data.nickname,profileimg:data.userprofile}}
                noticedata={{title:data.title,likes:data.likes,red:data.red}}
            />}
        {isdecledata && <AdminDeclesdata noticeid={data.num} isdecles={setIsdecledata}/>}
    </>)

    return (<>
        {(isupdate||isimagebook||isdecledata) && ReactDOM.createPortal(overlays,document.body)}

        <Tr>
            <Td $align="center"><Mono>{data.num}</Mono></Td>
            <Td $align="center">
                <Profile src={profileimage(data.userprofile)} alt=""/>
            </Td>
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

            <Td style={{minWidth:"240px",maxWidth:"420px"}}>
                <Linkcell onClick={()=>noticedetail(data.num)}>
                    <Clamp $lines={2}>{data.title}</Clamp>
                </Linkcell>
            </Td>

            <Td><Mono>{data.red}</Mono></Td>
            <Td $align="center">{data.likes}</Td>

            <Td $align="center">
                <Countcell>
                    {data.commentcount}
                    <Iconbutton type="button" title="이 글의 댓글 보기"
                        onClick={()=>commentsearch(data.num)}>
                        <FontAwesomeIcon icon={faComment}/>
                    </Iconbutton>
                </Countcell>
            </Td>

            <Td $align="center">
                <Countcell>
                    {filecount}
                    {filecount>0 &&
                    <Iconbutton type="button" title="이미지 보기"
                        onClick={()=>setIsimagebook(!isimagebook)}>
                        <FontAwesomeIcon icon={faImages}/>
                    </Iconbutton>}
                </Countcell>
            </Td>

            <Td $align="center">
                <Countcell>
                    {data.declaircount}
                    <Iconbutton type="button" title="신고 내역 보기"
                        onClick={()=>setIsdecledata(!isdecledata)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </Iconbutton>
                </Countcell>
            </Td>

            <Td $align="center">
                <Countcell>
                    <Button type="button" $small onClick={()=>setIsupdate(true)}>수정</Button>
                    <Button type="button" $small $variant="danger"
                        onClick={()=>deletes(data.num)}>삭제</Button>
                </Countcell>
            </Td>
        </Tr>
    </>)
}
