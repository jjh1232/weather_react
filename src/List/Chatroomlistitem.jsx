import React from "react";
import { useNavigate } from "react-router-dom";
import * as useChatroomexit from "../customhook/useChatroomservice";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
import Datefor from "./noticeformlist/DateCom/Datefor";

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
   
`
const Profilelist=styled.div`
    width: 45%;
    height: 47%;
    margin-left: 0.5px;
    text-overflow: hidden;
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

    const {chatroomdata,onclick,inroom}=props;

    const navigate=useNavigate();


    const axiosinstance=CreateAxios();

    
    const movechatroom=(chatroomdata)=>{
        //navigate("/chatex?roomid="+chatroomdata.roomid)
        inroom(chatroomdata)
        
    }

    
    return (
        <Wrapper onClick={()=>{movechatroom(chatroomdata)}}>
            
            <Imagediv>
            {/* 구지 사용자는알필요없는듯룸아이디
            룸아이디:{chatroomdata.roomid}
                */}
                {chatroomdata.namelist.map((item,index)=>{
                  if(index<4){
                    return <Profilelist>
               1
                    </Profilelist>
                  }
                })}
               
            </Imagediv>

            <MainContainer>
                <MainTop>
                
                <Roomnamecss>{chatroomdata.roomname}</Roomnamecss>
                <Roomlength>  {chatroomdata.namelist.length}</Roomlength>
        </MainTop>
        {/* 유저목록구지필요한가싶어서
        <MainMiddle>
        유저목록:{chatroomdata.namelist.map((data,key)=>{
            
            return(
                <>

                {chatroomdata.namelist.length-1===key
                ?<>{data.membernickname} </>
                :<>{data.membernickname},</>}     
                
                </>
            )
        })}
       </MainMiddle>
       */}
       
       <MainBottom>
        {chatroomdata.latelychat}
        </MainBottom>
        
       
       
        </MainContainer>

        <Menudiv>
            <Timediv>
        <Datefor inputdate={chatroomdata.time}/> 
        </Timediv>
        <Readdiv>
            3
        </Readdiv>
        </Menudiv>
     
        </Wrapper>
    )
}
export default Chatroomlistitem;