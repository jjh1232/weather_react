import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNoticeupdate from "../../../customhook/Admintools/AdminNoticeupdate";
import Imagebook from "../../../customhook/Imagebook";
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

export default  function AdNoticeList(props) {

    const {data,key,deletemethod}=props;
    const navigate=useNavigate();
    const [isupdate,setIsupdate]=useState();
    const [isimagebook,setIsimagebook]=useState(false);
    const commentsearch=(noticenum)=>{
        navigate(`/admin/comment?page=1&option=noticenum&keyword=${noticenum}`)
    }

    const deletes=(num)=>{
        if(confirm("정말삭제하시겠습니까?")){
            deletemethod(num)
        }
    }
    const noticedetail=(noticeid)=>{
        navigate(`/admin/notice/detail/${noticeid}`)
    }
    
    const imagebookon=()=>{
      
        setIsimagebook(!isimagebook)
    }
        return (<>
        {isupdate?<><AdminNoticeupdate noticeid={data.num} setisupdate={setIsupdate}/></>:""}
        <tr>
                            <td>{data.num} </td>
                            <td style={{width:"10%"}}>
                                 <img   src={process.env.PUBLIC_URL+"/userprofileimg"+data.userprofile}
   style={{objectFit:"fill",width:"50%",height:"10%"}}
  
                /></td>
                            <td>{data.username} </td>
                            <td>{data.nickname} </td>
                           
                            <td onClick={()=>{noticedetail(data.num)}}>{data.title}</td>
                            <td onClick={()=>{noticedetail(data.num)}}>{data.text.slice(0,200)}</td>
                            
                            <td>{data.red}</td>
                            <td>{data.likes} </td>
                            <td onClick={()=>{commentsearch(data.num)}}
                            >{data.commentcount}</td>
                            <td>{data.detachfiles.length}
                                {!data.detachfiles.length==0&&<Button backcolor="gray"
                                onClick={()=>{imagebookon()}}>이미지북</Button>}
                                

                            </td>
                            <td>
                            <Button backcolor="blue" onClick={()=>{setIsupdate(true)}}>게시글수정</Button>
                            <Button backcolor="red" onClick={()=>{deletes(data.num)}}>게시글삭제</Button>
                            </td>
                </tr>
                                    {isimagebook&&
                                    <Imagebook images={data.detachfiles} 
                                    setisimage={setIsimagebook}
                                    userdata={{username:data.username,nickname:data.nickname,profileimg:data.userprofile}}
                                    noticedata={{title:data.title,likes:data.likes,red:data.red}}
                                    />}
                </> )
}