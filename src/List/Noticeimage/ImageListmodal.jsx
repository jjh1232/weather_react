import styled from "styled-components";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import AuthCheck from "../../customhook/authCheck";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import ImageListitem from "./ImageListitem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX as close } from "@fortawesome/free-solid-svg-icons";

const Modalout=styled.div`
    background-color: rgba(255,255,255,0.3);
    top: 0; left: 0; right: 0; bottom: 0;
     position: fixed;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  
`
const Modalin=styled.div`
position: relative;
display: flex;
flex-direction: column;
    background-color: rgb(255, 255, 255);
    
    max-width: 900px;
    max-height: 900px;
    overflow: auto;
   
    border-radius:5%;
    border: 2px solid black;
    
`
const Header=styled.div`
    border: 1px solid blue;
    position: relative;
    color: blue;
    text-align: center;
     display: flex;
    justify-content: center;   /* 가로 중앙 */
    align-items: center;  
    min-height: 50px;

`
const MainListWrapper=styled.div`
display: flex;
    justify-content: center;
  align-items: center;
  padding: 30px;
  border: 1px solid red;
`
const MainList=styled.div`
border: 1px solid blue;
    color: black;
    display: flex;
    flex-wrap: wrap;
     
    gap: 7px;
   //   justify-content: center;
 // align-items: center;
`

const CloseButton = styled(FontAwesomeIcon)`
position: absolute;
align-self: flex-end;
top: 5px;
right: 10px;
 color: black;
 cursor: pointer;
 size: 3x;
   transition: color 0.2s;
  &:hover {
    color: #ff4d4f;
  }
  
`;
export default function ImageListmodal(props){

    const axiosinstance=AuthCheck()? CreateAxios():axios;

    const {data:imagedata,isSuccess,isLoading,error}=useQuery({
        queryKey:["imagepreview",props.noticeid],
        queryFn:async ()=>{
            const res=await axiosinstance.get(`/open/noticeimagepreview/${props.noticeid}`)

            console.log("이미지리스트",res.data);
            return res.data;
        }
        
        
    })


    return (
        <Modalout>
            <Modalin>
            <Header>
                {props.noticeid}번글 이미지 미리보기 
                  <CloseButton icon={close} onClick={(e)=>{e.stopPropagation()//외부끄고 내부에서하는거
                    ,props.ispreview(false)}} size="3x"/>
        </Header>
          <MainListWrapper>
        <MainList>
            {imagedata&&imagedata.map((data)=>{
                return (
                    <>
                    <ImageListitem data={data}/>
                    </>
                )
            })}
          
              </MainList>
            </MainListWrapper>
      
                
            </Modalin>
        </Modalout>
    )
}