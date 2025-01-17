import React, { useState } from "react";
import styled from "styled-components";
import Admincommentupdate from "../../../customhook/Admintools/Admincommentupdate";

const Tbody=styled.tbody`
    background-color:${(props)=>props.depth==1?"yellow": "skyblue"} ;

`

export default function CommentList(props){
    const {data,key,deletemethod}=props

    const [isupdate,setIsupdate]=useState(false);


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
                <td>{data.noticenum}</td>
                <td>{data.redtime}</td>
                
                <td>
                            <button onClick={()=>{setIsupdate(true)}}>댓글수정</button>
                            <button onClick={()=>{deletecom(data.id)}}>댓글삭제</button>
                            </td>
             
                </tr>
              
                </Tbody>
            
                </>
    )
}