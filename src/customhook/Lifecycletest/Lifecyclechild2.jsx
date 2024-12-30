import React, { useEffect, useState } from "react";


export default function Lifecyclechild2({test1,test2}){


    console.log("차일드시작부분22")
    console.log("22변수test1값:"+test1)
    const [state,setState]=useState("처음state22")
    console.log(`${state}`+`읽음22`);

    useEffect(()=>{
        console.log("차일드유즈이펙슽실행22")
        setState("차일드유즈이펙트에서스태이트변경22")
        console.log("차일드유즈이펙트로스태이트변경22")
        console.log("변수test1값:"+test2+"22")
        method();
        method2();
    },[state])

    const method=()=>{
        console.log("메소드시작과프롭스"+test1+"22")
    }
    let method2=()=>{
        console.log("렛함수"+test2+"22")
    }

    return (
        <>
            {console.log("차일드렌더링부분22")}
        </>
    )
}