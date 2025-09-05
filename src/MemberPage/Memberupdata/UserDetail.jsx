import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Twitformlist from "../../List/noticeformlist/Twitformlist";
import { useQuery } from "@tanstack/react-query";


const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;
 top: 8%;

`
const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
const Usercss=styled.div`
    border: 1px solid white;
    ` 

export default function UserDetail(props){
    const params=useParams();
    const axiosinstance=CreateAxios();

    const [userdata,setUserdata]=useState();

    const [notice,setNotice]=useState();

 

    const {data:userinfo,isLoading:userloading,error:usererror}=useQuery(
        {queryKey:['userpageprofile',params.profileid],
            queryFn:async ()=>{
                const res=await axiosinstance.get(`/open/userpage/userdata/${params.profileid}`)
                console.log("유저데이터:",res)
                return res.data
            }
            
        }
        
        
    )




    return (<Wrapper>
        {userinfo&&
        
        <Usercss> 
        <Profileview>
    <img src={process.env.PUBLIC_URL+"/userprofileimg"+userinfo.profileimg}
   style={{objectFit:"fill",width:"100%",height:"100%"}}/>
          </Profileview>   {userinfo.followcheck?<>팔로우해제</>:<>팔로우</>}
          <h3>
    {userinfo.nickname}
    </h3>
    {userinfo.username}
    <br/>
    {userinfo.myintro}
    <br/>
    {userinfo.regdate}
        팔로워수:{userinfo.follownum}
        팔로워수:{userinfo.followernum}
    </Usercss>  
    }
           {
            //=======================게시글부분======================
           }    
    
         

        
        
    </Wrapper>
    )
}
