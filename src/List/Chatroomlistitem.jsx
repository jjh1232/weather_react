import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as useChatroomexit from "../customhook/useChatroomservice";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
import Datefor from "./noticeformlist/DateCom/Datefor";
import Profilediv from "../UI/Modals/Profilediv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear  } from "@fortawesome/free-solid-svg-icons";
import Chatroomlistmenu from "./noticeformlist/DateCom/Chatlistmenu";
// 채팅방 목록 한 줄. 팔로우/팔로워 목록과 같은 규격으로 맞춘다.
const Wrapper=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    cursor: pointer;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    transition: background ${(props)=>props.theme.transition};

    &:last-child { border-bottom: none; }
    &:hover { background: ${(props)=>props.theme.surfaceHover}; }
`
// 참여자 프로필 모음 (최대 4개 타일)
const Imagediv=styled.div`
    display: flex;
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 14px;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Profilelist=styled.div`
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
   
    flex-basis: ${props => {
    if (props.itemCount === 1) return '100%';
    if (props.itemCount === 2) return '50%';
    if (props.itemCount === 3 || props.itemCount === 4) return '50%';
    return '50%'; // 4개 초과일 경우
  }};

    height: ${props => (props.itemCount === 1 ? '100%' : '50%')};
`
const MainContainer=styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
`


const MainTop=styled.div`
      display: flex;
      align-items: baseline;
      gap: 6px;
      min-width: 0;
`
const Roomnamecss=styled.div`
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.text};
`
// 참여 인원수
const Roomlength=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    font-size:11px;
    color: ${(props)=>props.theme.textFaint};

`
/*
const MainMiddle=styled.div`
      border: 1px solid rosybrown;
`
*/
// 마지막 메시지 미리보기
const MainBottom=styled.div`
      font-size: 12px;
      line-height: 1.4;
      color: ${(props)=>props.theme.textMuted};
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
     
`
const Optiondiv=styled.div`
    flex-shrink: 0;
    display:flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
`
const Menudiv=styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    color: ${(props)=>props.theme.textFaint};
    position: relative;
    /* 톱니에 padding 을 줬으니 오른쪽 여백을 그만큼 당긴다 */
    margin-right: -7px;
`
//톱니가 13px 이라 눌러야 할 자리인지 잘 보이지 않았다.
//아이콘을 키우고, 손가락/마우스가 닿을 원형 영역을 따로 준다.
const Submenuicon=styled(FontAwesomeIcon)`
    font-size: 16px;
    cursor: pointer;
    padding: 7px;
    border-radius: 50%;
    box-sizing: content-box;
    color: ${(props)=>props.theme.textMuted};
    transition: color ${(props)=>props.theme.transition},
                background ${(props)=>props.theme.transition};

    &:hover {
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.accent};
    }
`
const Readdiv=styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size:11px;
  
    
`

// 안 읽은 메시지 뱃지
const Circlediv=styled.div`
       display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px; // pill 형태
  font-size: 11px;
  background: #e04545;
  color: white;
  font-weight: 700;
  box-sizing: border-box;
`

function Chatroomlistitem(props){

    const {chatroomdata,inroom}=props;

   const [menuopen,setMenuopen]=useState(false);

   const [menupos,setMenupos]=useState({
    x:0,
    y:0
   });
    
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

        <Optiondiv>
            <Menudiv>
                  <Datefor inputdate={chatroomdata.lastMessageCreatedAt}/> 
                <Submenuicon icon={faGear}
                    onClick={(e)=>{
                        e.stopPropagation();
                        setMenuopen((prev=>!prev))
                        setMenupos({x:e.clientX,y:e.clientY})
                    }}
                />
                {menuopen&&<Chatroomlistmenu setmenuopen={setMenuopen} 
                        roomdata={chatroomdata}
                />}
        </Menudiv>
        <Readdiv>
              
           
            
                 {chatroomdata&&chatroomdata.unreadCount!==0&&
            
            <Circlediv>
                {chatroomdata.unreadCount>99?<>99+</>:chatroomdata.unreadCount}
            
            </Circlediv>
}

        </Readdiv>
        </Optiondiv>
     
        </Wrapper>
    )
}
export default Chatroomlistitem;