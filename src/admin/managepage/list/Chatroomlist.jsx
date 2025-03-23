
import React from "react";
import CreateAxios from "../../../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QueryClient, useQueryClient } from "@tanstack/react-query";


const Button=styled.button`
position: relative;
display: inline-block;
width: 65px;
height: 45px;
font-size: 15px;

color: white;
margin: 1px 1px 1px;//위옆아래 마진
border-radius: 5px; //모서리
text-align: center;
transition: top .04s linear;
text-shadow: 0 1px 0 rgba(0,0,0,0.15);
background-color: ${(props)=>props.backcolor};
`
const Tr=styled.tr`
    border: 1px solid gray;
`
const Td=styled.td`
    border: 1px solid gray;
   
    height: 45px;
`
export default function Chatroomlist(props){

    const queryclient=useQueryClient();
    const {data,key}=props;
    const axiosinstance=CreateAxios();
    const navigate=useNavigate();
    const deletechatroom=(roomid)=>{
        if(confirm("정말로지우시겠습니까")){
        axiosinstance.delete(`/admin/roomdelete/${roomid}`)
        .then((res)=>{
            alert(res.data)
            queryclient.invalidateQueries(["adminchatroomlist"]);
        }).catch((err)=>{
            alert(err)
        })
    }
    else{

    }
    }

    return (<Tr>
        <Td style={{textAlign:"center"}}>{data.roomid}</Td>
        <Td style={{verticalAlign:"top"}}>{data.roomname}</Td>
        <Td style={{verticalAlign:"top"}}>{data.namelist.map((name)=>{return(<>{name.membernickname},</>)})}</Td>
        <Td style={{verticalAlign:"top"}} 
        onClick={()=>{
            navigate(`/admin/room/${data.roomid}`)
        }}>{data.latelychat}</Td>
        <Td style={{textAlign:"center"}}>{data.chatnum}</Td>
        <Td style={{textAlign:"center"}}>{data.lastchatred}</Td>
        <Td style={{textAlign:"center"}}>{data.red}</Td>
        <Td>
                            
                            <Button backcolor="red"
                            onClick={()=>{deletechatroom(data.roomid)}}>채팅방삭제</Button>
                            </Td>
    </Tr>)
}