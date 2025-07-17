import React from "react";
import { useNavigate } from "react-router-dom";
import * as useChatroomexit from "../customhook/useChatroomservice";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
import Datefor from "./noticeformlist/DateCom/Datefor";
import Profilediv from "../UI/Modals/Profilediv";
const Wrapper=styled.div`
    display: flex;
    border: 1px solid gray;
    height: 70px;
`
const Imagediv=styled.div`
    display: flex;
    border: 1px solid red;
    width: 20%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
   
`
const Profilelist=styled.div`
    flex-grow: 0;
    flex-shrink: 0;
   
   
    flex-basis: ${props => {
    if (props.itemCount === 1) return '100%';
    if (props.itemCount === 2) return '45%';
    if (props.itemCount === 3 || props.itemCount === 4) return '45%';
    return '25%'; // 4개 초과일 경우
  }};

    height: ${props => (props.itemCount === 2 ? '55%' : '45%')};
    
    border:1px solid gray;
`
const MainContainer=styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid blue;
    width: 65%;
`


const MainTop=styled.div`
      display: flex;
      border: 1px solid yellow;
      height: 33%;
`
const Roomnamecss=styled.div`
    overflow: hidden;
    text-overflow:ellipsis;
`
const Roomlength=styled.div`
    
`
/*
const MainMiddle=styled.div`
      border: 1px solid rosybrown;
`
*/
const MainBottom=styled.div`
      border: 1px solid pink;
      height: 66%;
`
const Menudiv=styled.div`
    border: 1px solid green;
    width: 15%;
    overflow: hidden;
    text-overflow:ellipsis;
    font-size: 11px;
    display:flex;
    flex-direction: column;
`
const Timediv=styled.div`
    height: 50%;
    text-align: center;
    vertical-align: middle;
`
const Readdiv=styled.div`
    text-align: center;
     height: 50%;
`

function Chatroomlistitem(props){

    const {chatroomdata,inroom}=props;

    const navigate=useNavigate();


    const axiosinstance=CreateAxios();

    
    const movechatroom=(chatroomdata)=>{
        //navigate("/chatex?roomid="+chatroomdata.roomid)
        inroom(chatroomdata)
        
    }

    
    return (
        <Wrapper onClick={()=>{movechatroom(chatroomdata)}} key={chatroomdata.roomid}>
            
            <Imagediv>
            {/* 구지 사용자는알필요없는듯룸아이디
            룸아이디:{chatroomdata.roomid}
                */}
                {chatroomdata.members.map((item,index)=>{
                  if(index<4){
                    return <Profilelist itemCount={chatroomdata.membercount} key={index}
                        
                    >
                         <Profilediv url={item.profileurl} />
                         
                
                    </Profilelist>
                  }
                })}
               
            </Imagediv>

            <MainContainer>
                <MainTop>
                
                <Roomnamecss>{chatroomdata.roomtitle}</Roomnamecss>
                <Roomlength>  {chatroomdata.membercount}</Roomlength>
        </MainTop>
       
       
       <MainBottom>
        {chatroomdata.lastMessageContent}
        </MainBottom>
        
       
       
        </MainContainer>

        <Menudiv>
            <Timediv>
        <Datefor inputdate={chatroomdata.lastMessageCreatedAt}/> 
        </Timediv>
        <Readdiv>
            {chatroomdata.unreadCount}
        </Readdiv>
        </Menudiv>
     
        </Wrapper>
    )
}
export default Chatroomlistitem;