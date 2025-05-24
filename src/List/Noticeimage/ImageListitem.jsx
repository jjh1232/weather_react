import React from "react";
import styled from "styled-components";


const Wrapper=styled.div`
    width: 200px;
    height: 200px;
`
const Prev=styled.img`
     width: 200px;
    height: 200px;
    object-fit: fill;
    border: 1px solid black;
`
export default function ImageListitem(props){

    

    return (
        <Wrapper>
            <Prev src={process.env.PUBLIC_URL+props.data.path}/>

        </Wrapper>
    )

}