
import React from "react";
import CreateAxios from "../../../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";


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
                            
                            <button onClick={()=>{deletechatroom(data.roomid)}}>채팅방삭제</button>
                            </td>
    </tr>)
}