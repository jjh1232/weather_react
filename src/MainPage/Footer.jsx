import React from "react";
import Stompalrams from "./Stompalram";
import styled from "styled-components";

const Wrapper=styled.div`
position:relative;

border-top:1px solid ${(props)=>props.theme.border};
color:${(props)=>props.theme.textMuted};
font-size:13px;
letter-spacing:-0.01em;

transform : translateY(0%);

`
function Footer(){
    if(window.location.pathname===`/manyimage`) return null
    if(window.location.pathname.includes("/admin")) return null
    return (
        <Wrapper>
         
         <h1>푸터</h1>
        
        
         
        </Wrapper>
       
    )
}
export default Footer;