import React from "react";
import styled from "styled-components";
import Userweather from "../UI/Userweather";
import Userweather2 from "../UI/Noticetools/Userweather2";

const Wrapper=styled.div`

width:16%;
height:100%;
position:fixed;
left:12%;
top:50px;
border: 1px solid
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