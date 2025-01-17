import React from "react";
import { useState } from "react";
import styled from "styled-components";
import CreateAxios from "../CreateAxios";

const Modalout=styled.div`
width:45% ;
height:85% ;
position: fixed;
background:rgba(0,0,0,0.5);

`

const Modalin=styled.div`
padding: 15px;
width:90%;
height:70%;
background-color: #FFFFFF;
overflow: auto;
`
export default function Admincommentupdate(props){

    const {data,setisupdate}=props;
    const [newcommentdata,setNewcommentdata]=useState({
            commentid:data.id,
            noticeid:data.noticenum,
            depth:data.depth,
            cnum:data.cnum, //대댓글일시 해당댓글아이디
            username:data.username,
            nickname:data.nickname,
            text:data.text
    })

    const axiosinstance=CreateAxios();

    const onupdate=(data)=>{
        axiosinstance.put(`/admin/commentupdate/${data.commentid}`,{
            noticeid:data.noticeid,
            depth:data.depth,
            cnum:data.cnum,
            username:data.username,
            nickname:data.nickname,
            text:data.text
        }).then((res)=>{
            alert(res.data)
            window.location.reload();
        }).catch((err)=>{
            alert(err)
        })
        
    }
    return (
        <Modalout>
            <button onClick={()=>{setisupdate(false)}}>창닫기</button>
        <Modalin>
        댓글번호: {newcommentdata.commentid}<br/>
           작성된게시글번호: {newcommentdata.noticeid}<br/>
           대댓글여부:{newcommentdata.depth}<br/>
           부모댓글번호:{newcommentdata.cnum}<br/>
           유저네임:<input type="text" value={newcommentdata.username} 
           onChange={(e)=>{setNewcommentdata({...newcommentdata,username:e.target.value})}} />
            <br/>
            유저닉네임:<input type="text" value={newcommentdata.nickname} 
           onChange={(e)=>{setNewcommentdata({...newcommentdata,nickname:e.target.value})}} />
            <br/>
            댓글내용:<input type="text" value={newcommentdata.text} 
           onChange={(e)=>{setNewcommentdata({...newcommentdata,text:e.target.value})}} />
            <br/>

            <button onClick={()=>{onupdate(newcommentdata)}}>수정완료</button>
        </Modalin>
        </Modalout>
    )
}