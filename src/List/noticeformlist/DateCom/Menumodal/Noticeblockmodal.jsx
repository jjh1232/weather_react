import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import CreateAxios from "../../../../customhook/CreateAxios";


const Modalout=styled.div`
    position: fixed;
    display: flex;
    width: 600px;
    height: 400px;
    top: 20%;
    left: 29.5%;
    justify-content: center;
    align-items: center;
    z-index: 15;
  background: rgba(0, 0, 0, 0.5);
`
const Modalin=styled.div`
    background-color: #ffffff;
    width:500px;
    height: 300px;
    padding:15px;
    z-index: 15;
`
const Exitbutton  =styled.div`
position: absolute;
top: 15px;
left:0%;

z-index: 10;

display: inline-block;


 &::before {
    content: "";
    width: 40px;
    top: 0%;
    left: 0%;
    position: absolute;
    border-bottom: 10px solid black;
    transform:  rotate(45deg);
  }

  &::after {
    top: 0%;
    
    content: "";
    width: 40px;
    left:0%;
    position: absolute;
    border-bottom: 10px solid black;
    transform:  rotate(-45deg);
  }
`
const CheckboxCss=styled.div`
    position: relative;
    display: flex;
    top: 10%;
    height: 150px;
    flex-wrap: wrap;
    border: 1px solid blue;
`
const Checklist=styled.input`
       
`
const Checkdiv=styled.div`
  position: relative;
     
     width: 49%;`
const Checklabel=styled.label`
   

`
const Submitcss=styled.button`
position: relative;
float: right;
top: 30px;
  background-color: transparent;
    border: 2px solid red;
    border-radius: 0.6em;
    color:red;
    cursor: pointer;
    display: flex;
    align-self: center;
    margin:20px;
    font-size: 20px;
    padding: 0.5em 0.7em;
    transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
    &:hover{
        box-shadow: 0 0 40px 40px red inset;
        color:white;
        transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
    }
  
`


export default function Noticeblockmodal(props){
    const {ismodal,noticeid}=props
    const [checklist,setChecklist]=useState([]);
    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();
    const blocklist={
        spam:"스팸및광고게시글",
        discomfort:"불쾌감을주는게시글",
        violent:"폭력적인게시글",
        nsfw:"선정적인게시글",
        nointerested:"관심없는게시글",
        baduser:"올바르지않은유저의게시글",
        noreason:"이유없음",
        etc:"기타"
    }
    //맵이 더좋다는데 맵이생성이안됨...나왔댓는디

    const checkedhandler=(e,key,isChecked)=>{
        if(!isChecked){
            setChecklist(checklist.filter((el)=>el !==key));
          }
          else{
       if(checklist.length>2){
            alert("최대3개까지만 선택가능합니다")
            setChecklist(checklist.filter((el)=>el !==key))
             e.target.checked=false
              }else{     
        if(isChecked){
            setChecklist((prev)=>[...prev,key]);
        }else if(!isChecked){
            setChecklist(checklist.filter((el)=>el !==key));
        }
    }
    }
    }
    const submitmutation=useMutation({
        mutationFn:()=>{
            axiosinstance.post(`/noticeblock`,{
                noticeid:noticeid,
                reason:checklist
            })
        },onSuccess:()=>{
            queryclient.invalidateQueries({queryKey:["blockcheck"]})
            alert("게시글을차단하였습니다!")
            ismodal(false)
          }
    })
    const submithandler=()=>{
        submitmutation.mutate();
    }
    return (
        <Modalout>
            <Exitbutton onClick={()=>{ismodal(false)}}></Exitbutton>
            <Modalin>
            게시글을 차단하는 이유를 작성해 주십시오(최대3개입력가능)
            <CheckboxCss>
              
               {Object.entries(blocklist).map(([key,value],index)=>{
                return (
                <Checkdiv>
                <Checklabel key={index}>
                    <Checklist type="checkbox" onChange={(e)=>{checkedhandler(e,key,e.target.checked)}}/>
                    {value}
                    </Checklabel>
                    </Checkdiv>
                )
               })}
            </CheckboxCss>
               <Submitcss onClick={submithandler}>차단하기</Submitcss>
            </Modalin>
            
        </Modalout>
    )
}