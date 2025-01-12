import React, { useState } from "react";
import AdminUpdateform from "../../../customhook/Admintools/AdminUpdateform";
import { useNavigate } from "react-router-dom";


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

    return(<>
        {isupdate?<AdminUpdateform 
        setIsupdate={setIsupdate} currentdata={data}/>:""}
        <tbody key={key}>
            <tr >
                
                <td>{data.id} </td>
                <td>{data.username} </td>
                <td>{data.nickname} </td>
                
                <td>{data.provider}</td>
                <td>{data.role}</td>
                <td>{data.homeaddress.juso}</td>
                <td onClick={()=>{noticesearch(data.username)}}>{data.usernotice}</td>
                <td onClick={()=>{commentsearch(data.username)}}>{data.usercomments}</td>
                <td onClick={()=>{roomsearch(data.username)}}>{data.userchatroom}</td>
                <td>{data.red} </td>
               
                <td>
                <button onClick={()=>{setIsupdate(true)}}>회원정보수정</button> &nbsp;
                <button onClick={()=>{deletemember(data.id)}}>회원삭제</button>
                </td>
                </tr>
              
                </tbody>
            
                </>
    )
}