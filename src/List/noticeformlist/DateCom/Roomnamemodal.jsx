import React, { useState } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAxios from "../../../customhook/CreateAxios";
import { useCookies } from "react-cookie";
const Outdiv=styled.div`
        position: absolute;
    width: 100%;
    height: 100%;
    background: hsla(0, 0%, 0%, 0.5);
      display: flex;
    
    justify-content: center;
    //align-items: center;
    z-index: 350;
`
const Wrapper=styled.div`
        background-color:#5a87ac;
    position: relative;
    width: 75%;
    height: 25%;
    z-index: 400;
    display: flex;
    flex-direction: column;
    border-radius: 10%;
     overflow: hidden;
     border: 1px solid black;
     margin-top: 80px;
`
const Header=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30%;
    font-size: 20px;
  
`
const Main=styled.div`
    display: flex;
    flex-direction: column;
    //justify-content: center;
    
    align-items: center;
       height: 40%;
      
       gap: 4px;
`
const Bottomdiv=styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
       height: 25%;
    padding: 0 24px; /* 좌우 여백 추가 가능 */
    margin-bottom: 1px;
 
`
const Roomnameinput=styled.input`
       margin-top: 5px;
  padding: 3px 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 75%;
  box-sizing: border-box;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: #999;
  }

`
const Validdiv=styled.div`
    color: red;
    font-size:13px;
    
`

const Button = styled.button`
  background-color: ${(props)=>props.color==="red"?"#e67070":"#4a90e2"};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 5px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  width: 70px;
  height: 30px;

  &:hover {
    background-color: ${(props)=>props.color==="red"?"#af6464":"#357abd"};
    
  }

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;


export default function Roomnamemodal(props){
    const {beforename,memberroomid,setisroomname}=props;

    const [newroomname,setNewroomname]=useState(beforename);

    const axiosinstane=CreateAxios();
    const [cookie,setcookie]=useCookies();
 
    const queryClient=useQueryClient();
    //방이름수정


    //valid state
    const [isvalid,setIsvalid]=useState(false);
    const [errmsg,setErrmsg]=useState("");

    const validateRoomname=(name)=>{
        const lengthValid=name.length>=1 &&name.length<=20; //20글자내외
        const specialCharValid = /^[a-zA-Z0-9가-힣ㄱ-ㅎ\s]+$/.test(name); // 영문, 숫자, 한글, 공백만 허용

        if(!lengthValid){
            setErrmsg("1글자이상 20자 이하로 작성해주십시요!");
            return false;
        }
        if(!specialCharValid){
            setErrmsg("영문,숫자,한글,공백만허용합니다")
            return false;
        }
        setErrmsg("");//문제없을시초기화
        return true;
    }

       const changehandler=(e)=>{
            const value=e.target.value;
            
            setNewroomname(value)
           setIsvalid(validateRoomname(value))
        }
    //뮤태이션
    const roomnamemutation=useMutation({
        mutationFn:()=>{
           return axiosinstane.put(`/changeroomname/${memberroomid}`,{
                roomname:newroomname
            })
        },onSuccess:(data)=>{
            console.log("성공:",data)
            //두개다하는게 좋다함
            queryClient.invalidateQueries(["chatroommeta",cookie.userinfo.userid])
             queryClient.invalidateQueries(["chatroominfo",cookie.userinfo.userid])
             setisroomname(false)
        },onError:(error)=>{
            console.log("에러:",error.response)
            if(error.response.data.errorcode==="SAME_ROOMNAME"){
                alert("동일한방네임입니다")
            }else  if(error.response.data.errorcode==="NOT_FOUND_MEMBERROOM"){
                alert("해당하는방이없습니다")
            }
        }
    },
)

    const submithandler=()=>{
          if(newroomname===beforename){
            alert("기존방이름과 같습니다")
            return ;
        }
        if(!isvalid){
            alert("방이름규칙을 확인해주세요")
            return ;
        }
      
        roomnamemutation.mutate();
    }


    return ReactDOM.createPortal(
        <Outdiv onClick={(e)=>{e.stopPropagation()}}>
            <Wrapper>
                <Header>
                    방이름변경
                </Header>
                <Main>
                    <Roomnameinput value={newroomname} onChange={changehandler}/>
                    <Validdiv>
                        {errmsg}
                    </Validdiv>
                </Main>
                <Bottomdiv>
            <Button onClick={()=>setisroomname(false)} color="red">
                    취소
            </Button>
            <Button onClick={()=>submithandler()} color="blue">
                변경
            </Button>
                </Bottomdiv>
            </Wrapper>
        </Outdiv>
,document.getElementById('phone-ui')
    )
}