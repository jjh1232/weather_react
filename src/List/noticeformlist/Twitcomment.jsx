import React from "react"
import Twitcommentlistitem from "./Twitcommentlistitem"
import Commentform from "../../Noticepage/Commentform"
import Replycomment from "../../UI/Replycomment"
import Commentlist from "../Commentlist"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import CreateAxios from "../../customhook/CreateAxios"
export default function Twitcomment(props){


    const {noticeid

    }=props

    
const axiosinstance=CreateAxios();
    
    const {data:comments}=useQuery({
        queryKey:["comments",noticeid], //두번째는 식별자 왠만하면이렇게쓰는게좋다함
        queryFn:async ()=>{
            const res= await axios.get("/open/commentshow",{
                params:{noticeid:noticeid}
            })
             
            return res.data.content
        }
    })

    const queryclient=useQueryClient();
    //=================================코멘트작성================================================
    const createcomment=useMutation({//리턴을하는게올바른사용법이라함
        mutationFn:({noticenum,depth,cnum,username,usernickname,comment})=>{
            if(comment===""){
                alert("글을작성해주세요!")
            }
            else{
                console.log("댓글작성시작")
              return  axiosinstance.post("/commentcreate",{
                    noticeid:noticenum,
                    depth:depth,
                    cnum:cnum,
                    username:username,
                    nickname:usernickname,
                    text:comment,
                    
          
                  })
                 
                }
        },
        onMutate:async (variables)=>{ //서버요청전에 로컬캐시를 먼저업데이트 이거 내가보낸파라미터
            //기존 댓글데이터가져오고 쿼리잠시중단 두번째는 식별자임 게시글번호로식별
            await queryclient.cancelQueries(["comments",variables.noticenum]);
            //기존데이터백업
            console.log("온뮤테이트시작")
            const previus=queryclient.getQueryData(["comments",variables.noticenum])
            //임시댓글객체생성 (id는 임시로)
            const opticomment={
                id:"temp-"+Date.now(),
                noticeid:variables.noticenum,
                depth:variables.depth,
                username: variables.username,
        nickname: variables.usernickname,
        text: variables.comment,
        createdAt: new Date().toISOString(),
        // 필요한 필드 추가
      };
      //캐시에 임시댓글추가                               //old가 처음에undefined일수있음 그럴떄빈배열로초기화
      queryclient.setQueryData(["comments",variables.noticenum],(old=[])=>[
        ...old,
        opticomment,]
      );
      //롤백용 데이터 반환 
      console.log("온뮤테이트종류후리턴")
      return {previus}
            }
        ,
        onSuccess:(res)=>{
            alert("성공하였습니다")
           // queryclient.invalidateQueries(["comments"])
           //간단하게 리렌더링할때 ux는조금아쉽다! 요청도두번하게되는것
        },onError:(error,variables,context)=>{//실패시롤백  context는 onmutation에서 리턴한값
            if(context?.previus){
                queryclient.setQueryData(["comments",variables.noticenum],context.previus);
            }
            alert("댓글작성오류")
        },
        onSettled:(data,error,variables)=>{ //성공실패없이 상관없이 서버데이터로 동기화
            queryclient.invalidateQueries(["comments", variables.noticenum]);
        }
    })
      const commentcr=(username,usernickname,comment,noticenum,depth,cnum)=>{
        console.log("코멘트작성시작"+comment)
        createcomment.mutate({noticenum,depth,cnum,username,usernickname,comment});
      }     
    
     //=================================코멘트업데이트===========================
        const coupmutate=useMutation({
            mutationFn:({commentid,commentusername,updatecomment})=>{
                if(updatecomment===undefined){
                    throw new Error("바뀐내용을입력해주세요")
                   }
                   else if(updatecomment===''){
                    throw new Error("빈칸은입력할수없습니다")
                   }
                   else{
                    return   axiosinstance.put(`/commentupdate`,{
                      id:commentid,
                      username:commentusername,
                      text:updatecomment
                 
                    })
            }
            },
            onMutate:async (variables)=>{
                //진행중쿼리취소
                await queryclient.cancelQueries(["comments",noticeid]);
                //스냅샷
                const previus=queryclient.getQueryData(["comments",noticeid])
                //낙관적업데이트 두번째인자에 변경할것
                queryclient.setQueryData(["comments",noticeid],(old)=>
                old.map((comment)=>comment.id===variables.commentid
                                    ?{...comment,text:variables.updatecomment}
                                    :comment
            )
                )
                //롤백용데이터반환
                return {previus}
            },
            onSuccess:()=>{
                alert("업데이트완료")
               // queryclient.invalidateQueries(["comments",noticeid])
            },onError:(error,variables,context)=>{
                //오류발생시롤백
                if(context?.previus){
                    queryclient.setQueryData(["comments",noticeid],context.previus);
                }
                alert(error.message || "수정 실패했습니다")
            },
            onSettled:()=>{
                //최종동기화 (안해도될듯?)
                queryclient.invalidateQueries(["comments",noticeid])
            }
        })

        const commentupdate=(commentid,commentusername,updatecomment)=>{
            coupmutate.mutate({commentid,commentusername,updatecomment})
        }
    
//=================================코멘트삭제================================
        const codelmutate=useMutation({
            mutationFn:(id)=>{
                return  axiosinstance.delete(`/commentdelete/${id}`)
            },onMutate: async (id)=>{ //muataefn 실행전에 나옴
                await queryclient.cancelQueries(["comments",noticeid])
                const previus=queryclient.getQueryData(["comments",noticeid]);

                queryclient.setQueryData(["comments",noticeid],(old)=>
                old.filter((comment)=>comment.id!==id)
                )
                return {previus}
            },
            onSuccess:()=>{
                alert("삭제성공")
              //  queryclient.invalidateQueries(["comments"])
            },onError:(error,id,context)=>{
                if(context?.previus){
                    queryclient.setQueryData(["comments",noticeid],context.previus);
                }
                alert("삭제실패했습니다")
            },onSettled:()=>{
                queryclient.invalidateQueries(["comments",noticeid])
            }
        })

        const commentdelete=(id)=>{
            codelmutate.mutate(id);
        }

    return (
        <>
      
<Commentform noticenum ={noticeid} depth="0" cnum=""
commentsubmit={commentcr}
/>
     
        {comments&&comments.map((data)=>{
            return (<>
               {data.depth===0 &&
               <div>
               <Twitcommentlistitem
                comment={data} 
                noticeid={noticeid}
                commentsubmit={commentcr}
                commentupdate={commentupdate}
                 commentdelete={commentdelete}
                />
               
               <Replycomment 
               parentid={data.id}
                commentslist={comments}
                 commentupdate={commentupdate}
                 commentdelete={commentdelete}
                 />
                 </div>
               }
              
              

                </>
            ) 
        })
       
}

</>
    )
}