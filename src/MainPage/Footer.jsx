import React from "react";
import Stompalrams from "./Stompalram";
import styled from "styled-components";

const Wrapper=styled.div`
position:relative;
left:15.5%;
border:1px solid;

transform : translateY(0%);

`
function Footer(){
    if(window.location.pathname===`/manyimage`) return null
    return (
        <Wrapper>
         
         <h1>푸터</h1>
        
        
         
        </Wrapper>
       
    )
}
export default Footer;