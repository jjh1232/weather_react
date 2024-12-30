import React from "react";
import styled from "styled-components"

const StyledButton = styled.button`
color:${(e)=>{return e.color ||"gray"}};
background:${(e)=>e.backgroundcolor || "white" };

`



function Button(props){
  const{title,color,backgroundcolor,onClick}=props;
  
  return(
    <StyledButton
    color={color}
    backgroundcolor={backgroundcolor}
    onClick={onClick}>
      {title}
      </StyledButton>

    
  )
}

export default Button;