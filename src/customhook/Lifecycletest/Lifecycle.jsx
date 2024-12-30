import React from "react";
import Lifecyclechild from "./Lifecyclechild";
import { useState } from "react";
import Lifecyclechild2 from "./Lifecyclechild2";
export default function Lifecycle(){

    console.log("라이프사이클패런트시작")
    const [form,setForm]=useState();

    const formchange={
        child1:  <Lifecyclechild test1={"프롭스1"} test2={"프롭스2"}/>,
        child2:<Lifecyclechild2 test1={"프롭스1"} test2={"프롭스2"}/>
    }
    

    return (
        <>
        
        { console.log("라이프사이클패런트렌더링")}
        <button onClick={()=>{
            setForm("child1")
        }}>차일드1</button>

<button onClick={()=>{
            setForm("child2")
        }}>차일드2</button>

        <br/>
        {formchange[form]}
        </>
    )
}