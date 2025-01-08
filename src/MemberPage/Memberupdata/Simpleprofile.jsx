import React from "react";
import styled from "styled-components";

const Wrapper=styled.div`
    position: fixed;
    border: 1px solid black;
    width: 230px;
    height:130px;
    z-index: 11;
    left:${props=>`${props.location.x}px`};
    top:${props=>`${props.location.y}px`};
`

const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`

export default function Simpleprofile(props){

    const {username,nickname,profileimg,mousexy}=props



    return (
        <Wrapper location={mousexy} onMouseOut={()=>{
            props.setprepage(false)
        }}>
             <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+profileimg}
   style={{objectFit:"fill",width:"100%",height:"100%"}}
  
                />
                
     </Profileview>
   
            {nickname}<br/>
            {username}

        </Wrapper>
    )



}