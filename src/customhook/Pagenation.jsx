import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


const Button=styled.button`
    background-color: ${(props)=>props.color};
    
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
       //
    }
   

    for (let i=startpage;i<=endpage;i++){
        pagearray.push(i)
    }

    
    return (
        <div>
            {querydata.page==1?""
            :<button onClick={()=>{setcurrentpa(querydata.page-1)}}>이전</button>}
           
            {pagearray.map((d)=>{
                
                return(
                    <>
                   
                    {d===querydata.page?
                        <Button onClick={()=>{setcurrentpa(d)}} color="blue">
                        {d}
                    </Button>
                        :  <Button onClick={()=>{setcurrentpa(d)}} color="white">
                        {d}
                    </Button>
                    }
                 </> 
                )
            })}

            {querydata.page<totalpage?<button onClick={()=>{setcurrentpa(querydata.page+1)}}>다음</button>:""}
            
        </div>
    )
}