import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Twitformlist from "../../List/noticeformlist/Twitformlist";


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

    useEffect(()=>{
        userdataget();
    },[])

    const userdataget=()=>{
       console.log("유저페이지데이터:"+params.profileid)
        axios.get(`/open/userpage/${params.profileid}`)
        .then((res)=>{
            console.log(res.data)
            setUserdata(res.data.user)
            setNotice(res.data.notice.content)
        })
    }





    return (<Wrapper>
        {userdata&&
        
        <Usercss> 
        <Profileview>
    <img src={process.env.PUBLIC_URL+"/userprofileimg"+userdata.profileimg}
   style={{objectFit:"fill",width:"100%",height:"100%"}}/>
          </Profileview>    <button>팔로우</button>
          <h3>
    {userdata.nickname}
    </h3>
    {userdata.username}
    <br/>
    {userdata.myintro}
    <br/>
    {userdata.regdate}

    </Usercss>  
    }
           {
            //=======================게시글부분======================
           }    
    
           {notice&&notice.map((data,key)=>{
            return (
                <div >
                         <Twitformlist
                                    key={key} post={data} 
                                />
                </div>
            )
           })}

        
        
    </Wrapper>
    )
}
