import React, { useEffect, useRef, useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import Userdata from "../../UI/Modals/Userdata";
import Usermodal from "../../UI/Modals/Usermodal";

function Favoritelist(props){

    const axiosinstance=CreateAxios();
    const [favoritefollow,setFavoritefollow]=useState();
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
        favoritefind()

    },[])

    const favoritefind=()=>{
        axiosinstance.get("/favoritelist")
        .then((res)=>{
            console.log(res)
            setFavoritefollow(res.data)
        })
        .catch((err)=>{
            console.log("에러")
        })
    }

     const unfavorite=(friendname)=>{
        console.log("즐겨찾기해제")
        axiosinstance.get(`/favoriteunfollow/${friendname}`)
        .then((res)=>{
            console.log("즐겨찾기해제성공")
            favoritefind();
        }).catch((err)=>{
            console.log("즐겨찾기해제실패")
        })
     }

      //채팅방만들기 데이터전달
      const chatroomdata=(roomid)=>{
        console.log("페이볼릿챗룸데이터")
        props.setContent("chatroom");
        props.setRoomid(roomid);
    }


        return (
        <>
        <div style={{width:"100%",height:"100%", overflow:"auto"}}>
        목록검색:<input onChange={(e)=>{Setsearchkeyword(e.target.value)}}/>
        <br/>
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
                    <>
                    <div
                    onClick={(e)=>{
                        console.log("클릭")
                        e.preventDefault();
                        setIsmodal(true)
                        setModalcss({x:e.clientX,y:e.clientY})
                        
                    }}
                    ref={modalref} 
                    >
                     
                     {data.nickname} 
                        <br/>
                        @{data.username}
                        
                        </div>
                        <button onClick={()=>{unfavorite(data.username)}}>즐겨찾기해제</button>
                        {ismodal&&<Usermodal 
                        username={data.username} usernickname={data.nickname} 
                        ModalX={modalcss.x} ModalY={modalcss.y} 
                        chatroomdata={chatroomdata}
                        />}
                    </>
                )
            })
            }
            </div>
        </>
    )
}
export default Favoritelist;