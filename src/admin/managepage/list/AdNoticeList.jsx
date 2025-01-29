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
width: 49%;
height:100%;
font-size: 14px;
padding: 2% 2%;
color: white;
//margin: 1px 1px 1px;//위옆아래 마진
border-radius: 10px; //모서리
text-align: center;
transition: top .04s linear;
text-shadow: 0 1px 0 rgba(0,0,0,0.15);
background-color: ${(props)=>props.backcolor};
`
const Tr=styled.tr`
  
`
const Td=styled.td`
    width: 20px;
    height: 50px;
    border: 1px solid gray;
    border-collapse: collapse;
    text-align: left;
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
                            <Td style={{width:"3%"}}>{data.num} </Td>
                            <Td style={{width:"4%"}}>
                                 <img   src={process.env.PUBLIC_URL+"/userprofileimg"+data.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%"}}
  
                /></Td>
                            <Td style={{width:"13%"}}>{data.username} </Td>
                            <Td style={{width:"5%"}}>{data.nickname} </Td>
                           
                            <Td style={{width:"50%"}} onClick={()=>{noticedetail(data.num)}}>{data.title}</Td>
                           
                            
                            <Td style={{width:"10%"}}>{data.red}</Td>
                            <Td style={{width:"3%"}}>{data.likes} </Td>
                            <Td style={{width:"3%"}}>{data.commentcount}
                            <br/>
                            <FontAwesomeIcon icon={faComment} onClick={()=>{commentsearch(data.num)}}
                                            style={{cursor:"pointer"}}
                                        />
                            </Td>
                            <Td style={{width:"3%"}}>{data.detachfiles.length}
                                <br/>
                                {!data.detachfiles.length==0&&
                            
                                <FontAwesomeIcon icon={faImages} onClick={()=>{imagebookon()}}
                                            style={{cursor:"pointer"}}
                                        />
                                }
                            </Td>

                            <Td style={{float:"left", height:"95%" ,width:"100%"}}>
                            <Button backcolor="blue" onClick={()=>{setIsupdate(true)}}>수정</Button>
                            <Button backcolor="red" onClick={()=>{deletes(data.num)}}>삭제</Button>
                            </Td>
                </Tr>
                                    
                </> )
}