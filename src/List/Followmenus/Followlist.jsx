import React, { useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import { useEffect } from "react";
import Usermodal from "../../UI/Modals/Usermodal";
import { useRef } from "react";
import { defaultProps } from "react-quill";
import AuthCheck from "../../customhook/authCheck";

function Followlist(props){

    const axiosinstance=CreateAxios();

    const [followlist,setFollowlist]=useState([]);
    
    //로그인안할시 요청안보내게
    const islogin=AuthCheck();
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
         console.log("실행감지")
         document.addEventListener("mousedown",modalclose)
          //리턴으로 이벤트 안지우면 계속실행됨
         return ()=>document.removeEventListener('mousedown',modalclose);
     },[ismodal])
 
     const modalclose=(e)=>{
 
        console.log("실행감지1"+modalref.current)
        console.log("실행감지2"+e.target)
        if(ismodal&&!modalref.current.contains(e.target)){
            console.log("모달열려있음")
            setIsmodal(false)
        }
 
         
     }
 



    useEffect(()=>{
        if(!islogin){
            console.log("로그인후이용할수있습니다")
        }else{
                    
      listget();
                }
    },[])
  
    const listget=()=>{

        axiosinstance.get("/followlist").then((res)=>{
            console.log(res.data)
            setFollowlist(res.data)
        })
    }
    const favoritefollow=(friendname)=>{
        console.log("즐겨찾기실행")
        axiosinstance.get(`/favoritefollow/${friendname}`)
        .then((res)=>{
            console.log("즐겨찾기성공")
            listget();
        }).catch((err)=>{
            console.log("즐겨찾기해제")
            
        })

    }
    const favoriteunfollow=(friendname)=>{
        console.log("즐겨찾기해제")
        axiosinstance.get(`/favoriteunfollow/${friendname}`)
        .then((res)=>{
            console.log("즐겨찾기해제성공")
            listget();
        }).catch((err)=>{
            console.log("즐겨찾기해제실패")
        })
    }

    const unfollow =(username)=>{
        console.log("언팔로우!실행")
    
        axiosinstance.delete(`/followdelete/${username}`)
        .then((res)=>{
            alert("팔로우삭제성공!")
            listget();
        
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
        목록검색:<input onChange={(e)=>{Setsearchkeyword(e.target.value)}}/>
                    <br/>
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
          console.log(data)
            return(
                <div key={key}>
                <div onClick={(e)=>{
                    setIsmodal(true)
                    setModalcss({x:e.clientX,y:e.clientY})
               }}
               ref={modalref}
               key={key}
               >
                    
                    {data.nickname}
               
                <br/> 
                    @{data.username}
                    <br/>
                    {ismodal&&<Usermodal username={data.username} usernickname={data.nickname} 
                        ModalX={modalcss.x} ModalY={modalcss.y} 
                        chatroomdata={chatroomdata}
                        />}

                 </div>
                 {data.favorite?<button onClick={()=>{favoriteunfollow(data.username)}}>즐겨찾기해제</button>
                :<button onClick={()=>{favoritefollow(data.username)}}>즐겨찾기</button>
                }
                <button onClick={()=>{unfollow(data.username)}}>팔로우해제</button>
                 </div>
            )
        })}
        
        </div>
        </>
    )
}
export default  Followlist;