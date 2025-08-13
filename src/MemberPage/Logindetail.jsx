import React from "react";
import styled from "styled-components";

const Wrapper=styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
  
`
//헤더로고
const Contentdiv=styled.div`
    display: flex;
    
    flex-direction: column;
    width: 50%;

    align-items: center;
    border: 1px solid blue;

`
const Headerdiv=styled.div`
    
`
const Maindiv=styled.div`
    
`
const Bottomdiv=styled.div`
    
`



export default function Logindetail(){

    return (
        <Wrapper>
            <Contentdiv>
            <Headerdiv>
                로고
                </Headerdiv>        
                <Maindiv>
                    로그인데이터
                </Maindiv>
                <Bottomdiv>
                    아이디찾기 같은거
                </Bottomdiv>
                </Contentdiv>
        </Wrapper>
    )
}