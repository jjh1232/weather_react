import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNoticeupdate from "../../../customhook/Admintools/AdminNoticeupdate";
import Imagebook from "../../../customhook/Imagebook";


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
                                {!data.detachfiles.length==0&&<button 
                                onClick={()=>{imagebookon()}}>이미지북</button>}
                                

                            </td>
                            <td>
                            <button onClick={()=>{setIsupdate(true)}}>게시글수정</button>
                            <button onClick={()=>{deletes(data.num)}}>게시글삭제</button>
                            </td>
                </tr>
                                    {isimagebook&&<Imagebook images={data.detachfiles}/>}
                </> )
}