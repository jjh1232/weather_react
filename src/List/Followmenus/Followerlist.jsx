import React, { useEffect, useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import  {unfollow,following}  from "../../customhook/Followtools";
import Usermodal from "../../UI/Modals/Usermodal";
import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import Profilediv from "../../UI/Modals/Profilediv";
import { useCookies } from "react-cookie";


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
 width: 40px;
    height:40px;
    margin-right: 4px;

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
function Followerlist(props){

    const {Onfollow,Onunfollow}=props;


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
        목록검색:<input onChange={(e)=>{Setsearchkeyword(e.target.value)}}
        
        
        />
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
                    <Profilecss>
                        <Profilediv url={data.profileurl}/>
                    </Profilecss>
                    <Usernamediv>
                    {data.nickname}  
                    <br/>
                  
                {data.username}
                </Usernamediv>
                {ismodal&&<Usermodal username={data.username} usernickname={data.nickname} 
                        ModalX={modalcss.x} ModalY={modalcss.y} 
                        chatroomdata={chatroomdata}
                        />}

                <Followdiv>
                {data.followcheck
                    ?
                       
                    <FollowButton onClick={()=>{
                        
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