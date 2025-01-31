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
    width: 1550px;
    top: 0%;
    left:18.5%;
    border: 1px solid black;
`
const Main=styled.div`
    
`
const NoticeData=styled.div`
    
`
const MainData=styled.div`
    
`
const ImageList=styled.div`
    
`
const CommentCss=styled.div`
    
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
  
   
    //========
    return (
        <Wrapper>
        {isupdate?<>
            <Adminnoticeupdatedetail data={data} setisupdate={setIsupdate}/>
        </>
        :<>
        <Main>
        <NoticeData>
           <div>
        {data.num}번글
        작성자:{data.nickname}@{data.username}
        </div>
        <div>
            하늘:{data.sky},1시간강수량:{data.rain},구름상태:{data.pty},기온:{data.temp}
        </div>
        </NoticeData>
        <MainData>
        <div>제목:{data.title}이미지북 첨부목록 댓글</div>
        <div dangerouslySetInnerHTML={{__html:data.text}}></div>

        </MainData>
        </Main>  
        <ImageList>
            첨부이미지목록:
            {data.detachfiles&&data.detachfiles.map((m)=>{
                return (
                    <>
                    idx:{m.idx}번 {m.filename}
                    <br/>
                    </>
                )
            })}
          </ImageList>

            <button onClick={()=>{setIsupdate(true)}}>수정하기</button>
            <button onClick={()=>{deletenotice(data.num)}}>삭제하기</button>
      </>
        }
       

        <div>댓글목록:
                 
            {data.comments&&data.comments.map((co)=>{
                return (
                    <div>
                      {co.depth===0&&
                        <>
                       <Adminnoticecomment comment={co} comments={data.comments} noticeid={data.num}
                       commentcreate={crcomment}
                       />
                       </>
            }
                            
            
            
                        </div>
                )
            })}
            <Commentform 
                    noticenum={data.num}
                    depth="0"
                    cnum=""
                    commentsubmit={crcomment}
                    />

        </div>
        </Wrapper>
    )
}