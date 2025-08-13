import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom"
const Outdiv=styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    
`
const Menuwrapper=styled.div`
    background-color:blue;
    position: relative;
    width: 70%;
    height: 100%;
    z-index: 300;
    display: flex;
    flex-direction: column;
   

`
const Header=styled.div`
    display: flex;
    background-color: red;
    height: 6%;

`
const Roomnamecss=styled.span`
    color: black;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

`
const Roomnameupdate=styled.div`
    padding-left: 5px;
`
const Body=styled.div`
    background-color: green;
    height: 70%;
`
const Memberitem=styled.div`
    display: flex;
    border: 1px solid gray;
    gap: 4px;
`
const Memberprodiv=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const Memberprofile=styled.img`
    width: 40px;
    height: 40px;
    background-color: white;
`
const MemberNamediv=styled.div`
    display: flex;
    flex-direction: column;
`
const MemberNickname=styled.div`
    
`
const MemberUsername=styled.div`
    font-size: 12px;
`
const Bottom=styled.div`
    
`
export default function Chatroomlistmenu({setmenuopen,roomdata}){


     const container = document.getElementById("phone-ui");
    
    const rect = container.getBoundingClientRect(); // phone-ui의 화면상 위치/크기
    //즉 뷰포트에서의 절대위치를 줌  이걸뺴면 마우스좌표가 화면내부기준이되는것
    
  // 아직 DOM이 없으면 렌더링하지 않음
  if (!container) return null;


  //멤버목록보기로직

 //방이름변경

 //채팅방나가기


    return ReactDOM.createPortal( //
        <Outdiv onClick={(e)=>{e.stopPropagation(), setmenuopen(false)}}>
        <Menuwrapper>
            <Header>
                <Roomnamecss>
                {roomdata.roomtitle}
                </Roomnamecss>
                <Roomnameupdate>
                    변경
                </Roomnameupdate>
            </Header>
            <Body>
                {roomdata.members.map((data)=>
                <Memberitem>
                    <Memberprodiv>
                        <Memberprofile src=
                        {data.profileurl
                            ?process.env.PUBLIC_URL+"/userprofileimg/"+data.profileurl
                            :process.env.PUBLIC_URL+"/userprofileimg/Noprofile.png"
                        }/>
                    </Memberprodiv>
                    <MemberNamediv>
                        <MemberNickname>
                        {data.nickname}
                        </MemberNickname>
                        <MemberUsername>
                         {data.email} 
                        </MemberUsername>
                        
                         
                
                    </MemberNamediv>
              
                
                </Memberitem>)}
            </Body>
            <Bottom>
                나가기

            </Bottom>
        </Menuwrapper>
</Outdiv>
    ,document.getElementById('phone-ui')
    )
}