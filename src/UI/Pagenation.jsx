import React from "react";
import { useState } from "react";

function Pagenation(props){

    const {currentpage,getpagedata,totalpages}=props;

   

    const nextpages=[];
    const beforepages=[];
            
const postData=(currentpagedata)=>{
    getpagedata(currentpagedata);
}

if(currentpage===1){

    for(let i=currentpage; i<currentpage+3;i++){
        if(i<totalpages){
            nextpages.push(i+1);
        }
       
    }

   
}else if(currentpage === totalpages){
    for(let i=currentpage-4;i<currentpage;i++){
        if(i>1){
            beforepages.push(i);
        }
    }

}else{
    
    for(let i=currentpage; i<currentpage+3;i++){
        if(i<totalpages){
            nextpages.push(i+1);
        }
       
    }
    for(let i=currentpage-3;i<currentpage;i++){
        if(i>=1){
            beforepages.push(i);
        }
    
    }
}

            return(<div key="pagenation">
                    
            {beforepages.map((page)=>{
                return (
                   <span onClick={(e)=>postData(page)}>
                    {page}{" "}
                    </span>
                )
            })}

                <span  onClick={(e)=>postData(page)}>
                {currentpage}{" "}
                </span>
            {nextpages.map((page)=>{
                return(
                    <span key="nextdata"onClick={(e)=>postData(page)}  >
                    {page} {" "}
                    </span >
                )
            })}            
            <br/> 
            {currentpage}
             </div>   
            )
    
    


}
export default Pagenation;