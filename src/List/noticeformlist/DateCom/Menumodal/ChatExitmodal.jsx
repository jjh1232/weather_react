import React from "react";
import ReactDOM from "react-dom"
import styled from "styled-components";
import CreateAxios from "../../../../customhook/CreateAxios";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useToast } from "../../../../UI/Feedback/FeedbackProvider";

//채팅방 나가기 확인. 되돌릴 수 없는 동작이라 확인 버튼만 위험색으로 채운다.
const Outputdiv=styled.div`
    position: absolute;
    inset: 0;
    z-index: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: ${(props)=>props.theme.overlay};
`
const Wrapper=styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 18px 14px;
    background: ${(props)=>props.theme.surface};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    box-shadow: ${(props)=>props.theme.shadowLg};
    color: ${(props)=>props.theme.text};
`
const Explaindiv=styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: center;
`
const Maintext=styled.div`
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
`
const Warningdiv=styled.div`
    font-size: 12.5px;
    line-height: 1.6;
    color: ${(props)=>props.theme.textMuted};
`
const Buttondiv=styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 18px;
`
const Button=styled.button`
    min-width: 74px;
    height: 34px;
    padding: 0 14px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                filter ${(props)=>props.theme.transition};

    ${(props)=>props.form==="exit"
        ? `
        border: 1px solid transparent;
        background: ${props.theme.warning};
        color: #fff;
        &:hover { filter: brightness(1.08); }
        `
        : `
        border: 1px solid ${props.theme.border};
        background: ${props.theme.surfaceAlt};
        color: ${props.theme.textMuted};
        &:hover { background: ${props.theme.surfaceHover}; color: ${props.theme.text}; }
        `}

    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`

export default function ChatExitmodal(props){
    //className - Chatmenumoda 는 바깥클릭 판정에 .chatroommenu 를 쓰기 때문에
    //이 확인창에도 그 클래스를 얹을 수 있어야 한다.
    /* onexited: 나가기가 끝난 뒤 화면을 어떻게 할지 부르는 쪽이 정한다.
       - 채팅방 안(Chatmenumoda)에서 나가면 방 목록으로 돌아가야 한다.
       - 방 목록(Chatlistmenu)에서 나가면 그 줄만 사라지면 되므로 안 넘긴다. */
    const {setisexitpopup,roomid,setmenuopen,className,onexited}=props;
    const axiosinstance=CreateAxios();
    const queryClient=useQueryClient();
    const [cookie]=useCookies();
    const toast=useToast();

    //나가기로직
    const Exitmutation=useMutation({mutationFn:(roomid)=>{
        //return 이 없으면 요청이 끝나기 전에 onSuccess 가 돌아버려서,
        //아직 나가지지 않은 방 목록을 다시 받아온다.
        return axiosinstance.post("/chatroomexit",{
            roomid:roomid
        })
    },onSuccess:()=>{
        //나가면 방 목록에서 사라지는 것으로 결과가 보인다
        queryClient.invalidateQueries({ queryKey: ["chatroommeta",cookie.userinfo.userid] })
             queryClient.invalidateQueries({ queryKey: ["chatroominfo",cookie.userinfo.userid] })
             setmenuopen(false)
             setisexitpopup(false)

             /* 예전엔 여기서 끝이라, 방 안에서 나가면 이미 나간 방 화면에
                그대로 남아 있었다(대화도 못 보내는 상태로). */
             if(onexited) onexited()

    },onError:(err)=>{
        toast.error(err)
    }
})

    const Exithandler=()=>{
        Exitmutation.mutate(roomid)
    }


    return ReactDOM.createPortal(
        <Outputdiv className={className}>
        <Wrapper>
            <Explaindiv>
                <Maintext>채팅방을 나가시겠어요?</Maintext>
                <Warningdiv>
                    나간 뒤에는 이 방의 대화를 다시 볼 수 없습니다.
                </Warningdiv>
             

            </Explaindiv>
            <Buttondiv>
            <Button onClick={(e)=>{
                e.stopPropagation()
                setisexitpopup(false)}}>취소</Button>
            <Button  onClick={(e)=>{
                e.stopPropagation()
                    Exithandler();
                }}
                form="exit"
                >
                    나가기</Button>
            </Buttondiv>
          
        </Wrapper>
        </Outputdiv>
        ,document.getElementById('phone-ui')
    )
}