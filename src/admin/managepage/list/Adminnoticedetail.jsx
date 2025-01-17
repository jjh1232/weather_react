import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CreateAxios from "../../../customhook/CreateAxios";
import Adminnoticeupdatedetail from "./noticedetail/Adminnoticeupdatedetail";
import Adminnoticecomment from "./noticedetail/Adminnoticecomment";
import Commentform from "../../../Noticepage/Commentform";
import Adminnoticereply from "./noticedetail/Adminnoticereply";


export default function Adminnoticedetail(props){
    const {noticeid}=useParams();
    const axiosinstance=CreateAxios();
    const [isupdate,setIsupdate]=useState(false);
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
const mutation=useMutation({
    mutationFn:(data)=>{
        return axiosinstance.delete(`/admin/notice/${data.id}/delete`)
    }
})

const deletenotice=(noticeid)=>{
    if(confirm("정말로삭제하시겠습니까?")){ 
        mutation.mutate({id:noticeid})
    }
}


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
        <>
        {isupdate?<>
            <Adminnoticeupdatedetail data={data}/>
        </>
        :<>
           <div>
        {data.num}번글
        작성자:{data.nickname}@{data.username}
        </div>
        <div>
            하늘:{data.sky},1시간강수량:{data.rain},구름상태:{data.pty},기온:{data.temp}
        </div>
        <div>제목:{data.title}</div>
        <div dangerouslySetInnerHTML={{__html:data.text}}></div>

        <div>첨부이미지목록:
            {data.detachfiles&&data.detachfiles.map((m)=>{
                return (
                    <>
                    idx:{m.idx}번 {m.filename}
                    <br/>
                    </>
                )
            })}
          </div>      
            <button onClick={()=>{setIsupdate(true)}}>수정하기</button>
            <button onClick={()=>{deletenotice(data.num)}}>삭제하기</button>
      </>
        }
       

        <div>댓글목록:
                 <Commentform 
                    noticenum={data.num}
                    depth="0"
                    cnum=""
                    //commentsubmit={commentsubmit}
                    />
            {data.comments&&data.comments.map((co)=>{
                return (
                    <div>
                      {co.depth===0&&
                        <>
                       <Adminnoticecomment comment={co} comments={data.comments}/>
                       </>
            }
                            
            
            
                        </div>
                )
            })}

        </div>
        </>
    )
}