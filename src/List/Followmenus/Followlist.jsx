import React, { useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import { useEffect } from "react";
import Usermodal from "../../UI/Modals/Usermodal";
import { useRef } from "react";
import { defaultProps } from "react-quill";
import AuthCheck from "../../customhook/authCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as favorite} from "@fortawesome/free-solid-svg-icons";
import { faStar as unfavorite } from "@fortawesome/free-regular-svg-icons";
import styled from "styled-components";
import Profilediv from "../../UI/Modals/Profilediv";

const Wrapper=styled.div`
 border   : 1px solid yellow ;
`

const Searchdiv=styled.div`
    border: 1px solid green;
`
const Userlistdiv=styled.div`
    border: 1px solid blue;
    display: flex;
    flex-direction:column;
`

const Userlist=styled.div`
    display: flex;
    border :1px solid gray;
    margin: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
`
const Userprofilediv=styled.div`
    margin-right: auto;
    width: 80%;
  
`
const Userprofileimage=styled.div`
 width: 40px;
    height:40px;
    margin-right: 4px;
 
`
const FollowButton=styled.button`
    border-radius: 15%;
    background-color: skyblue;
    color: black;

    :hover{
        background-color: red;
    }
`
const Favoritediv=styled.div`
    margin-left: auto;
    display: flex;
    justify-content: center; /* 가로 방향 중앙 정렬 */
    align-items: center; /* 세로 방향 중앙 정렬 */
    width: 10%;
    
`

function Followlist(props){

    const axiosinstance=CreateAxios();

  //  const [followlist,setFollowlist]=useState([]);
    
    //로그인안할시 요청안보내게
    const islogin=AuthCheck();
    const [searchkeyword,Setsearchkeyword]=useState("");

    const queryclient=useQueryClient();
     //회원정보 모달 누르기 
     const [ismodal,setIsmodal]=useState(false)
     const modalref=useRef();
     const [modalcss,setModalcss]=useState(
         {
             x:0,
             y:0
         }
     );
 
 
     useEffect(()=>{
         console.log("실행감지")
         document.addEventListener("mousedown",modalclose)
          //리턴으로 이벤트 안지우면 계속실행됨
         return ()=>document.removeEventListener('mousedown',modalclose);
     },[ismodal])
 
     
     const modalclose=(e)=>{
 
       
        if(ismodal&&!modalref.current.contains(e.target)){
            console.log("모달열려있음")
            setIsmodal(false)
        }
 
         
     }
 



       const {data:followlist,isLoading,error}=useQuery({
        queryKey:["followlistdata"],
        queryFn: async()=>{
            const res= await axiosinstance.get("/followlist")
            return res.data
        },
        
        enabled:islogin
        
        
       })
       
       const favoritemutation=useMutation({
        mutationFn:(friendname)=>{
            axiosinstance.get(`/favoritefollow/${friendname}`)
        },onSuccess:(data,friendname)=>{
            
           //이건비효율 queryclient.invalidateQueries("followlistdata")

           const olddata=queryclient.getQueriesData(["followlistdata"])
           const newdata=olddata[0][1].map((data)=>{

            return data.username===friendname?{...data,favorite:true}:data
           })

           queryclient.setQueriesData(["followlistdata"],newdata)
           alert("성공적으로 즐겨찾기에추가했습니다")
        }
       })
    const favoritefollow=(friendname)=>{
       favoritemutation.mutate(friendname)

    }
    const unfavoriteunfollow=useMutation({
        mutationFn:(friendname)=>{
            axiosinstance.get(`/favoriteunfollow/${friendname}`)
        },onSuccess:(data,friendname)=>{
          const olddata= queryclient.getQueriesData(["followlistdata"])
         
          
            //id값은 안쓰고 유저네임으로하니까
         const newdata= olddata[0][1].map((data)=>{
         
            
          return  data.username===friendname?{...data,favorite:false} :data
         
           })
                  
          
          queryclient.setQueriesData(["followlistdata"],newdata)
            alert("즐겨찾기를해제하였습니다")
            
        }
    })
    const favoriteunfollow=(friendname)=>{
       unfavoriteunfollow.mutate(friendname)
    }

    //언팔로우뮤테이션
    const unfollowmutation=useMutation({
        mutationFn:(username)=>{
            axiosinstance.delete(`/followdelete/${username}`)
        },
        onSuccess:(data,friendname)=>{

            const olddata=queryclient.getQueriesData(["followlistdata"])
            //삭제라 필터
            const newdata= olddata[0][1].filter((data)=>{
         
            
                return  data.username!==friendname

                 })
                      
                 queryclient.setQueriesData(["followlistdata"],newdata)
                  alert("팔로우를해제하였습니다")

        },onError:()=>{
            alert("잠시후실행해주세요")
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
        목록검색:<input onChange={(e)=>{Setsearchkeyword(e.target.value)}}/> 
        </Searchdiv>
        <Userlistdiv>
        {followlist&&followlist.filter((val,index)=>{
            //필터로 키워드에 알맞은값을 리턴한다 여러개값일때테스트필요한듯
            if(searchkeyword==""){
                return val
            }
            else if(val.nickname.includes(searchkeyword)){
                return val
            }else if(val.username.includes(searchkeyword)){
                return val
            }
        }) .map((data,key)=>{          
          
            return(
                
                <Userlist  onClick={(e)=>{
                    setIsmodal(true)
                    setModalcss({x:e.clientX,y:e.clientY})
               }}
               ref={modalref}
               key={key}
               >
                
                    <Userprofileimage>
                    <Profilediv url={data.profileurl}/>
                    </Userprofileimage>
                    <Userprofilediv>
                    {data.nickname} <FollowButton onClick={()=>{unfollow(data.username)}}>unfollow</FollowButton>
               
                <br/> 
                    {data.username}
                    </Userprofilediv>    
                    {ismodal&&<Usermodal username={data.username} usernickname={data.nickname} 
                        ModalX={modalcss.x} ModalY={modalcss.y} 
                        chatroomdata={chatroomdata}
                        />}

              
                <Favoritediv>
                 {data.favorite?<FontAwesomeIcon icon={favorite} onClick={()=>{favoriteunfollow(data.username)}}
                     style={{color:"black", }}
                    />
                    
                
                :<FontAwesomeIcon icon={unfavorite} onClick={()=>{favoritefollow(data.username)}}
                style={{color:"black"}}
                />
                }
                </Favoritediv>

                </Userlist>
            )
        })}
        
        </Userlistdiv>
        </Wrapper>
    )
}
export default  Followlist;