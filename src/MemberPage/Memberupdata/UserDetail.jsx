import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Twitformlist from "../../List/noticeformlist/Twitformlist";
import { useQuery } from "@tanstack/react-query";
import {format} from "date-fns"
import Viewtrans from "../../List/noticeformlist/DateCom/Viewtrans";
import { useCookies } from "react-cookie";

const Wrapper=styled.div`
position: relative;

width:100%;
height:100%;
 border: 1px solid red;
 top: 8%;

`

const Usercss=styled.div`
    border: 1px solid white;
    display: flex;
    flex-direction: column;
    
    ` 
const UserBackground=styled.div`
    background: #d8f6ff;
    display: flex;
    width: 100%;
    border: 1px solid green;
    height: 180px;
`
const Userheaderdiv=styled.div`
    border: 1px solid blue;
    display: flex;
`
const Profileview=styled.div`
    border:1px solid black;
    width:100%;
    height:100%;
`
const Profilediv=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    
    width: 90px;
    height: 90px;
    bottom:120px;
    left: 35px;
`
const Profileimg=styled.img`
    object-fit: fill;
    width: 100%;
    height: 100%;
    background: white;
`
const Menudiv=styled.div`
    display: flex;
    margin-left:auto;
    padding: 5px;
    
`
//버튼사이즈 
const sizes = {
  follow: { height: '30px', fontSize: '16px', padding: '0 20px',background:'#111111d1'},
  unfollow: { height: '30px', fontSize: '16px', padding: '0 20px',background:'#ce3333d1'},
  edit: { height: '30px', fontSize: '16px', padding: '0 20px',background:'#88ecf3d1'},
};
const MenuButton=styled.button`
    border: 1px solid white;
    border-radius: 30px;

    margin-right: 10px;
    color: white;
    cursor: pointer;

     ${({ size = 'follow' }) => `
    height: ${sizes[size].height};
    font-size: ${sizes[size].fontSize};
    padding: ${sizes[size].padding};
    background:${sizes[size].background};
  `};

  :hover{
         ${({ size = 'follow' }) => `
    height: ${sizes[size].height};
    font-size: ${sizes[size].fontSize};
    padding: ${sizes[size].padding};
    background:${sizes[size].background};
  `};
  }
`
const Userinfodiv=styled.div`
    display: flex;
    flex-direction: column;
     position: relative;
    
    border: 1px solid red;
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
    const [usercookie,setUsercookie]=useCookies();
 

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
            <UserBackground>

            </UserBackground>
            <Userheaderdiv>

           
        <Profilediv>

       
        <Profileview>
    <Profileimg src={process.env.PUBLIC_URL+"/userprofileimg"+userinfo.profileimg}/>
          </Profileview>  
           </Profilediv>
           <Menudiv>
           
           {usercookie.userinfo?.userid===userinfo.userid?<MenuButton size="edit">EDIT</MenuButton>:userinfo.followcheck?<MenuButton size="unfollow">Unfollow</MenuButton>:<MenuButton>Follow</MenuButton>}
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
            {JoinDate(userinfo.regdate)} 가입
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
