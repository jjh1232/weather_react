import React from "react";
import styled from "styled-components";

const Wrapper=styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    width: 250px;
    min-height:150px;
    background:${(props)=>props.theme.simplebackground};
    color: ${(props)=>props.theme.text};
    z-index: 11;
    left:${props=>`${props.location.x}px`};
    top:${props=>`${props.location.y}px`};
    border:1px solid blue;
`
const Headerdiv=styled.div`
    display: flex;
`
const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
const FollowButtondiv=styled.div`
    display: flex;
    margin-left: auto;
`
const BodyDiv=styled.div`
    display: flex;
    flex-direction: column;
`
const Nicknamediv=styled.div`
    display: flex;
`
const Usernamediv=styled.div`
    display: flex;
`
const Simpleprdiv=styled.div`
    display: flex;
`
const Bottomdiv=styled.div`
    display: flex;
`
const Followdiv=styled.div`
    
`
const Followerdiv=styled.div`
    
`

export default function Simpleprofile(props){

    const {username,nickname,profileimg,mousexy,onmouseEnter,onmouseLeave}=props



    return (
        <Wrapper location={mousexy} onMouseLeave={()=>{
            onmouseLeave();
        }}>
            <Headerdiv>
               <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+profileimg}
   style={{objectFit:"fill",width:"100%",height:"100%" ,background:"white"}}
  
                />
                
     </Profileview>
     <FollowButtondiv>
        팔로우버튼
     </FollowButtondiv>

            </Headerdiv>
            <BodyDiv>
            <Nicknamediv>
                {nickname}
            </Nicknamediv>
            <Usernamediv>
                {username}
            </Usernamediv>
            <Simpleprdiv>
                자기소개
            </Simpleprdiv>
            </BodyDiv>
          <Bottomdiv>
            <Followdiv>
                팔로우유저수
            </Followdiv>
            <Followerdiv>
                팔로워유저수
            </Followerdiv>
          </Bottomdiv>
   
           

        </Wrapper>
    )



}