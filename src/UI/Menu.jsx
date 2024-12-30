import React from "react";
import styled from "styled-components";


const Wrapper=styled.div`
width: 100px;
  height: 100px;
  background-color:gray;
  border-radius: 50%;
`

function Menu(props){

    const {title,onclick}=props;

  return (
    <Wrapper onClick={onclick}>{title}</Wrapper>
  )
}
export default Menu;