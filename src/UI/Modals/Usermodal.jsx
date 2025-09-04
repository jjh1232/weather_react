import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../customhook/authCheck";
import ReactDom from "react-dom"
const Outdiv=styled.div`
position: absolute;
    width: 100%;
    height: 100%;
    // background-color: white;
     top: 22px;
    z-index: 30;
`
const Wrapper=styled.div`
display: flex;
flex-direction: column;

position:fixed; 
justify-content:center;
background:#6385c5;
top:${(props)=>props.modaly}px;
left:${(props)=>props.modalx}px;
z-index: 40;
`
const Menulist=styled.div`
padding: 3px;
    border: 1px solid black;
    cursor: pointer;
    font-size: 15px;
`


function Usermodal(props){
    const {ModalX,ModalY,username, usernickname,chatroomdata,setismodal,profileid}=props;
    //const [modalref]=useRef();
    const axiosinstance=CreateAxios();
    const [followcheck,setFollowcheck]=useState();
    const navigate=useNavigate();
 //유스이펙트로 모달외클릭 감지하기
    const logincheck=AuthCheck();

   const [userdata,setUserdata]=useState({
   username:[username],
   usernickname:[usernickname]
   });
    useEffect(()=>{
        onfollowcheck();
    },[followcheck])

    //팔로우체크
    const onfollowcheck=()=>{
        if(logincheck){
            console.log("로그인되있음")
            axiosinstance.get("/followcheck?friendname="+username)
            .then((res)=>{
                console.log(res.data)
                setFollowcheck(res.data)
            }).catch((err)=>{
                console.log("에러")
            })
        }
        else{
            console.log("로그인안되있음")
        }
    }
    //팔로우 추가
    const onfollow=(e)=>{
        e.preventDefault();
        console.log("팔로잉실행!")
        if(logincheck){
        axiosinstance.get("/follow?friendname="+username)
        .then((res)=>{
            alert("팔로우성공!")
        }).catch((err)=>{
            alert("팔로우실패!")
        })
    } else{
        alert("로그인을먼저해주세요!")
    }
    }
    //팔로우취소
    const onunfollow=(e)=>{
        e.preventDefault();
        console.log("언팔로우!실행")
    
        axiosinstance.delete(`/followdelete/${username}`)
        .then((res)=>{
            alert("팔로우삭제성공!")

        }).catch((err)=>{
            alert("팔로우삭제실패!")
        })
    }

    //1대1채팅만들기
    const makechatroom=(e)=>{
        e.preventDefault()
       console.log("채팅시작");
        if(logincheck){
        axiosinstance.post(`http://localhost:8081/createchatroom`,{
            
        usernickname:userdata.usernickname,
        memberlist:userdata.username
    }
        ).then((res)=>{
            console.log(res.data)//룸아이디
            chatroomdata(res.data)
            
            
        }).catch((error)=>{
            console.log(error)
        })
    }else{
        alert("먼저로그인을해주세요!")
    }
    }


    return ReactDom.createPortal(
        <Outdiv onClick={(e)=>{
            e.stopPropagation()
            setismodal(false)}}>
        <Wrapper modalx={ModalX} modaly={ModalY}>
            {followcheck?<Menulist onClick={(e)=>{
                e.stopPropagation()
                onunfollow(e)}}>팔로우해제</Menulist>
            :<Menulist onClick={(e)=>{
                e.stopPropagation()
                onfollow(e)}}>팔로우</Menulist>}
            
            <Menulist onClick={(e)=>{
                e.stopPropagation()
                makechatroom(e)}}>채팅하기</Menulist>
            <Menulist onClick={()=>navigate(`/userpage/${profileid}`)}>유저페이지</Menulist>

<Menulist>
    프로필아이디:{profileid}
</Menulist>
        </Wrapper>
        </Outdiv>
    ,document.getElementById('phone-ui')  
)

}export default Usermodal;