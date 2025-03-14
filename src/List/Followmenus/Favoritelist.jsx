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

const Wrapper=styled.div`

display: flex;
flex-direction: column;
`
const Searchdiv=styled.div`
    
`
const Userlistdiv=styled.div`
    display: flex;
  
    flex-direction: column;
`
const Userlist=styled.div`
   
    display: flex;
    border: 1px solid gray;
`
const Profilecss=styled.div`


`
const Usernamediv=styled.div`
    
     width: 80%;
`
const Followdiv=styled.div`
    
     display: flex;
     justify-content: center; /* 가로 방향 중앙 정렬 */
    align-items: center; /* 세로 방향 중앙 정렬 */
`
const FollowButton=styled.button`
    border-radius: 15%;
    height: 30px;
    background-color: skyblue;
    color: black;

    :hover{
        background-color: red;
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


    

 


    
     const {data:favoritefollow,isLoading,error}=useQuery({
        queryKey:["favoritelistdata"],
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
            const olddata=queryclient.getQueryData(["favoritelistdata"])
            const newdata=olddata.filter((data)=>{

                return data.username!==friendname
            })
           

            queryclient.setQueriesData(["favoritelistdata"],newdata)
            alert ("즐겨찾기에서제거하였습니다")

        },onError:()=>{
            alert ("잠시후다시실행해주세요")
        }
     })
  

     const unfavorite=(username)=>{
        unfavoritemutation.mutate(username)
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
        목록검색:<input onChange={(e)=>{Setsearchkeyword(e.target.value)}}/>
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
                            <Profilediv url={data.profileurl}/>
                        </Profilecss>
                     <Usernamediv>
                     {data.nickname} 
                        <br/>
                        {data.username}
                        </Usernamediv>
                        <Followdiv>

                        <FontAwesomeIcon  icon={favoriteicon} onClick={()=>{unfavorite(data.username)}}
                            color="black" 
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