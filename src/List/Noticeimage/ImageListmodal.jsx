import styled from "styled-components";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import AuthCheck from "../../customhook/authCheck";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import ImageListitem from "./ImageListitem";
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
    
    max-width: 830px;
    max-height: 800px;
    overflow: auto;
    
`
const Header=styled.div`
    border: 1px solid blue;
    color: blue;
`
const MainList=styled.div`
    color: black;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`

const CloseButton = styled.button`
  position: relative;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: black;
  transition: color 0.2s;

  &:hover {
    color: black;
    background: #f2f2f2;
    border-radius: 50%;
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
                미리보기 
                  <CloseButton onClick={()=>{props.ispreview(false)}}/>
        </Header>
        <MainList>
            {imagedata&&imagedata.map((data)=>{
                return (
                    <>
                    <ImageListitem data={data}/>
                    </>
                )
            })}
        </MainList>
                
            </Modalin>
        </Modalout>
    )
}