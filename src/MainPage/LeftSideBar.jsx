import React from "react";
import styled from "styled-components";
import Userweather from "../UI/Userweather";
import Userweather2 from "../UI/Noticetools/Userweather2";

const Wrapper=styled.div`
// 위치는 MainLayout 의 grid(LeftCss)가 정한다.
width:100%;
/* 50% 로 두면 아래 화살표와 세 번째 예보 카드가 잘린다. 내용 높이에 맞춘다. */
height:auto;
padding-bottom: 10px;
overflow: hidden;

background-color: ${(props)=>props.theme.surfaceGlass};
-webkit-backdrop-filter: ${(props)=>props.theme.blur};
backdrop-filter: ${(props)=>props.theme.blur};
border: 1px solid ${(props)=>props.theme.border};
border-radius: ${(props)=>props.theme.radius};
box-shadow: ${(props)=>props.theme.shadow};
color: ${(props)=>props.theme.text};
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