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
width: 48%;
height: 100%;
font-size: 15px;

color: white;
margin: 1px 1px 1px;//위옆아래 마진
border-radius: 50px; //모서리
text-align: center;
transition: top .04s linear;
text-shadow: 0 1px 0 rgba(0,0,0,0.15);
background-color: ${(props)=>props.backcolor};
`

const Wrapper=styled.div`
    

`
const Td=styled.td`
    
    height: 50px;
    border: 1px solid gray;
    
    text-align: left;
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
                
                <Td>{data.id} </Td>
                <Td>{data.username} </Td>
                <Td>{data.nickname} </Td>
                
                <Td>{data.text}</Td>
                <Td>{data.noticenum}번글
                    <br/>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} onClick={()=>{
                        navigate(`/admin/notice/detail/${data.noticenum}`);
                    }}
                    style={{cursor:"pointer"}}
                    />

                </Td>
                <Td>{data.redtime}</Td>
                
                <Td>
                            <Button backcolor="blue" onClick={()=>{setIsupdate(true)}}>수정</Button>
                            <Button backcolor="red" onClick={()=>{deletecom(data.id)}}>삭제</Button>
                            </Td>
             
                </tr>
              
                </Tbody>
            
                </>
    )
}