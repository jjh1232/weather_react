import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as useChatroomexit from "../customhook/useChatroomservice";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
import Datefor from "./noticeformlist/DateCom/Datefor";
import Profilediv from "../UI/Modals/Profilediv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis  } from "@fortawesome/free-solid-svg-icons";
import Chatroomlistmenu from "./noticeformlist/DateCom/Chatlistmenu";
const Wrapper=styled.div`
    display: flex;
    margin-top:5px;
    height: 70px;
`
const Imagediv=styled.div`
    display: flex;
    
    width: 20%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-radius: 12%;
    margin-top:2px;
    margin-bottom:2px;
    border: 1px solid gray;
   
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
    
    
    
`
const MainContainer=styled.div`
    display: flex;
    flex-direction: column;
  margin-top: 3px;
    width: 65%;
     margin-left: 5px;
`


const MainTop=styled.div`
      display: flex;
      
     
     // border: 1px solid gray;
      height: 33%;
      gap: 3px;
`
const Roomnamecss=styled.div`
    overflow: hidden;
    text-overflow:ellipsis;

`
const Roomlength=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3px;
font-size:13px;
    color: gray;
`
/*
const MainMiddle=styled.div`
      border: 1px solid rosybrown;
`
*/
const MainBottom=styled.div`
   //   border: 1px solid gray;
      height: 66%;
      font-size: 15px;
      color: gray;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
`
const Optiondiv=styled.div`
    //border: 1px solid gray;
    width: 18%;
    overflow: hidden;
    text-overflow:ellipsis;
    
    display:flex;
    flex-direction: column;
    
`
const Menudiv=styled.div`
    //padding-top: 3px;
    height: 30%;
    //text-align: center;
    
    font-size: 11px;
    position: relative;
    
   
`
const Submenuicon=styled(FontAwesomeIcon)`
    font-size: 23px;
    margin-right: 9px;
    margin-bottom: 20px;
    float: right;

`
const Readdiv=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  //  justify-content: center;

    height:68%;
    font-size:11px;
  
    
`

const Circlediv=styled.div`
       display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  border-radius: 999px; // pill 형태
  border: 1px solid red;
  font-size: 13px;
  background: #eb5959;
  color: white;
  font-weight: bold;
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
                <Submenuicon icon={faEllipsis}
                    onClick={(e)=>{
                        e.stopPropagation();
                        setMenuopen((prev=>!prev))
                        setMenupos({x:e.clientX,y:e.clientY})
                    }}
                />
                {menuopen&&<Chatroomlistmenu setmenuopen={setMenuopen} pos={menupos}/>}
        </Menudiv>
        <Readdiv>
                <Datefor inputdate={chatroomdata.lastMessageCreatedAt}/> 
           
            
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