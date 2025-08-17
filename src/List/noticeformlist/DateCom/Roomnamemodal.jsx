import React, { useState } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom"
import { useMutation } from "@tanstack/react-query";
import CreateAxios from "../../../customhook/CreateAxios";
const Outdiv=styled.div`
        position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
      display: flex;
    
    justify-content: center;
    //align-items: center;
    z-index: 350;
`
const Wrapper=styled.div`
        background-color:#525e79;
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
    height: 25%;
    border: 1px solid red;
`
const Main=styled.div`
    display: flex;
    flex-direction: column;
    //justify-content: center;
    
    align-items: center;
       height: 50%;
       border: 1px solid blue;
       gap: 4px;
`
const Bottomdiv=styled.div`
    display: flex;
    justify-content: space-between;
       height: 20%;
    padding: 0 16px; /* 좌우 여백 추가 가능 */
 
  border: 1px solid green;
`
const Roomnameinput=styled.input`
     margin-top: 15px;

`
const Validdiv=styled.div`
    
`

const Button=styled.button`
    
`


export default function Roomnamemodal(props){
    const {beforename,memberroomid,setisroomname}=props;

    const [newroomname,setNewroomname]=useState(beforename);

    const axiosinstane=CreateAxios();

    const changehandler=(e)=>{
            setNewroomname(e.target.value)
    }
    //방이름수정
    const roonnamemutation=useMutation({
        mutationFn:()=>{
            axiosinstane.put(`/changeroomname/${memberroomid}`,{
                roonmane:newroomname
            })
        },onSuccess:()=>{
            
        },onError:()=>{

        }
    },
)

    const submithandler=()=>{

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
                        발리드
                    </Validdiv>
                </Main>
                <Bottomdiv>
            <Button onClick={()=>setisroomname(false)}>
                    취소
            </Button>
            <Button>
                수정
            </Button>
                </Bottomdiv>
            </Wrapper>
        </Outdiv>
,document.getElementById('phone-ui')
    )
}