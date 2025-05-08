import React from "react";
import styled from "styled-components";
import Userweather from "../UI/Userweather";
import Userweather2 from "../UI/Noticetools/Userweather2";

const Wrapper=styled.div`
border: 1px solid black;
width:16%;
height:50%;
position:fixed;
left:11.64%;
top:56px;
background-color: ${(props)=>props.theme.background};
`

function LeftSideBar(){
 
    if(window.location.pathname===`/userprofile`) return null
    
    if(window.location.pathname===`/manyimage`) return null
    if(window.location.pathname.includes("/admin")) return null
    return (
        <Wrapper>
            {//<Userweather/>
            }
            <Userweather2/>
        </Wrapper>
    )
}
export default LeftSideBar;