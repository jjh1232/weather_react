import React, { useState } from "react";
import AdminUpdateform from "../../../customhook/Admintools/AdminUpdateform";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faImages} from "@fortawesome/free-solid-svg-icons"
import {faComment} from "@fortawesome/free-regular-svg-icons"
import {faComments} from "@fortawesome/free-regular-svg-icons"
import {faSheetPlastic} from "@fortawesome/free-solid-svg-icons"


const Button=styled.button`
position: relative;
display: inline-block;
width: 32%;
height: 90%;
font-size: 15px;
//padding: 30px 4px;
color: white;
margin: 1px 1px 1px;//위옆아래 마진
border-radius: 20px; //모서리
text-align: center;
transition: top .04s linear;
text-shadow: 0 1px 0 rgba(0,0,0,0.15);
background-color: ${(props)=>props.backcolor};
`

const Tbody=styled.tbody`
   height: 10%;
`
const Tr=styled.tr`
    height: 10%;
    
`
const Line=styled.td`
    height: 10%;
    border: 1px solid gray;
`
export default function Membermanagelist(props){
    const {data,key,deletemember}=props

    const [isupdate,setIsupdate]=useState(false);
    const navigate=useNavigate();

    const noticesearch=(username)=>{
        navigate(`/admin/notice?page=1&option=email&keyword=${username}`)
    }
    const commentsearch=(username)=>{
        navigate(`/admin/comment?page=1&option=email&keyword=${username}`)
    }
    const roomsearch=(username)=>{
        navigate(`/admin/chatroom?page=1&option=email&keyword=${username}`)
    }

    const userhistoryon=(username)=>{
        window.open(`/admin/loginhistory?username=${username}`,"_blank","noopener,noreferreor")
    }
    return(<>
        {isupdate?<AdminUpdateform 
        setIsupdate={setIsupdate} currentdata={data}/>:""}
        <Tbody key={key}>
            <Tr>
                
                <Line>{data.id} </Line>
                <Line>{data.username} </Line>
                <Line>{data.nickname} </Line>
                
                <Line>{data.provider}</Line>
                <Line>{data.role}</Line>
                <Line>{data.homeaddress.juso}</Line>
                <Line>{data.usernotice}
                    <br/>
                    <FontAwesomeIcon icon={faSheetPlastic} onClick={()=>{noticesearch(data.username)}}
                                                               style={{cursor:"pointer"}} />
                                                           
                </Line>
                <Line>{data.usercomments}
                <br/>
                    <FontAwesomeIcon icon={faComment} onClick={()=>{commentsearch(data.username)}}
                                                               style={{cursor:"pointer"}} />
                                                          
                </Line>
                <Line>{data.userchatroom}
                <br/>
                    <FontAwesomeIcon icon={faComments} onClick={()=>{roomsearch(data.username)}}
                                                               style={{cursor:"pointer"}}/>
                </Line>
                <Line>{data.red} </Line>
               
                <Line style={{width:"15%"}}>

                    
                <Button backcolor="green" onClick={()=>{userhistoryon(data.username);}}>로그인<br/>기록</Button>
                <Button backcolor="blue"
                onClick={()=>{setIsupdate(true)}}>정보<br/>수정</Button> 
                <Button  backcolor="red"
                onClick={()=>{deletemember(data.id)}}>회원<br/>삭제</Button>
              

                </Line>
                </Tr>
              
                </Tbody>
               
                </>
    )
}