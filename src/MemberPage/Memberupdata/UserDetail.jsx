import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Twitformlist from "../../List/noticeformlist/Twitformlist";
import { useQuery } from "@tanstack/react-query";
import {format} from "date-fns"
import Viewtrans from "../../List/noticeformlist/DateCom/Viewtrans";

const Wrapper=styled.div`
position: relative;

width:100%;
height:100%;
 border: 1px solid;
 top: 8%;

`

const Usercss=styled.div`
    border: 1px solid white;
    display: flex;
    flex-direction: column;
    ` 
const Userheaderdiv=styled.div`
    border: 1px solid blue;
    display: flex;
`
const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
const Profilediv=styled.div`
    display: flex;
`
const Menudiv=styled.div`
    display: flex;
`
const Userinfodiv=styled.div`
    display: flex;
    flex-direction: column;
    //border: 1px solid red;
`
const Nicknamediv=styled.div`
    font-size: 30px;
`
const Usernamediv=styled.div`
    color: gray;
`
const Userintrodiv=styled.div`
    border: 1px solid red;
`
const Userdate=styled.div`
    
`
const Followdatadiv=styled.div`
    display: flex;

`
const Follownumdiv=styled.div`
    
`
const Followernumdiv=styled.div`
    
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
    //유저작성글
    const {data:userposts,isLoading:postloading,error:posterror}=useQuery({
        queryKey:["userposts",userinfo?.userid],
        queryFn:async()=>{
            const res=await axiosinstance.get(`/open/userpage/userpost/${userinfo.userid}`)
            return res.data;
        },enabled:!!userinfo?.userid //userid있을때만
    })

    //가입날짜포맷
    const JoinDate=(joindate)=>{
        const formatted=format(joindate,'yyyy MMMM d')
        return <>{formatted}</>
    }


    return (<Wrapper>
        {userinfo&&
        
        <Usercss> 
            <Userheaderdiv>

           
        <Profilediv>

       
        <Profileview>
    <img src={process.env.PUBLIC_URL+"/userprofileimg"+userinfo.profileimg}
   style={{objectFit:"fill",width:"100%",height:"100%"}}/>
          </Profileview>  
           </Profilediv>
           <Menudiv>
           {userinfo.followcheck?<>팔로우해제</>:<>팔로우</>}
       </Menudiv>
 </Userheaderdiv>
       <Userinfodiv>

         <Nicknamediv>
            {userinfo.nickname}
         </Nicknamediv>
        <Usernamediv>
            {userinfo.username}
        </Usernamediv>
    
    
    < Userintrodiv>
     {userinfo.myintro}
    </Userintrodiv>
   
    <Userdate>
            {JoinDate(userinfo.regdate)}
    </Userdate>
    
    <Followdatadiv>
        <Follownumdiv>
            팔로우수:{Viewtrans(userinfo.follownum)}
        </Follownumdiv>
    
        <Followernumdiv>
                팔로워수:{Viewtrans(userinfo.followernum)}
        </Followernumdiv>   
       
    
        </Followdatadiv>
          </Userinfodiv>
    </Usercss>  
    }
           {
            //=======================게시글부분======================
           }    
    
         

        
        
    </Wrapper>
    )
}
