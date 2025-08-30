import React, { useEffect, useRef, useState } from "react";
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

height: 60px;
    align-items:center;
    gap: 3px;
    padding: 5px;
`
const Searchicon=styled(FontAwesomeIcon)`
    position: absolute;
   color: black;
    top: 51%;
    margin-left: 9px;
      transform: translateY(-50%);
      
  
  pointer-events: none;  /* 클릭 이벤트가 input으로 가도록 함 */

`
const Inputcss=styled.input`
width: 85%;
margin-left: 3px;
border-radius: 5px;
padding: 3px 3px 3px 26px;
 border: 1px solid #ccc;
 font-style: italic;
   box-sizing: border-box; /* 패딩 포함 너비 계산 */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;          /* 기본 파란 윤곽선 제거 */
    border-color: #4a90e2;  /* 파란색 테두리 */
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5); /* 은은한 그림자 */
  }

  &::placeholder {
    color: #aaa;            /* 연한 회색 플레이스홀더 */
    font-style: italic;
  }
`
const Userdatadiv=styled.div`
    
`
const Usernamediv=styled.div`
    
      font-size: 14px;
    color: #d3d0d0;
`
const Usernicknamediv=styled.div`
 font-size: 17px;
`
const Userlistdiv=styled.div`
    display: flex;
    
    flex-direction: column;
`
const Userlist=styled.div`
   
      display: flex;
    border :1px solid gray;
    margin: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
`
const Profilecss=styled.div`
      margin-right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

`

const Followdiv=styled.div`
      margin-left: auto;
     display: flex;
     justify-content: center; /* 가로 방향 중앙 정렬 */
    align-items: center; /* 세로 방향 중앙 정렬 */
`
const Favoriteicon=styled(FontAwesomeIcon)`
    border-radius: 15%;
    height: 17px;
   padding-right: 5px;
    color: white;

    :hover{
        color: red;
    }
`

function Favoritelist(props){

    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient()
    const [searchkeyword,Setsearchkeyword]=useState("");

    //회원정보 모달 누르기 
    const [ismodal,setIsmodal]=useState(false)
    const modalref=useRef();
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
        <Searchdiv style={{width:"100%",height:"100%", overflow:"auto"}}>
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
                        console.log("클릭")
                        e.preventDefault();
                        setIsmodal(true)
                        setModalcss({x:e.clientX,y:e.clientY})
                        
                    }}
                    ref={modalref} 
                    >
                      
                        <Profilecss>
                            <Profilediv width="40px" height="40px" url={data.profileimg}/>
                        </Profilecss>

                             <Userdatadiv>

                            
                                <Usernicknamediv>
                            {data.nickname} 
                                </Usernicknamediv>
                                
                            
                            <Usernamediv>
                            {data.username}
                            </Usernamediv>
                            </Userdatadiv>
                    
                        <Followdiv>

                        <Favoriteicon  icon={favoriteicon} onClick={(e)=>{
                            e.stopPropagation();
                            unfavorite(data.username)}}
                           
                            />

                    
                        </Followdiv>
                        {ismodal&&<Usermodal 
                        username={data.username} usernickname={data.nickname} 
                        ModalX={modalcss.x} ModalY={modalcss.y} 
                        chatroomdata={chatroomdata}
                        />}
                        </Userlist>
                    
                    
                )
            })
            }
           </Userlistdiv>
        </Wrapper>
    )
}
export default Favoritelist;