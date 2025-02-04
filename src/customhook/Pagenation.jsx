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
export default function Pagenation(props){

    const {totalpage,setCurrentpage,url,querydata}=props;
    
    const startpage=querydata.page-5>0?querydata.page-5:1
    const endpage=querydata.page+5<=totalpage?querydata.page+3:totalpage
    
    const pagearray=[];

    const navigate=useNavigate();
    //페이지처리
    const setcurrentpa=(page)=>{
        console.log("셋페이지"+page)
        if(querydata.option===null){
            navigate(url+`?page=${page}`)
        }else{
            navigate(url+`?page=${page}&option=${querydata.option}&searchtext=${querydata.keyword}`)
        }
       
    }
   

    for (let i=startpage;i<=endpage;i++){
        pagearray.push(i)
    }

    
    return (
        <Wrapper>
            {querydata.page==1?""
            :<>
            {querydata.page-5>startpage&&
            <>
            <button onClick={()=>{setcurrentpa(querydata.page-5)}}>&#60;</button>
            
            <button onClick={()=>{setcurrentpa(1)}}>...1</button>
            </>
            }</>
            }
           
            {pagearray.map((d,key)=>{
                
                return(
                    <Pagenumcss key={key}>
                   
                    {d===querydata.page?
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

            {querydata.page<totalpage?
            <>{querydata.page+5<totalpage&&
                <>
            <button onClick={()=>{setcurrentpa(querydata.page+5)}}>다음</button>

            <button onClick={()=>{setcurrentpa(totalpage)}}>...{totalpage}</button>
            </>
            }</>
            :""}
            
        </Wrapper>
    )
}