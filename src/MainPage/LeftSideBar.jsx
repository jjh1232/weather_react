import React from "react";
import styled from "styled-components";
import Userweather from "../UI/Userweather";

const Wrapper=styled.div`
width:15%;
height:120%;
position:absolute;
left:13%;
top:3px;
border: 1px solid
`

function LeftSideBar(){
 
    if(window.location.pathname===`/userprofile`) return null
    
    if(window.location.pathname===`/manyimage`) return null
    if(window.location.pathname.includes("/admin")) return null
    return (
        <Wrapper>
            <Userweather/>
            
        </Wrapper>
    )
}
export default LeftSideBar;