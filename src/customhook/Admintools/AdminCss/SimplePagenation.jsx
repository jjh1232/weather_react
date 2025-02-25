import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const Button=styled.button`
    background-color: ${(props)=>props.color};
    
`
const Wrapper=styled.div`
    position: relative;
    left:50%;
    float: left;
    border: 1px solid black;
`
const Pagenumcss=styled.div`
    position: relative;
    
    float: left;
    
`
export default function SimplePagenation(props){

    const {totalpage,currentpage,setcurrent}=props;
    
    const startpage=currentpage-5>0?currentpage-5:1
    const endpage=currentpage+5<=totalpage?currentpage+3:totalpage
    
    const pagearray=[];

    const navigate=useNavigate();
    //페이지처리
    const setcurrentpa=(page)=>{
        setcurrent(page)
    }
   

    for (let i=startpage;i<=endpage;i++){
        pagearray.push(i)
    }

    
    return (
        <Wrapper>
            {currentpage==1?""
            :<>
            {currentpage-5>startpage&&
            <>
            <button onClick={()=>{setcurrentpa(currentpage-5)}}>&#60;</button>
            
            <button onClick={()=>{setcurrentpa(1)}}>...1</button>
            </>
            }</>
            }
           
            {pagearray.map((d,key)=>{
                
                return(
                    <Pagenumcss key={key}>
                   
                    {d===currentpage?
                        <Button onClick={()=>{setcurrentpa(d)}} color="blue">
                        {d}
                    </Button>
                        :  <Button onClick={()=>{setcurrentpa(d)}} color="white">
                        {d}
                    </Button>
                    }
                 </Pagenumcss> 
                )
            })}

            {currentpage<totalpage?
            <>{currentpage+5<totalpage&&
                <>
            <button onClick={()=>{setcurrentpa(currentpage+5)}}>다음</button>

            <button onClick={()=>{setcurrentpa(totalpage)}}>...{totalpage}</button>
            </>
            }</>
            :""}
            
        </Wrapper>
    )
}