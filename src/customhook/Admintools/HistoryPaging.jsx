import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const Button=styled.button`
    position: relative;
    background-color: ${(props)=>props.color};
    
    
`
const Wrapper=styled.div`
    position: relative;
    display: inline-block;
    width:300px;
    left:20%;
    
    border: 1px solid black;
`
const Pagenumcss=styled.span`
    position: relative;
    border: 1px solid green;
    
    
   
    
`
export default function HistoryPaging(props){

    const {currentpage,totalpage,setCurrentpage,refetch}=props;
    
    const startpage=currentpage-5>0?currentpage-5:1
    const endpage=currentpage+5<=totalpage?querydata.page+3:totalpage
    
    const pagearray=[];

    
    
    const pagerefetch=async (page)=>{

       await setCurrentpage(page)
        refetch();
       
    }
   

    for (let i=startpage;i<=endpage;i++){
        pagearray.push(i)
    }

    
    return (
        <Wrapper>
            {currentpage==1?""
            :
                <>
                 {currentpage-5>startpage&&
            <button onClick={()=>{pagerefetch(currentpage-5)}}>&#60; </button>
                 }</>}
            {pagearray.map((d,key)=>{
                
                return(
                    <Pagenumcss key={key}>
                      {d===currentpage?
                        <Button onClick={()=>{pagerefetch(d)}} color="blue">
                        {d}
                    </Button>
                        :  <Button onClick={()=>{pagerefetch(d)}} color="white">
                        {d}
                    </Button>
                    }
                  
                  </Pagenumcss> 
                )
            })}
         
            {currentpage<totalpage?
            <>
            {currentpage+5<totalpage&&
            <>
            <button onClick={()=>{pagerefetch(currentpage+5)}}>&#62;</button>
            
            ...{totalpage}
            </>}
            </>
            :""}
            
        </Wrapper>
    )
}