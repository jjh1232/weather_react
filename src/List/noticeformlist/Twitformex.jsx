import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Twitformlist from "./Twitformlist";

import axios from "axios";
import Searchtool from "../../UI/Noticetools/Searchtool";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Noticeformbutton from "../../Noticepage/NoticePattern/Noticeformbutton";
import Noticecreate from "../../Noticepage/Noticecreate"
import Twitnoticecreate from "./Twitnoticecreate";
import CreateAxios from "../../customhook/CreateAxios";
import AuthCheck from "../../customhook/authCheck";


const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
border: 1px solid blue;
 color:${props => props.theme.text};
 background:${props => props.theme.background};
 top: 8%;

`
const Modalout=styled.div`
width:45% ;
height:85% ;
position: fixed;
background:rgba(0,0,0,0.5);
display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center; //위로부터 중간
`

const Modalin=styled.div`
padding: 15px;
width:90%;
height:70%;
background-color: #FFFFFF;

`
//헤더
const Headerdiv=styled.div`
    display: flex;
    
    border: 1px solid red;
`
const Creatediv=styled.div`
    
     
`
const CreateButton=styled.button`
    //display: inline-flex;
  align-items: center;
  outline: none;
  border: 1px solid black;
  border-radius: 4px;
  white-space: nowrap;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 0 1rem;
  height: 2.25rem;
  font-size: 1rem;
  background: #228be6;  /* 솔리드 컬러 */
  transition: background 0.2s;
  /* 기본 그림자 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  &:hover {
    background: #339af0;
  }
  &:active {
    background: #1c7ed6;
  }
`
const Searchdiv=styled.div`
     //border: 1px solid yellow;
     width: 50%;
`
const Formdiv=styled.div`
     border: 1px solid green;
     width: 50%;
`
const Maindatadiv=styled.div`
   
`

export default function Twitformex(props){
    //const {posts,onClickItem,noticecreate,querydatas
        //로케이션으로 좋아요 와 일반게시글차이만들자
     
   
       // const axiosinstance=CreateAxios();

      

       const [iscreate,setIscreate]=useState(false)
       
       //==============렌더링!==============================================================
       return (
        <>
       
        
       
        <Wrapper>
        <Headerdiv>
        
            <Creatediv>
        <CreateButton onClick={()=>{
            Createnotice();
        }}> 글작성하기 </CreateButton>
        </Creatediv>
       
       <Formdiv>
        <Noticeformbutton/>
    </Formdiv>
        
                    <Searchdiv>
    <Searchtool
     
        />
         </Searchdiv>
 
</Headerdiv>

        {iscreate &&<Modalout>

        <Modalin><button onClick={()=>{setIscreate(false)}}>글작성끄기</button>
        <Twitnoticecreate setIscreate={setIscreate}/>
        </Modalin>
        
        </Modalout>}
       
            
        <Maindatadiv>
            <Outlet/>
         </Maindatadiv>   
            
            
        
            
      
        </Wrapper>
        </>
    )
}
