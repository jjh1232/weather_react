import React from "react";
import styled from "styled-components";

const Wrapper=styled.div`
    border: 1px solid red;
    width: 270px;
    margin-right:1px ;
    height: 300px;
    overflow: hidden;
`
const Header=styled.div`
   border : 1px solid blue ;
   display: flex;
`
const Profileimg=styled.img`
    width: 40px;
    height: 40px;
    background-color: white;
    border: 1px solid black;
`
const Userandtitlediv=styled.div`
    display: flex;
    flex-direction: column;
`
const Userdatadiv=styled.div`
    border-bottom: 1px solid black ;
`
const Titlediv=styled.div`
    
`
const Main=styled.div`
    width: 100%;
    height: 100%;
    
    border: 1px solid blue;
`
const MainImage=styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export default function Imageformlist(props){
    const {content}=props;


    return (
        <Wrapper>
            <Header>
                <Profileimg src={process.env.PUBLIC_URL+"/userprofileimg"+content.userprofile}/>
        <Userandtitlediv>
            <Userdatadiv>
                 {content.nickname}
                {content.username}
       
            </Userdatadiv>
           <Titlediv>
             {content.title}
            </Titlediv> 
       
        </Userandtitlediv>
    
            </Header>
        <Main>
            <MainImage src={process.env.PUBLIC_URL+content.mainimage}/>
        </Main>
      

        </Wrapper>
    )

}