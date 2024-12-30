import React, { useEffect } from "react";
import { useState } from "react";
function Statetest(){

    const [statenum,setStatenum]=useState(1)
    const [statenum2,setStatenum2]=useState(1)

    useEffect(()=>{
        console.log("스태이트넘"+statenum)
    },[statenum,statenum2])
    

    return (
        <>
        zz
    {statenum}    <button onClick={()=>{
        setStatenum(statenum+1)
    }}>더하기</button>
    <br/>
{statenum2}    <button onClick={()=>{
        setStatenum2(statenum2+1)
    }}>더하기2</button>
        </>
    )
}
export default Statetest;