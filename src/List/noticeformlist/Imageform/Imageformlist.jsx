import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages as imagesicon } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullheart } from "@fortawesome/free-solid-svg-icons";
import CreateAxios from "../../../customhook/CreateAxios";
import AuthCheck from "../../../customhook/authCheck";

const Wrapper=styled.div`

    border: 1px solid gray;
    width: 270px;
    margin-right:1px ;
    height: 300px;
    overflow: hidden;
`
const Header=styled.div`
   border : 1px solid blue ;
   display: flex;
   height: 50px;
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
   
    top: 1px;
    right: 2px;
    
    border-radius: 4px;
    padding: 3px 5px;
    font-size: 13px;
    background-color: rgba(0, 0, 0, 0.5); 
  color: white; 
`
const Likebuttondiv=styled.div`
position: absolute;
       
     bottom: 70px;
     right: 5px;
   
  color: white; 
`


export default function Imageformlist(props){
    const {content}=props;
    let logincheck=AuthCheck();
   let axiosinstance=CreateAxios()
    const Noticelikehandler=()=>{
        if(logincheck){
             
             axiosinstance.get(`/noticelike/${content.id}`).then((res)=>{
                alert(res.content)
             }).catch((err)=>{
                alert ("좋아요실패했어요!")
             })
            
        }else{
            alert("로그인후이용해주세요")
        }
    }

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
                
                <FontAwesomeIcon icon={imagesicon} /> {content.imagenum}
            </Imagenumdiv>
            <Likebuttondiv onClick={()=>{Noticelikehandler()}}>
                <FontAwesomeIcon icon={heart} size="xl" color={content.likely?"red":"black"} style={{position:"absolute",right:"1px",bottom:"1px"}}/>
                <FontAwesomeIcon icon={fullheart} size="xl" color={content.likely?"red":"white"}  style={{position:"absolute",right:"1px",bottom:"1px"}}/>

            </Likebuttondiv>
        </Main>
      

        </Wrapper>
    )

}