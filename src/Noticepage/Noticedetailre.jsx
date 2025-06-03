import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Commentlist from "../List/Commentlist";

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
    
`
const Usernamediv=styled.div`
    display: flex;
`
const Nickdiv=styled.div`
    
`
const Weatherdiv=styled.div`
    
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

            <Weatherdiv>
        pty:{post.pty},rain:{post.rain},reh:{post.reh},sky:{post.sky},temp:{post.temp},wsd:{post.wsd}

              </Weatherdiv>
       </Userdiv>
     
                <Titlediv>
                    제목:{post.title}
               
               
         날짜:{post.red}
         </Titlediv>
         </Headdatadiv>
         </Header>
         <NoticeMaindiv>
        내용: <div dangerouslySetInnerHTML={{__html:post.text}} />
        
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