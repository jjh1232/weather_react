import React, { useState } from "react";
import ReactCrpooer from "./ReactCropper";
import SelfDraw from "./SelfDraw";
export default function Userimage(){
    const [viewmod,setViewmod]=useState(true)



    return (<>
    <button onClick={()=>{setViewmod(true)}}>일반</button> 
    
    <button onClick={()=>{setViewmod(false)}}>
        직접그리기
    </button>
        {viewmod?<ReactCrpooer/>:<SelfDraw/> }
    </>)
}