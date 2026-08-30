import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Profilediv from "./Profilediv";

//=====================================================================
// 채팅방 초대 - 팔로우 목록에서 골라 초대한다.
//  - 예전엔 배경이 greenyellow 에 blue/red/yellow 테두리, 닫기 버튼은
//    8px 검은 선 두 개로 그린 X 였다. 전부 테마 토큰으로 바꿨다.
//  - 폰 화면(#phone-ui) 전체를 덮는다. 설정 서랍 위에 얹힌다.
//=====================================================================

const slideup=keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Modal = styled.div.attrs({ className: "chatroommenu" })`
    position: absolute;
    inset: 0;
    z-index: 320;
    display: flex;
    flex-direction: column;
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    animation: ${slideup} 180ms ${(props)=>props.theme.ease};

    @media (prefers-reduced-motion: reduce) { animation: none; }
`
const Headers = styled.div.attrs({ className: "chatroommenu" })`
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 10px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const ExitButton = styled.button.attrs({ className: "chatroommenu" })`
    flex: none;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: none;
    color: ${(props)=>props.theme.textMuted};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 1px;
    }
`
const Closeicon=()=>(
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
)
const HeaderText = styled.div`
    flex: 1;
    min-width: 0;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.02em;
`
//선택한 사람이 없으면 눌러도 경고만 뜨므로, 그 상태를 색으로 먼저 알려준다.
const Invitebutton = styled.button.attrs({ className: "chatroommenu" })`
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    padding: 0 13px;
    border: 1px solid transparent;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    ${(props)=>props.active
        ? `
        background: ${props.theme.accent};
        color: #fff;
        &:hover { background: ${props.theme.accentHover}; }
        `
        : `
        background: ${props.theme.accentSoft};
        color: ${props.theme.accent};
        `}

    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
const Searchwrap = styled.div`
    flex: none;
    padding: 10px 12px 6px;
`
const Searchinput = styled.input.attrs({ className: "chatroommenu" })`
    width: 100%;
    height: 32px;
    padding: 0 12px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surfaceAlt};
    color: ${(props)=>props.theme.text};
    font-size: 13px;
    outline: none;
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition},
                background ${(props)=>props.theme.transition};

    &::placeholder { color: ${(props)=>props.theme.textFaint}; }
    &:focus {
        border-color: ${(props)=>props.theme.accent};
        background: ${(props)=>props.theme.surface};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
const Userlist = styled.div.attrs({ className: "chatroommenu" })`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 4px 8px 10px;

    &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props)=>props.theme.borderStrong};
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;
    }
`
const Emptytext=styled.div`
    padding: 24px 12px;
    text-align: center;
    font-size: 12.5px;
    color: ${(props)=>props.theme.textMuted};
`
//label 로 감싸 줄 어디를 눌러도 체크된다. 이미 방에 있는 사람은 눌러도 소용없으니 흐리게.
const Userli = styled.label.attrs({ className: "chatroommenu" })`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 8px;
    border-radius: ${(props)=>props.theme.radius};
    cursor: ${(props)=>props.joined?"default":"pointer"};
    opacity: ${(props)=>props.joined?0.55:1};
    transition: background ${(props)=>props.theme.transition};

    &:hover { background: ${(props)=>props.joined?"transparent":props.theme.surfaceHover}; }
`
const Userprofilecss=styled.div`
    flex: none;
    width: 36px;
    height: 36px;
`
const Username = styled.div.attrs({ className: "chatroommenu" })`
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
`
const Nickname=styled.div`
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Useremail=styled.div`
    font-size: 11.5px;
    color: ${(props)=>props.theme.textMuted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Joinedtag=styled.span`
    margin-left: auto;
    flex: none;
    padding: 3px 9px;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.theme.border};
    font-size: 11px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
`
const Usercheck = styled.input.attrs({ className: "chatroommenu" })`
    margin-left: auto;
    flex: none;
    width: 18px;
    height: 18px;
    accent-color: ${(props)=>props.theme.accent};
    cursor: pointer;
`
const ChatFollowlistmodal = (props) => {
    const { close, roomid, roomusers } = props;
    const axiosinstance = CreateAxios();

    const [checklist, setChecklist] = useState([])
    const [search, setSearch] = useState("");

    const queryclient = useQueryClient();

    const { data: followlist } = useQuery({
        queryKey: ['invitelist'],
        queryFn: async () => {
            const res = await axiosinstance.get("/followlist")
            return res.data;
        }

    })

    const clossmodal = () => {
        close();
    }

    //체크박스 데이터
    const checkhandler = (check, value) => {
        if (check) {
            setChecklist((prev) => [...prev, value])

            return
        }
        if (!check && checklist.includes(value)) {
            setChecklist(checklist.filter((data) => data !== value))

            return
        }


        return
    }

    const Userinvite = useMutation({
        mutationFn: ({ roomid, checklist }) => {

            //return 이 없으면 요청이 끝나기 전에 onSuccess 가 돌아
            //아직 반영 안 된 목록을 다시 받아온다.
            return axiosinstance.post("/chatroominvite", {
                roomid: roomid,
                userlist: checklist
            })
        },
        onSuccess: () => {
            alert("성공적으로초대하였습니다")
            //다른컴포넌트라그냥새로
            //초대해도 방 정보(대화상대 목록)를 다시 안 받아오면 화면이 그대로다
            queryclient.invalidateQueries({ queryKey: ["roominfo", roomid] })
            queryclient.invalidateQueries("chatdata")
            close();
        },
        onError: (err) => {
            alert(err)
        }
    })

    const Invite = (roomid, checklist) => {
        if(checklist.length<1){
            alert("초대대상을선택해주세요")
        }else{
        Userinvite.mutate({ roomid, checklist })
        }
    }
    //채팅창 유저비교
    //닉네임은 겹칠 수 있어서 로그인 아이디로 맞춘다.
    //(팔로우목록의 username == 방 멤버의 email == member.username)
    const existinguser = (username) => {

        let value = false;

        const members = roomusers || [];

        //roomusers.forEach((data)=>{})} 포이치문브레이크안되서효율이안조흐..return도continue고..
        for (var i = 0; i < members.length; i++) {
            if (username === members[i].email) {


                value = true;
                return value;
            }

        }
        return value;


    }

    //검색어를 지우면 search 가 "" 가 되는데, 예전 조건(=== " ")은 그때
    //아무 줄도 통과시키지 않아 목록이 통째로 사라졌다.
    const keyword = search.trim();
    const visiblelist = (followlist||[]).filter((data) => {
        if (keyword === "") return true;
        return data.nickname.includes(keyword) || data.username.includes(keyword);
    })

    return (
        <Modal className="chatroommenu">
            <Headers>
                <ExitButton type="button" aria-label="닫기" onClick={clossmodal}>
                    <Closeicon/>
                </ExitButton>

                <HeaderText>팔로우 목록</HeaderText>

                <Invitebutton type="button" active={checklist.length>0}
                    onClick={() => {
                    Invite(roomid, checklist)

                }} >

                    초대{checklist.length>0 && ` ${checklist.length}`}</Invitebutton>

            </Headers>

            <Searchwrap>
                <Searchinput type="text" placeholder="닉네임 또는 아이디 검색"
                    value={search}
                    onChange={(e) => {

                        setSearch(e.target.value);
                    }}
                />
            </Searchwrap>

            <Userlist>
                {/*친구목록 */}
                {visiblelist.length===0 &&
                <Emptytext>
                    {keyword===""?"팔로우한 사람이 없습니다":"검색 결과가 없습니다"}
                </Emptytext>}

                {visiblelist.map((data) => {
                        //이프로검사 - 이미 방에 있으면 체크박스 없이 "참여중"만 보여준다
                        const joined = existinguser(data.username);

                        return (
                            <Userli key={data.username} htmlFor={joined?undefined:data.username}
                                joined={joined?1:0}>
                                <Userprofilecss>
                                    <Profilediv url={data.profileurl} />
                                </Userprofilecss>
                                <Username>
                                    <Nickname>{data.nickname}</Nickname>
                                    <Useremail>{data.username}</Useremail>
                                </Username>

                                {joined
                                    ? <Joinedtag>참여중</Joinedtag>
                                    : <Usercheck id={data.username} type="checkbox"
                                        checked={checklist.includes(data.username)}
                                        onChange={(e) => {
                                            checkhandler(e.target.checked, e.target.id)
                                        }} />}
                            </Userli>
                        )

                    })}
            </Userlist>
        </Modal>


    )


}
export default ChatFollowlistmodal
