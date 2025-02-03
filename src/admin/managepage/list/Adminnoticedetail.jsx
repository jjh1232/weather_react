import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateAxios from "../../../customhook/CreateAxios";
import Adminnoticeupdatedetail from "./noticedetail/Adminnoticeupdatedetail";
import Adminnoticecomment from "./noticedetail/Adminnoticecomment";
import Commentform from "../../../Noticepage/Commentform";
import Adminnoticereply from "./noticedetail/Adminnoticereply";
import styled from "styled-components";

const Wrapper=styled.div`
    position: absolute;
    width: 1530px;
    top: 0%;
    left:18.5%;
    border: 1px solid black;
`
const Header=styled.div`
background-color: black;
text-align: center;
border: 2px solid green;
height: 50px;
`
const Main=styled.div`
    position: relative;
    width: 1000px;
    border:1px solid blue;
`
const NoticeData=styled.div`
position: relative;
border:3px solid black;

height: 45px;
`
const Profile=styled.img`
    position: relative;
    width: 40px;
    bottom:125%;
    border: 1px solid black;
    object-fit: fill;
    height: 40px;
   // display: inline-block;
`
const UserName=styled.div`
    height: 40px;
    left: -0.5%;
    width: fit-content;
   
    position: relative;
    display: inline-block;
    
`
const Titlediv=styled.div`
    border: 1px solid yellow;
    height: 30px;
`
const MainData=styled.div`
    
    border:1px solid black;
`
const Weatherdata=styled.div`
    position: relative;
    float: right;
    top:40%;
    
    float: right;
    border: 1px solid yellow;
`

const CommentCss=styled.div`
  
`
const ImageList=styled.div`
      position: fixed;
    border: 1px solid green;
    width: 325px;
    height: 75%;
    left:1360px;
    top: 8%;
    z-index: 100;
    float: right;
`
const Detachdiv=styled.div`
float: left;
    width: 105px;
    height: 150px;
    border: 1px solid blue;
    text-overflow: ellipsis;
`

const Detachimg=styled.img`
    width: 100px;
    height: 100px;
    object-fit: fill;
`
export default function Adminnoticedetail(props){
    const {noticeid}=useParams();
    const axiosinstance=CreateAxios();
    const [isupdate,setIsupdate]=useState(false);
    const navigate=useNavigate();
//이거 then은안되나봄
    const noticeget=()=>{
        axiosinstance.get(`/admin/notice/detail/${noticeid}`)
        .then((res)=>{console.log(res)

          
        })

        .catch((err)=>{
            console.log(err)
        })
        
    }
//여기까지 연습용
//삭제용 뮤태이션인데이게 위로안가면 에러남;삭제이후처리가안됌
const queryClient=useQueryClient();//데이터수정후 다시요청을위해 쿼리클라이언트가져오기
const mutation=useMutation({
    mutationFn:(data)=>{
        return axiosinstance.delete(`/admin/notice/${data.id}/delete`)
    },
    onSuccess(data){
        console.log("석세스")
        navigate("/admin/notice")
        
        

    }
})

const deletenotice=(noticeid)=>{
    if(confirm("정말로삭제하시겠습니까?")){ 
        mutation.mutate({id:noticeid})
    }
}
//댓글작성
const commentcreate=useMutation({
    mutationFn:(data)=>{
        return axiosinstance.post(`/commentcreate`,
         data
        )
    },
    onSuccess(data){
        console.log("석세스")
        queryClient.invalidateQueries({queryKey:[`noticeData`]})

    }
})

const crcomment=(username,usernickname,comment,noticenum,depth,cnum)=>{
    const data={
        noticeid:noticenum,
        depth:depth,
        cnum:cnum,
        username:username,
        nickname:usernickname,
        text:comment
    }
    commentcreate.mutate(data)
}
//댓글작성

//데이터가져오기
    const {isLoading,error,data}=useQuery({
        queryKey:[`noticeData`],
        queryFn:async ()=>{
          const data= await axiosinstance.get(`/admin/notice/detail/${noticeid}`)
         
            return data.data;
        }
    })

    if(isLoading) return `Loading....`

    if(error) return "eroos.."+error.message

    //삭제
  
   
    //==========================View========================================
    return (
        <Wrapper>
        {isupdate?<>
            <Adminnoticeupdatedetail data={data} setisupdate={setIsupdate}/>
        </>
        :<>
        <Main>
        <Header>
            
            <h3 style={{color:"white"}}>게시글관리</h3>
        </Header>
        <Titlediv>
        {data.num}번글
        제목:{data.title}
        <span style={{float:"right"}}>
            {data.red}
        </span>
        </Titlediv>
        <NoticeData>
        
        <Profile src={"/userprofileimg"+data.userprofile}  />
        <UserName>
        <h4 style={{display:"inline-block",
            width:"fit-content" ,position:"relative",left:"10px",bottom:"50%"}}>
        {data.nickname}
        
        </h4>
        <br/>
        <h5 style={{display:"inline-block",
            width:"fit-content" ,position:"relative",left:"10px",bottom:"160%"}}>
        {data.username}
        </h5>
        </UserName>
        <Weatherdata>
            하늘:{data.sky},1시간강수량:{data.rain},구름상태:{data.pty},기온:{data.temp}
        </Weatherdata>
        </NoticeData>
            
        <MainData>
        <div>
        
            
         
            <span>
            이미지북
            </span>
        </div>
        <div dangerouslySetInnerHTML={{__html:data.text}}></div>

        </MainData>
        </Main>  
        <ImageList>
            <div>
            
            첨부이미지목록
            </div>
            
            {data.detachfiles&&data.detachfiles.map((m)=>{
                return (
                    <Detachdiv>
                    <Detachimg src={process.env.PUBLIC_URL+m.path}/>
                    <br/>
                    idx:{m.idx}번 {m.filename}
                    <br/>
                    </Detachdiv>
                )
            })}
          </ImageList>

            <button onClick={()=>{setIsupdate(true)}}>수정하기</button>
            <button onClick={()=>{deletenotice(data.num)}}>삭제하기</button>


            
        <Commentform 
                    noticenum={data.num}
                    depth="0"
                    cnum=""
                    commentsubmit={crcomment}
                    />
                 

            {data.comments&&data.comments.map((co)=>{
                return (
                    <CommentCss>
                      {co.depth===0&&
                        <>
                       <Adminnoticecomment comment={co} comments={data.comments} noticeid={data.num}
                       commentcreate={crcomment}
                       />
                       </>
            }
                            
            
            
                    </CommentCss>
                )
            })}
         

       
      </>
        }
       

  
        </Wrapper>
    )
}