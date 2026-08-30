import React, { useEffect, useRef, useState } from "react";
import { handletext } from "../../customhook/Userhandle";
import CreateAxios from "../../customhook/CreateAxios";
import Userdata from "../../UI/Modals/Userdata";
import Usermodal from "../../UI/Modals/Usermodal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import Profilediv from "../../UI/Modals/Profilediv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as favoriteicon} from "@fortawesome/free-solid-svg-icons";
import { faStar as unfavoriteicon } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass as search } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";

const Wrapper=styled.div`

display: flex;
flex-direction: column;
overflow: hidden;
`
const Searchdiv=styled.div`
      display: flex;
    position: relative;

    align-items:center;
    gap: 3px;
    padding: 8px 10px;
`
const Searchicon=styled(FontAwesomeIcon)`
    position: absolute;
   color: ${(props)=>props.theme.textFaint};
   font-size: 13px;
    top: 50%;
    margin-left: 11px;
      transform: translateY(-50%);
      
  
  pointer-events: none;  /* 클릭 이벤트가 input으로 가도록 함 */

`
const Inputcss=styled.input`
width: 100%;
height: 32px;
border-radius: ${(props)=>props.theme.radiusPill};
padding: 0 10px 0 30px;
border: 1px solid ${(props)=>props.theme.border};
background: ${(props)=>props.theme.surfaceAlt};
color: ${(props)=>props.theme.text};
font-size: 13px;
   box-sizing: border-box; /* 패딩 포함 너비 계산 */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;          /* 기본 파란 윤곽선 제거 */
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    background: ${(props)=>props.theme.surface};
  }

  &::placeholder {
    color: ${(props)=>props.theme.textFaint};
  }
`
// 닉네임 + 이메일
const Userdatadiv=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
`
const Usernamediv=styled.div`
    font-size: 12px;
    line-height: 1.35;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const Usernicknamediv=styled.div`
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const Userlistdiv=styled.div`
    display: flex;
    
    flex-direction: column;
`
// 목록 한 줄
const Userlist=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    cursor: pointer;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    transition: background ${(props)=>props.theme.transition};

    &:last-child { border-bottom: none; }
    &:hover { background: ${(props)=>props.theme.surfaceHover}; }
`
const Profilecss=styled.div`
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Followdiv=styled.div`
      margin-left: auto;
      flex-shrink: 0;
     display: flex;
     justify-content: center; /* 가로 방향 중앙 정렬 */
    align-items: center; /* 세로 방향 중앙 정렬 */
    gap: 8px;
`
// 즐겨찾기 목록의 별은 항상 채워진 상태다. 기존엔 흰색이라 안 보였다.
const Favoriteicon=styled(FontAwesomeIcon)`
    font-size: 15px;
    cursor: pointer;
    color: #f5a623;
    transition: color ${(props)=>props.theme.transition},
                transform ${(props)=>props.theme.transition};

    :hover{
        color: #e04545;
        transform: scale(1.15);
    }
`

function Favoritelist(props){

    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient()
    const [searchkeyword,Setsearchkeyword]=useState("");

    //회원정보 모달 - "어떤 유저의 모달인지"를 담는다. null 이면 닫힌 상태.
    //boolean 하나를 목록 전체가 공유하면, map 안의 <Usermodal> 이 사람 수만큼
    //한꺼번에 렌더되고 전부 같은 좌표에 겹쳐서 엉뚱한 사람의 메뉴가 보인다.
    const [selecteduser,setSelecteduser]=useState(null)
    const [modalcss,setModalcss]=useState(
        {
            x:0,
            y:0
        }
    );


        const [usercookie]=useCookies(["userinfo"])

 


    
     const {data:favoritefollow,isLoading,error}=useQuery({
        queryKey:["favoritelistdata",usercookie.userinfo.userid],
        queryFn:async ()=>{
            const res = await axiosinstance.get("/favoritelist")
            console.log("패이볼:",res)
            return res.data
        }
        
     })

     const unfavoritemutation=useMutation({
        mutationFn:(friendname)=>{
            axiosinstance.get(`/favoriteunfollow/${friendname}`)
        }
        ,onSuccess:(res,friendname)=>{
            const olddata=queryclient.getQueryData(["favoritelistdata",usercookie.userinfo.userid])
            const newdata=olddata.filter((data)=>{

                return data.username!==friendname
            })
           

            queryclient.setQueriesData(["favoritelistdata",usercookie.userinfo.userid],newdata)
            alert ("즐겨찾기에서제거하였습니다")

        },onError:()=>{
            alert ("잠시후다시실행해주세요")
        }
     })
  

     const unfavorite=(username)=>{
        if(confirm("정말로 즐겨찾기에서 제거하시겠습니까?")) unfavoritemutation.mutate(username)
     }

      //채팅방만들기 데이터전달
      const chatroomdata=(roomid)=>{
        console.log("페이볼릿챗룸데이터")
        props.setContent("chatroom");
        props.setRoomid(roomid);
    }


        return (
        <Wrapper>
        <Searchdiv>
        < Searchicon icon={search}/>
        <Inputcss />
        </Searchdiv>

        <Userlistdiv>
        {favoritefollow && 
            favoritefollow.filter((list)=>{
                if(searchkeyword==""){
                    return list
                }
                else if(list.nickname.includes(searchkeyword)){
                    return list
                }
                else if(list.username.includes(searchkeyword)){
                    return list
                }
            })
                
                .map((data)=>{
                return(
                    
                    <Userlist
                    onClick={(e)=>{
                        e.preventDefault();
                        //클릭한 행의 유저를 지정한다. 모달은 map 밖에서 하나만 렌더된다.
                        setSelecteduser(data)
                        setModalcss({x:e.clientX,y:e.clientY})

                    }}
                    key={data.username}
                    >
                      
                        <Profilecss>
                            <Profilediv width="40px" height="40px" url={data.profileimg}/>
                        </Profilecss>

                             <Userdatadiv>

                            
                                <Usernicknamediv>
                            {data.nickname} 
                                </Usernicknamediv>
                                
                            
                            <Usernamediv>
                            {handletext(data.profileid,data.username)}
                            </Usernamediv>
                            </Userdatadiv>
                    
                        <Followdiv>

                        <Favoriteicon  icon={favoriteicon} onClick={(e)=>{
                            e.stopPropagation();
                            unfavorite(data.username)}}
                           
                            />

                    
                        </Followdiv>
                        </Userlist>
                    
                    
                )
            })
            }
           </Userlistdiv>

        {/* 모달은 목록 밖에서 딱 하나만 렌더한다. 선택된 유저가 있을 때만 열린다. */}
        {selecteduser&&<Usermodal
            username={selecteduser.username}
            usernickname={selecteduser.nickname}
            ModalX={modalcss.x} ModalY={modalcss.y}
            chatroomdata={chatroomdata}
            setismodal={()=>setSelecteduser(null)}
            profileid={selecteduser.profileid}
            />}
        </Wrapper>
    )
}
export default Favoritelist;