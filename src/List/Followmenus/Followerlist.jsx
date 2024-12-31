import React, { useEffect, useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import  {unfollow,following}  from "../../customhook/Followtools";
import Usermodal from "../../UI/Modals/Usermodal";
import { useRef } from "react";

function Followerlist(props){

    const {Onfollow,Onunfollow}=props;


    const axiosinstance=CreateAxios();

    const [followerlist,setFollowerlist]=useState();
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
        console.log("실행감지1"+modalref.current)
        console.log("실행감지2"+e.target)
        if(ismodal&&!modalref.current.contains(e.target)){
           console.log("모달열려있음")
           setIsmodal(false)
       }
 
         
     }
 

    useEffect(()=>{
        followerget()
  
    },[])
    const followerget=()=>{
        axiosinstance.get("/followerlist").then((res)=>{
            console.log(res)
            setFollowerlist(res.data)
        }).catch((err)=>{
            console.log("에러")
        })
    }

    const onfollow=(username)=>{
        
        console.log("팔로잉실행!")
       
        axiosinstance.get("/follow?friendname="+username)
        .then((res)=>{
            alert("팔로우성공!")
            followerget()
        }).catch((err)=>{
            alert("팔로우실패!")
        })
   
    }

    const unfollow =(username)=>{
        console.log("언팔로우!실행")
    
        axiosinstance.delete(`/followdelete/${username}`)
        .then((res)=>{
            alert("팔로우삭제성공!")
            followerget()
        
        }).catch((err)=>{
            alert("팔로우삭제실패!")
        })
    }

     //채팅방만들기 데이터전달
     const chatroomdata=(roomid)=>{

        props.setContent("chatroom");
        props.setRoomid(roomid);
    }
        
    return (
        <>
        <div style={{width:"100%",height:"100%", overflow:"auto"}}>
        목록검색:<input onChange={(e)=>{Setsearchkeyword(e.target.value)}}
        
        
        />
        <br/>
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
                <>
                <div onClick={(e)=>{
                    setIsmodal(true)
                    setModalcss({x:e.clientX,y:e.clientY})
               }}
               ref={modalref}
                >
                    {data.nickname}  
                    
                  
                @{data.username}
                
                {ismodal&&<Usermodal username={data.username} usernickname={data.nickname} 
                        ModalX={modalcss.x} ModalY={modalcss.y} 
                        chatroomdata={chatroomdata}
                        />}

                </div>
                {data.followcheck
                    ?
                       
                    <button onClick={()=>{
                        
                        unfollow(data.username);
                    //unfoll(data.username)
                }}>팔로우해제z</button>
                    
                :<button onClick={()=>{
                    //follow(data.username)
                    onfollow(data.username);
                }}>팔로우</button>}
            </>
            )
        })}
        </div>
        </>
    )
}
export default Followerlist;