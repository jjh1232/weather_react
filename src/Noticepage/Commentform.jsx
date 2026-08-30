import axios from "axios";
import React, { useRef } from "react";
import { useCookies } from "react-cookie";
import { useState } from "react";
import AuthCheck from "../customhook/authCheck";
import CreateAxios from "../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import profileimage from "../UI/profileimage";

/* ─────────────────────────────────────────────────────────────
   댓글 작성창
   - 예전엔 border:1px solid black 로 칸을 나눴는데, 테마(다크모드)에서
     검은 선이 그대로 남아 보기 안 좋아서 전부 theme.border 로 바꿨다.
   - 입력칸 자체엔 테두리를 주지 않고 "카드 한 장"에 포커스 링을 준다.
   ───────────────────────────────────────────────────────────── */

const Wrapper=styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  padding: ${(props)=>props.$reply?"10px 12px":"12px 14px"};
  background: ${(props)=>props.theme.surface};
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radius};
  box-shadow: ${(props)=>props.theme.shadowSm};
  word-break: break-word;
  transition: border-color ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition};

  /* 안쪽 textarea 가 포커스되면 카드 전체가 살아난다 */
  &:focus-within {
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
  }

  /* 대댓글 작성창은 한 단계 들여쓰고 톤을 낮춘다 */
  ${(props)=>props.$reply&&`
    margin: 6px 0 6px 44px;
    width: auto;
  `}
`
const Imgdiv=styled.div`
  flex-shrink: 0;
`
const Img=styled.img`
  width: ${(props)=>props.$reply?"32px":"38px"};
  height: ${(props)=>props.$reply?"32px":"38px"};
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 1px solid ${(props)=>props.theme.border};
  background: ${(props)=>props.theme.surfaceAlt};
`

const Maindiv=styled.div`
  flex: 1;
  min-width: 0;      // flex 자식이 textarea 를 밀어내지 않게
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const Headerdiv=styled.div`
  display: flex;
  align-items: baseline;
`
const Username=styled.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${(props)=>props.theme.textMuted};
`

const Commentmaindiv=styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const Commentinput=styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;         // 높이를 스크립트로 늘리므로 스크롤바는 숨긴다
  background: transparent;
  color: ${(props)=>props.theme.text};
  font-size: ${(props)=>props.$reply?"14px":"15px"};
  line-height: 1.6;
  padding: 2px 0;

  &::placeholder {
    color: ${(props)=>props.theme.textFaint};
  }
`

/* 버튼 줄 - 오른쪽 정렬 */
const Actiondiv=styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid ${(props)=>props.theme.border};
  padding-top: 8px;
`
const Countdiv=styled.span`
  margin-right: auto;
  font-size: 12px;
  color: ${(props)=>props.theme.textFaint};
`
const CreateButton=styled.button`
  border: none;
  border-radius: ${(props)=>props.theme.radiusPill};
  padding: ${(props)=>props.$reply?"5px 14px":"7px 18px"};
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #fff;
  background: ${(props)=>props.theme.accent};
  transition: background ${(props)=>props.theme.transition},
              opacity ${(props)=>props.theme.transition};

  &:hover:not(:disabled) { background: ${(props)=>props.theme.accentHover}; }
  &:active:not(:disabled) { background: ${(props)=>props.theme.accentActive}; }

  /* 내용이 없으면 눌러도 빈 댓글만 생기므로 아예 막는다 */
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

/* 비로그인 안내 - 입력처럼 보이지 않게 점선 패널로 둔다 */
const Nologinwrapper=styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border: 1px dashed ${(props)=>props.theme.borderStrong};
  border-radius: ${(props)=>props.theme.radius};
  background: ${(props)=>props.theme.surfaceAlt};
  color: ${(props)=>props.theme.textMuted};
  font-size: 14px;
`
const Nologinbutton=styled.button`
  margin-left: auto;
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusPill};
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props)=>props.theme.textFaint};
  background: ${(props)=>props.theme.surface};
  cursor: not-allowed;
`


function Commentform(props){
 //,commentsubmit
  const {noticenum,depth,cnum,page,setPage,onCreated}=props
  //depth 가 "0" 이면 원댓글, "1" 이면 대댓글. 크기/들여쓰기를 여기서 나눈다.
  const isreply=String(depth)==="1";

  const logincheck=AuthCheck()
  const axiosinstance=CreateAxios();
  //문자열로만 다룬다(예전엔 {text:""} 와 문자열이 섞여 controlled/uncontrolled 경고가 났다)
  const [comments,setComment]=useState("");
  const [cookie,setcookie,removecookie]=useCookies(['userinfo'])
  const username=cookie.userinfo?.username;
  const usernickname=cookie.userinfo?.nickname;

  const url="/commentcreate";
const navigate=useNavigate();

const queryclient=useQueryClient()
const textref=useRef()
//자연스럽게늘리기
const resize=()=>{
  textref.current.style.height=`auto`;
  textref.current.style.height=textref.current.scrollHeight+`px`;

}
const Commentcreate=async ({noticenum,depth,cnum,username,usernickname,comments})=>{
  const res=await axiosinstance.post("/commentcreate",{
      noticeid:noticenum,
      depth:depth,
      cnum:cnum,
      username:username,
      nickname:usernickname,
      text:comments


    })

}
const commentmutate=useMutation({
   mutationFn:Commentcreate,
   onSuccess:(data,variable)=>{
     setComment("")
     const noticenum=Number(variable.noticenum);

    //원댓글은 최신순이라 1페이지 맨 위에 생긴다. 3페이지를 보던 중이었다면
    //새로고침만 해선 자기 댓글이 안 보이므로 1페이지로 데려온다.
    //대댓글은 부모 댓글이 있는 페이지에 그대로 있어야 하니 페이지를 건드리지 않는다.
    if(!isreply&&setPage){
      setPage(1)
    }

    //페이지 번호까지 키에 넣어 무효화하면 지금 안 보고 있는 페이지가 낡은 채로 남는다.
    //["comments", 글번호] 접두사로 이 글의 모든 페이지를 한 번에 무효화한다.
    queryclient.invalidateQueries({queryKey:["comments",noticenum]})

    //댓글 개수를 들고 있는 화면(피드 카드 등)이 스스로 갱신할 수 있게 알려준다
    if(onCreated){
      onCreated()
    }

    console.log("재실행넘버:"+noticenum+" |타입:"+typeof noticenum);
    console.log("재실행페이지"+page+" |타입:"+typeof page);
   },
   onError:(err)=>{
    alert("에러")
   }
})

const Commenthandler=(noticenum,depth,cnum,username,usernickname,comments)=>{

  commentmutate.mutate({noticenum,depth,cnum,username,usernickname,comments})
}

//공백만 입력한 경우도 빈 댓글로 본다
const isempty=!comments||comments.trim().length===0;

  return (
    <>{logincheck?<Wrapper $reply={isreply}>

      <Imgdiv>
      <Img $reply={isreply} src={profileimage(cookie.userinfo["profileimg"])}/>
    </Imgdiv>

    <Maindiv>

      <Headerdiv>
    <Username>
    {cookie.userinfo["nickname"]}님
    </Username>
    </Headerdiv>

        <Commentmaindiv>
        <Commentinput type="text" name="text" value={comments}
        $reply={isreply}
        placeholder={isreply?"답글을 남겨보세요":"댓글을 남겨보세요"}
        onInput={resize}
        rows={1}
        ref={textref}
        onChange={(e)=>{

          setComment(e.target.value)
        }}
        />

      <Actiondiv>
        {!isempty&&<Countdiv>{comments.length}자</Countdiv>}
        <CreateButton type="submit"
        $reply={isreply}
        disabled={isempty||commentmutate.isPending}
        onClick={()=>{
          Commenthandler(noticenum,depth,cnum,username,usernickname,comments)


            textref.current.style.height="auto"

        }
      }>{commentmutate.isPending?"작성중...":isreply?"답글작성":"댓글작성"}
      </CreateButton>
      </Actiondiv>

      </Commentmaindiv>
      </Maindiv>
    </Wrapper>
    :<Nologinwrapper>

      <span>로그인 후 댓글을 작성하실 수 있습니다</span>
      <Nologinbutton type="button" disabled>댓글작성</Nologinbutton>

    </Nologinwrapper>
}
</>

  )
}
export default Commentform;
