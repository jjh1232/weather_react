import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNoticeupdate from "../../../customhook/Admintools/AdminNoticeupdate";
import Imagebook from "../../../customhook/Imagebook";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faImages} from "@fortawesome/free-solid-svg-icons"
import {faComment} from "@fortawesome/free-regular-svg-icons"
const Button=styled.button`
position: relative;
display: inline-block;

font-size: 15px;
padding: 5% 5%;
color: white;
margin: 1px 1px 1px;//위옆아래 마진
border-radius: 10px; //모서리
text-align: center;
transition: top .04s linear;
text-shadow: 0 1px 0 rgba(0,0,0,0.15);
background-color: ${(props)=>props.backcolor};
`
const Tr=styled.tr`
  
`
const Td=styled.td`
    border: 1px solid gray;
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
        
        {isimagebook&&
                                    <Imagebook images={data.detachfiles} 
                                    setisimage={setIsimagebook}
                                    userdata={{username:data.username,nickname:data.nickname,profileimg:data.userprofile}}
                                    noticedata={{title:data.title,likes:data.likes,red:data.red}}
                                    />}

        <Tr>
                            <Td>{data.num} </Td>
                            <Td style={{width:"10%"}}>
                                 <img   src={process.env.PUBLIC_URL+"/userprofileimg"+data.userprofile}
   style={{objectFit:"fill",width:"50%",height:"10%"}}
  
                /></Td>
                            <Td>{data.username} </Td>
                            <Td>{data.nickname} </Td>
                           
                            <Td onClick={()=>{noticedetail(data.num)}}>{data.title}</Td>
                            <Td onClick={()=>{noticedetail(data.num)}}>{data.text.slice(0,100)}</Td>
                            
                            <Td>{data.red}</Td>
                            <Td>{data.likes} </Td>
                            <Td>{data.commentcount}
                            <br/>
                            <FontAwesomeIcon icon={faComment} onClick={()=>{commentsearch(data.num)}}
                                            style={{cursor:"pointer"}}
                                        />
                            </Td>
                            <Td>{data.detachfiles.length}
                                <br/>
                                {!data.detachfiles.length==0&&
                            
                                <FontAwesomeIcon icon={faImages} onClick={()=>{imagebookon()}}
                                            style={{cursor:"pointer"}}
                                        />
                                }
                            </Td>
                            <Td>
                            <Button backcolor="blue" onClick={()=>{setIsupdate(true)}}>게시글수정</Button>
                            <Button backcolor="red" onClick={()=>{deletes(data.num)}}>게시글삭제</Button>
                            </Td>
                </Tr>
                                    
                </> )
}