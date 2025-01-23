import React, { useState } from "react";
import AdminUpdateform from "../../../customhook/Admintools/AdminUpdateform";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const Button=styled.button`
position: relative;
display: inline-block;

font-size: 15px;
padding: 20px 25px;
color: white;
margin: 1px 1px 1px;//위옆아래 마진
border-radius: 20px; //모서리
text-align: center;
transition: top .04s linear;
text-shadow: 0 1px 0 rgba(0,0,0,0.15);
background-color: ${(props)=>props.backcolor};
`
const Tbody=styled.tbody`
  
`
const Tr=styled.tr`
  
    
`
const Line=styled.td`
    
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
            <Tr onClick={()=>{userhistoryon(data.username);}}>
                
                <Line>{data.id} </Line>
                <Line>{data.username} </Line>
                <Line>{data.nickname} </Line>
                
                <Line>{data.provider}</Line>
                <Line>{data.role}</Line>
                <Line>{data.homeaddress.juso}</Line>
                <Line onClick={()=>{noticesearch(data.username)}}>{data.usernotice}</Line>
                <Line onClick={()=>{commentsearch(data.username)}}>{data.usercomments}</Line>
                <Line onClick={()=>{roomsearch(data.username)}}>{data.userchatroom}</Line>
                <Line>{data.red} </Line>
               
                <Line>
                <Button backcolor="blue"
                onClick={()=>{setIsupdate(true)}}>정보수정</Button> 
                <Button  backcolor="red"
                onClick={()=>{deletemember(data.id)}}>회원삭제</Button>
                </Line>
                </Tr>
              
                </Tbody>
               
                </>
    )
}