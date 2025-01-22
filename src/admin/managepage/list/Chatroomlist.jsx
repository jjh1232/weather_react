
import React from "react";
import CreateAxios from "../../../customhook/CreateAxios";
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

export default function Chatroomlist(props){

    const {data,key}=props;
    const axiosinstance=CreateAxios();
    const navigate=useNavigate();
    const deletechatroom=(roomid)=>{
        if(confirm("정말로지우시겠습니까")){
        axiosinstance.delete(`/admin/roomdelete/${roomid}`)
        .then((res)=>{
            alert(res.data)
        }).catch((err)=>{
            alert(err)
        })
    }
    else{

    }
    }

    return (<tr>
        <td>{data.roomid}</td>
        <td>{data.roomname}</td>
        <td>{data.namelist.map((name)=>{return(<div>{name.membernickname}</div>)})}</td>
        <td on onClick={()=>{
            navigate(`/admin/room/${data.roomid}`)
        }}>{data.latelychat}</td>
        <td>{data.chatnum}</td>
        <td>{data.lastchatred}</td>
        <td>{data.red}</td>
        <td>
                            
                            <Button backcolor="red"
                            onClick={()=>{deletechatroom(data.roomid)}}>채팅방삭제</Button>
                            </td>
    </tr>)
}