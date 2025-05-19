import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy as imagesicon } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heart } from "@fortawesome/free-regular-svg-icons";

const Wrapper=styled.div`

    border: 1px solid red;
    width: 270px;
    margin-right:1px ;
    height: 300px;
    //overflow: hidden;
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
    position: relative;
    border: 1px solid blue;
`
const MainImage=styled.img`
    width: 100%;
    height: 80%;
    object-fit: cover;
`
const Imagenumdiv=styled.div`
position: absolute;
    border: 1px solid red;
    top: 1px;
    z-index: 10;
`
const Likebuttondiv=styled.div`
position: absolute;
     border: 1px solid red;
     z-index: 10px;
     bottom: 10px;
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
            <Imagenumdiv>
                <FontAwesomeIcon icon={imagesicon}/>
            </Imagenumdiv>
            <Likebuttondiv>
                <FontAwesomeIcon icon={heart}/>
            </Likebuttondiv>
        </Main>
      

        </Wrapper>
    )

}