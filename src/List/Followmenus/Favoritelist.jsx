import React, { useEffect, useRef, useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import Userdata from "../../UI/Modals/Userdata";
import Usermodal from "../../UI/Modals/Usermodal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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


    
     useEffect(()=>{
        if(ismodal){
      
        document.addEventListener("mousedown",modalclose)
         //리턴으로 이벤트 안지우면 계속실행됨
        return ()=>document.removeEventListener('mousedown',modalclose);
        }
    },[ismodal])
 
     const modalclose=(e)=>{
        e.preventDefault();
       
             if(ismodal&&!modalref.current.contains(e.target)){
               
                setIsmodal(false)
            }
 
         
     }
 


    
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