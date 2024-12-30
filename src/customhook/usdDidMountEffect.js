import React from "react";
import { useEffect,useRef } from "react";


const useDidMounteffect=(func,deps)=>{
    const didMount=useRef(false);

    useEffect(()=>{
        if(didMount.current){ 
           
            func();}
        else {
            
            didMount.current=true}; //이러면처음에 안실행대고 트루
    },deps)
}
export default useDidMounteffect;