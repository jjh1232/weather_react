import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Commentlist from "../List/Commentlist";
import NoticeWeathericon from "../UI/Noticetools/NoticeWeathericon";
import Datefor from "../List/noticeformlist/DateCom/Datefor";
import theme from "../UI/Manyim/Themecss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Noticemenu from "../List/noticeformlist/DateCom/Noticemenu";
import CreateAxios from "../customhook/CreateAxios";

const Wrapper=styled.div`
   position: relative;
    display: flex;
    flex-direction: column;
width:100%;
height:100%;

`
const Noticediv=styled.div`
    
`
const Header=styled.div`
    border: 1px solid blue;
    display: flex;
`

const Profilediv=styled.div`
    border: 1px solid red;

`
const Headdatadiv=styled.div`
    border: 1px solid green;
    display: flex;
    flex-direction: column;
    width: 100%;
`
const Userdiv=styled.div`
    display: flex;
    gap:5px;
    
`

const Nickdiv=styled.div`
      color: ${(props)=>props.theme.text};
`
const Usernamediv=styled.div`
    display: flex;
    color: gray;
`
const Timediv=styled.div`
    
`
const Weatherdiv=styled.div`
    margin-left: auto;
`
const Menudiv=styled.div`
    
`
const Titlediv=styled.div`
    
`
const Userprofile=styled.img`
    width: 40px;
    height: 40px;
    border: 1px solid black;
    background-color: white;

    
`
const NoticeMaindiv=styled.div`
    
`
export default function Noticedetailre(props){
    
    const [page,setPage]=useState(1);
    const  {noticeid}=useParams();
    const noticemenuref=useRef(null);
    const [ismenu,setIsmenu]=useState(false);
    const [isupdate,setIsupdate]=useState(false);
    let axiosinstance=CreateAxios();
    console.log("노티스디테일")
    const {data:post,isLoading:noticeloading,error:noticeerror}=useQuery({queryKey:["post",noticeid],
        queryFn:async ()=>{
            const res=await axios.get("/open/noticedetail/"+noticeid);
            
            console.log("노티스:",res)
            return res.data;
        }
    })

      const {data:comment,isLoading:commentloading,error:commenterror}=useQuery({queryKey:["comments",noticeid,page],
        queryFn:async ()=>{
            const res=await axios.get( "/open/commentshow/",{
                params:{
                    noticeid:noticeid,
                    page:page
                }
            });
              console.log("댓글:",res)
            return res.data.content;
        }
    })


    const weatherKeys = ['sky', 'rain', 'pty', 'temp', 'reh', 'wsd'];
    const Weatherdata=weatherKeys.map((data)=> ({
        type:data,
        value:post?.[data]
    }))

    //메뉴관리
    useEffect(()=>{
        const noticemenuoutside=(e)=>{
            if(noticemenuref.current&&!noticemenuref.current.contains(e.target)){
                setIsmenu(false)
            }
        }
        document.addEventListener("mousedown",noticemenuoutside);
        return ()=>{
            document.removeEventListener("mousedown",noticemenuoutside)
        }
    },[])

    const postUpdate=()=>{
    setIsupdate(true)

 }

 const postDelete=()=>{
    if(window.confirm("정말로삭제하시겠습니까?")){
      axiosinstance.delete(`/noticedelete/${post.id}`)
      .then((res)=>{
        alert("정상적으로삭제되었습니다")
        //뒤로가기구현

      }).catch((err)=>{
        alert("에러가났어요")
      })
    }else{
     // alert("삭제취소")
    }
 }
    return (
<Wrapper>
        {noticeloading&&<>로딩중...</>}
        {post&&<Noticediv>
 
            <Header>

           
      
        <Profilediv>
       <Userprofile src={process.env.PUBLIC_URL+"/userprofileimg/"+post.userprofile }/>
       </Profilediv>
       <Headdatadiv>
            <Userdiv>
         
     
         <Nickdiv>   {post.nickname}</Nickdiv>
         <Usernamediv> {post.username} </Usernamediv>
    <Timediv>
        <Datefor inputdate={post.red}/>
         
         </Timediv>
            <Weatherdiv>
                {Weatherdata&&Weatherdata.map((data)=>{
                    return (
             <NoticeWeathericon type={data.type} value={data.value}/>
                    )
                })}
              

              </Weatherdiv>
              <Menudiv onClick={()=>{setIsmenu(!ismenu)}} ref={noticemenuref}>
                <FontAwesomeIcon onClick={()=>{setIsmenu(!ismenu)}}icon={faEllipsis} fontSize={"25px"}/>
                
                  {ismenu&&<Noticemenu 
                    updatemethod={postUpdate} deletemethod={postDelete} noticeuser={post?.username} noticeid={post?.id}
                    setisblock={null} isclose={setIsmenu}
              />}
            
              </Menudiv>
              
            
       </Userdiv>
     
                <Titlediv>
                    {post.title}
               
           
         </Titlediv>
         </Headdatadiv>
         </Header>
         <NoticeMaindiv>
         <div dangerouslySetInnerHTML={{__html:post.text}} />
        
       </NoticeMaindiv>

        </Noticediv>

        }

        {commentloading&&<>댓글불러오는중....</>}
        {comment&&<>
            <Commentlist comments={comment}/>
        </>}
</Wrapper>
    )
}