import React, { useState } from "react";
import styled from "styled-components";
import Admincommentupdate from "../../../customhook/Admintools/Admincommentupdate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const Tbody=styled.tbody`
    background-color:${(props)=>props.depth==1?"yellow": "skyblue"} ;

`
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
export default function CommentList(props){
    const {data,key,deletemethod}=props

    const [isupdate,setIsupdate]=useState(false);
    const navigate=useNavigate();

    const deletecom=(commentid)=>{
        if(confirm("정말로삭제하겠습니까?")){
            deletemethod(commentid)
        }
    }
    
    return(<>
       {isupdate?<><Admincommentupdate data={data} setisupdate={setIsupdate}/></>:""}
        <Tbody key={key} depth={data.depth}>
            <tr >
                
                <td>{data.id} </td>
                <td>{data.username} </td>
                <td>{data.nickname} </td>
                
                <td>{data.text}</td>
                <td>{data.noticenum}번글
                    <br/>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} onClick={()=>{
                        navigate(`/admin/notice/detail/${data.noticenum}`);
                    }}
                    style={{cursor:"pointer"}}
                    />

                </td>
                <td>{data.redtime}</td>
                
                <td>
                            <Button backcolor="blue" onClick={()=>{setIsupdate(true)}}>댓글수정</Button>
                            <Button backcolor="red" onClick={()=>{deletecom(data.id)}}>댓글삭제</Button>
                            </td>
             
                </tr>
              
                </Tbody>
            
                </>
    )
}