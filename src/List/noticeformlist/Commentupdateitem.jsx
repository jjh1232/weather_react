import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../UI/Button";

export default function Commentupdateitem(props){
    const {data,Setisupdate,noticeid,page}=props

    const [updatecomment,Setupdatecomment]=useState(data.text)


    
    return (
        <>
           {data.nickname}님<br/>
              
            <input type="text" defaultValue={data.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} /><br/>
            {data.redtime}<br/>
                  <Button title="수정완료" onClick={(e)=>{
                    
                  //  Setisupdate(commentupdate(data.id,data.username,updatecomment,e))
                    
                    }}/>
                  <Button title="취소" onClick={(e)=>{ e.stopPropagation() 
                    Setisupdate(false)}}/>
        </>
    )
}