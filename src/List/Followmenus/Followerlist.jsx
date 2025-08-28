import React, { useEffect, useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import  {unfollow,following}  from "../../customhook/Followtools";
import Usermodal from "../../UI/Modals/Usermodal";
import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import Profilediv from "../../UI/Modals/Profilediv";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass as search } from "@fortawesome/free-solid-svg-icons";

const Wrapper=styled.div`

display: flex;
flex-direction: column;
overflow: hidden;
`
const Searchdiv=styled.div`
    display: flex;
    position: relative;
border: 1px solid gray;
height: 60px;
    align-items:center;
    gap: 3px;
    padding: 5px;
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
const Userprofilediv=styled.div`
       margin-right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    
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
const Followdiv=styled.div`
    margin-left: auto;
     display: flex;
     justify-content: center; /* 가로 방향 중앙 정렬 */
    align-items: center; /* 세로 방향 중앙 정렬 */
`
const FollowButton=styled.button`
    border-radius: 15%;
    height: 30px;
    width: 70px;
    background-color: skyblue;
    color: black;
    cursor: pointer;
    font-size: 15px;
    
    :hover{
        background-color: red;
    }

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
const Searchicon=styled(FontAwesomeIcon)`
    position: absolute;
   color: black;
    top: 51%;
    margin-left: 9px;
      transform: translateY(-50%);
      
  
  pointer-events: none;  /* 클릭 이벤트가 input으로 가도록 함 */

`
function Followerlist(props){

   


    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();
    
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
     useEffect(()=>{
        if(ismodal){
        console.log("실행감지")
        document.addEventListener("mousedown",modalclose)
         //리턴으로 이벤트 안지우면 계속실행됨
        return ()=>document.removeEventListener('mousedown',modalclose);
        }
    },[ismodal])
 
     const modalclose=(e)=>{
        e.preventDefault();
       
        if(ismodal&&!modalref.current.contains(e.target)){
           console.log("모달열려있음")
           setIsmodal(false)
       }
 
         
     }
 

   
     const {data:followerlist,isLoading,error}=useQuery({
        queryKey:["followerlist",usercookie.userinfo.userid],
        queryFn:async ()=>{
            const res=await axiosinstance.get("/followerlist")
            
            return res.data
        },
        
     })
  
     const onfollowmutation=useMutation({
       
        mutationFn:(username)=>{
            axiosinstance.get("/follow?friendname="+username)
        },onSuccess:(res,username)=>{
            const olddata=queryclient.getQueryData(["followerlist",usercookie.userinfo.userid])
            console.log("이전데이터"+olddata[0])
            const newdata=olddata.map((data)=>{

                return data.username===username?{...data,followcheck:true}:data
        })
            queryclient.setQueriesData(["followerlist",usercookie.userinfo.userid],newdata)
            alert("팔로우하였습니다")
        },onError:()=>{
            alert("에러!")
        }
     })

    const onfollow=(username)=>{
      
        onfollowmutation.mutate(username)
        
    }

    const unfollowmutation=useMutation({
       
        mutationFn:(username)=>{
            axiosinstance.delete(`/followdelete/${username}`)
        },onSuccess:(res,username)=>{
            const olddata=queryclient.getQueryData(["followerlist",usercookie.userinfo.userid])
            console.log("이전데이터"+olddata[0])
            const newdata=olddata.map((data)=>{

                return data.username===username?{...data,followcheck:false}:data
        })
            queryclient.setQueriesData(["followerlist",usercookie.userinfo.userid],newdata)
            alert("팔로우하였습니다")
        },onError:()=>{
            alert("에러!")
        }
     })
    const unfollow =(username)=>{
       unfollowmutation.mutate(username)
    }

     //채팅방만들기 데이터전달
     const chatroomdata=(roomid)=>{

        props.setContent("chatroom");
        props.setRoomid(roomid);
    }
        
    return (
        <Wrapper>
        <Searchdiv style={{width:"100%",height:"100%", overflow:"auto"}}>
                    
                <Searchicon icon={search} />
                <Inputcss onChange={(e)=>{Setsearchkeyword(e.target.value)}} 
                placeholder="닉네임이나 이메일을 입력해주세요"/> 
                </Searchdiv>
         <Userlistdiv>
        {followerlist&&followerlist.filter((list)=>{
            if(searchkeyword==""){
                return list;
            }
            else if(list.nickname.includes(searchkeyword)){
                return list;
            }
            else if(list.username.includes(searchkeyword)){
                return list;
            }
           
        })
          .map((data)=>{
            return(
                
                <Userlist onClick={(e)=>{
                    setIsmodal(true)
                    setModalcss({x:e.clientX,y:e.clientY})
               }}
               ref={modalref}
                >
                    <Userprofilediv>
                         <Profilediv width="40px" height="40px" url={data.profileimg}/>
                       
                    </Userprofilediv>
                   <Userdatadiv>

                  
                    <Usernicknamediv>
                {data.nickname} 
                    </Usernicknamediv>
                    
                  
                   <Usernamediv>
                {data.username}
                </Usernamediv>
                 </Userdatadiv>
                {ismodal&&<Usermodal username={data.username} usernickname={data.nickname} 
                        ModalX={modalcss.x} ModalY={modalcss.y} 
                        chatroomdata={chatroomdata}
                        />}

                <Followdiv>
                {data.followcheck
                    ?
                       
                    <FollowButton onClick={(e)=>{
                        e.stopPropagation();
                        unfollow(data.username);
                    //unfoll(data.username)
                }}>unfollow</FollowButton>
                    
                :<FollowButton onClick={()=>{
                    //follow(data.username)
                    onfollow(data.username);
                }}>follow</FollowButton>}
                </Followdiv>
                </Userlist>
                
         
            )
        })}
       </Userlistdiv>
        </Wrapper>
    )
}
export default Followerlist;