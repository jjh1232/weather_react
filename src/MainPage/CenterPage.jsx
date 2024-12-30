import React, { useState } from "react";
import styled from "styled-components";

import Noticeex from "../Noticepage/Noticeex";

import { useSearchParams } from "react-router-dom";

const Wrapper=styled.div`


`


export default function CenterPage(props){
   const [query,setQuery]=useSearchParams({form:"noticeform"});
   let forms=query.get("form")

    //window.addEventListener(`resize`,()=>{setScreenSize}))
    

    return(
      
        <Wrapper>
          <div >
     
     
                    
            
            <Noticeex form={forms}/>
            </div>
            </Wrapper>
    )

}