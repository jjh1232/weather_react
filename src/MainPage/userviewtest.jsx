import axios from "axios";
import React, { useState,useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

function Userviewtest(){

    const [notice,setNotice]=useState([]);
    const [ref,inview]=useInView({
        threshold:0.1,
    })
    
    //const refnum=useRef(1);
    const [statenum,setStatenum]=useState(1)
    //ref는자동 안움직이면자동으로리렌더링이안되서 ;스태이트로..
    useEffect(()=>{
        console.log(statenum)
        axios.get("http://localhost:8081/open/notice?page="+statenum)
        .then((res)=>{
            console.log(res.data.content)
            setNotice(notice.concat(res.data.content))//객체는 concat으로해야하나봄
           
        })
        .catch((err)=>{
            console.log("error")
        })
    
 
    },[statenum])




useEffect(()=>{
    if(inview){
        //refnum.current++
        setStatenum(statenum+1)
        console.log("요소가 화면에보입니다"+statenum)
       
       }
    else{
        console.log("요소안잡")
    }
},[inview])

return (
    <>

    <div style={{width:"400px",height:"70px",overflowY: "scroll"}}>
    {notice &&notice.map((data,key)=>{
        return (
          
            <div>
                  {notice.length-1==key?
                    (
                        <div ref={ref}>
                        {data.title}
                        </div>
                    )
                :(
                    <div>
                    {data.title}
                    </div>
                )}
               
            </div>
        )
    })}
    
    </div>
    </>
)
}
export default Userviewtest