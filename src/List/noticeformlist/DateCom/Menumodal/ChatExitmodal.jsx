import React from "react";
import ReactDOM from "react-dom"
import styled from "styled-components";
import CreateAxios from "../../../../customhook/CreateAxios";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

const Outputdiv=styled.div`
       position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
      display: flex;
    z-index: 500;
    justify-content: center;
    align-items: center;
`
const Wrapper=styled.div`
    width: 70%;
    height: 20%;
   background-color:#bfc3cc;
    z-index: 502;
    display: flex;
    flex-direction: column;
   
`
const Explaindiv=styled.div`
    display: flex;
    flex-direction:column;
    justify-content: end;
    align-items: center;
    
    height: 70%;
`
const Maintext=styled.div`
    
`
const Warningdiv=styled.div`
    font-size: 15px;
    color: red;
    padding-bottom: 12px;
`
const Buttondiv=styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    
`
const Button=styled.button`
    width: 80px;
    background: ${(props)=>props.form==="exit"? "red":"blue"};
`

export default function ChatExitmodal(props){
    const {setisexitpopup,roomid,setmenuopen}=props;
    const axiosinstance=CreateAxios();
    const queryClient=useQueryClient();
    const [cookie]=useCookies();

    //나가기로직
    const Exitmutation=useMutation({mutationFn:(roomid)=>{
        axiosinstance.post("/chatroomexit",{
            roomid:roomid
        })
    },onSuccess:()=>{
        alert("나가기성공")
        queryClient.invalidateQueries(["chatroommeta",cookie.userinfo.userid])
             queryClient.invalidateQueries(["chatroominfo",cookie.userinfo.userid])
             setmenuopen(false)
       
    },onError:()=>{
        alert("에러")
    }
})

    const Exithandler=()=>{
        Exitmutation.mutate(roomid)
    }


    return ReactDOM.createPortal(
        <Outputdiv>
        <Wrapper>
            <Explaindiv>
                <Maintext> 정말로나가시겠습니까?</Maintext>
                <Warningdiv>
                    (채팅방 정보가 완전히 삭제됩니다){cookie.userinfo.userid}
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