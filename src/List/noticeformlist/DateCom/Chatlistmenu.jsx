import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen as exit } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare as upda } from "@fortawesome/free-solid-svg-icons";

const Outdiv=styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
      display: flex;
    
    justify-content: center;
    align-items: center;
`
const Menuwrapper=styled.div`
    background-color:#525e79;
    position: relative;
    width: 70%;
    height: 80%;
    z-index: 300;
    display: flex;
    flex-direction: column;
    border-radius: 10%;
     overflow: hidden;
     border: 1px solid black;
   

`
const Header=styled.div`
    display: flex;
    flex-direction: column;
    
    


`
const Nametag=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 23px;
    padding-top: 1px;
   
`
const Roomnamecss=styled.span`
display: flex;
    padding-top: 5px;
    color: white;
    font-size: 18px;
     justify-content: center;
    align-items: center;
   

`

const Nameupdateicon=styled(FontAwesomeIcon)`
    cursor: pointer;
    color:black;
    padding-left: 8px;
`
const Body=styled.div`
display: flex;
flex-direction: column;

    padding-top: 10px;
    gap: 5px;
    min-height: 60%;
   `
const ListTable=styled.div`
display: flex;
flex-direction: column;
     overflow-y: auto;
        /* 스크롤바 스타일 */
    &::-webkit-scrollbar {
        width: 8px; /* 스크롤바 너비 */
    }
    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1); /* 트랙 배경 */
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.5); /* 스크롤바 색 */
        border-radius: 4px;
        border: 2px solid transparent; /* 바깥쪽 여백 */
        background-clip: padding-box;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255, 255, 255, 0.8); /* 호버 시 색 */
    }
`

const Subtag=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

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
    display: flex;
    
    justify-content: flex-end;
    align-items: flex-end;
    height: 60px;
    gap: 3px;
    padding-right: 12px;
    padding-bottom: 15px;
    margin-top: auto; /* 자동으로 맨 아래로 내려감 */
    
`
const Outroomdiv=styled.div`

    cursor: pointer;
 
    
`
const Exiticon=styled(FontAwesomeIcon)`
    color: red;
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
                <Nametag>
                    방정보
                </Nametag>
                <Roomnamecss>
                {roomdata.roomtitle}
                     <Nameupdateicon icon={upda}/>
                </Roomnamecss>
              
            </Header>
            <Body>
                <Subtag>대화상대 {roomdata.members.length}</Subtag>
                <ListTable>
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
                
             
                </ListTable>
            </Body>
            <Bottom>
                <Outroomdiv>
                    
                채팅방나가기
                <Exiticon icon={exit} />
                </Outroomdiv>
            </Bottom>
        </Menuwrapper>
</Outdiv>
    ,document.getElementById('phone-ui')
    )
}