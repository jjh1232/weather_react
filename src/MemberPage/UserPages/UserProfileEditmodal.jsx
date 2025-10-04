import React from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
const Outdiv=styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(58, 184, 64, 0.5);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Indiv=styled.div`
width: 30%;
height: 60%;
    background-color: rgba(255,255,255,1);
    display: flex;
    flex-direction: column;
`
const Headerdiv=styled.div`
    
`
const Bodydiv=styled.div`
    
`
const Backgrounddiv=styled.div`
    
`
const Profilediv=styled.div`
    
`
const Userdatadiv=styled.div`
    display: flex;
    flex-direction: column;
`
const Nickname=styled.input`
    
`
const Introinput=styled.input`
    
`
export default function UserProfileEditmodal() {
    console.log("에딧모달실행")
   
  return (
    <Outdiv>
      <Indiv>
        <Headerdiv>
            저장등
        </Headerdiv>
        <Bodydiv>
            <Backgrounddiv>

            </Backgrounddiv>
            <Profilediv>

            </Profilediv>
            <Userdatadiv>
                <Nickname />
                <Introinput/>
            </Userdatadiv>
        </Bodydiv>

      </Indiv>
    </Outdiv>
    
  );
}