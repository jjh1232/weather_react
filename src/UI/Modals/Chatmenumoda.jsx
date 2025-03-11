import React, { forwardRef, useImperativeHandle, useState } from "react";
import styled from "styled-components";
import ChatFollowlistmodal from "./ChatFollowlistmodal";

const Modal=styled.div`
position:absolute;
height:101%;
width:101%;

z-index: 2;
background:rgba(0,0,0,0.4);



`
const Modalbody=styled.div`
position:relative;
display: flex;
flex-direction: column;
float:right;
width:70%;
height:100%;

background-color: white;
`
const Headercss=styled.div`
    border: 1px solid red;
`
const InviteButton=styled.button`
    border: 1px solid green;
`

const UserDiv=styled.div`
    border: 1px solid blue;
`
const Userlistcss=styled.div`
    
`
const Outbox=styled.div`
    text-align: center;
    background-color: white;
    position: relative;
    transform: translate(50%,100%);
    width: 50%;
    height:12%;
    

`
//컴포넌트에 ref를 주기위해선 forwardref로 생성해야함!
const Chatmenumoda=forwardRef((props,ref)=>{

    const [invitelist,setInvitelist]=useState();

const {roomdata,invite}=props;
const [ischatroomout,setIschatroomout]=useState(false);

const isinvite=(e)=>{
    e.preventDefault()
    setInvitelist(true)
}

const followmodalclose=()=>{
    console.log("함수전달")
    setInvitelist(false)
}

const isinvitehandler=(e)=>{
    e.preventDefault()
    setInvitelist(!isinvite)
}
//채팅방나가기 
const ischatoutmodal=()=>{
    setIschatroomout(true)
}
 //채팅방나가기
 const exit=(roomid)=>{
    axiosinstance.post("/chatroomexit",{

        roomid:roomid

    }).then((res)=>{
        console.log("성공적")
        //setcontent("chatroomlist")
    })
    .catch((err)=>{
        console.log("에러")
    })
    }
return (
    <>

    <Modal  >
    <Modalbody ref={ref} className="chatroommenu">
        <Headercss className="chatroommenu">
        {roomdata.roomname} 
        ({roomdata.namelist.length})

        <InviteButton  className="chatroommenu" onClick={(e)=>isinvite(e)}>초대하기</InviteButton>           
    </Headercss>
 
    <UserDiv className="chatroommenu">
    {roomdata.namelist.map((data)=>{
        return (
            <Userlistcss className="chatroommenu">
                
                {data.membernickname}

            </Userlistcss>

        )

    })}
   
   </UserDiv>
<div style={{display:"flex",justifyContent:"flex-start"
                    ,position:"absolute",width:"100%", bottom:"1px",background:"yellow"}}
                    className="chatroommenu"
                    >
                 
                
                <span className="chatroommenu" style={{marginLeft:"auto"}} 
                onClick={ischatoutmodal}
                >채팅방나가기</span>
                </div>


    </Modalbody>
    {invitelist&&<ChatFollowlistmodal close={followmodalclose} roomid={roomdata.roomid} 
    roomusers={roomdata.namelist} invite={invite} isinvitelist={isinvitehandler}
    />}


    </Modal>

    {ischatroomout&&
     <Modal>
        <Outbox>정말로나가시겠습니까?</Outbox>
        
        
     </Modal>
    }
    </>
)

})

export default Chatmenumoda;
