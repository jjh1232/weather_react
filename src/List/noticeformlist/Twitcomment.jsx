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
        queryKey:["comments"],
        queryFn:async ()=>{
            const res= await axios.get("/open/commentshow",{
                params:{noticeid:noticeid}
            })
             
            return res.data.content
        }
    })

    const queryclient=useQueryClient();
    //=================================코멘트작성================================================
    const createcomment=useMutation({
        mutationFn:({noticenum,depth,cnum,username,usernickname,comment})=>{
            if(comment===""){
                alert("글을작성해주세요!")
            }
            else{
                console.log("댓글작성시작")
                axiosinstance.post("/commentcreate",{
                    noticeid:noticenum,
                    depth:depth,
                    cnum:cnum,
                    username:username,
                    nickname:usernickname,
                    text:comment,
                    
          
                  })
                 
                }
        },
        onSuccess:(res)=>{
            alert("성공하였습니다")
            queryclient.invalidateQueries(["comments"])
        },onError:()=>{

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
                    alert("바뀐내용을입력해주세요")
                   }
                   else if(updatecomment===''){
                    alert("빈칸은입력할수없습니다")
                   }
                   else{
                    axiosinstance.put(`/commentupdate`,{
                      id:commentid,
                      username:commentusername,
                      text:updatecomment
                 
                    })
            }
            },
            onSuccess:()=>{
                alert("업데이트완료")
                queryclient.invalidateQueries(["comments"])
            },onError:()=>{

            }
        })

        const commentupdate=(commentid,commentusername,updatecomment)=>{
            coupmutate.mutate({commentid,commentusername,updatecomment})
        }
    
//=================================코멘트삭제================================
        const codelmutate=useMutation({
            mutationFn:(id)=>{
                axiosinstance.delete(`/commentdelete/${id}`)
            },
            onSuccess:()=>{
                alert("삭제성공")
                queryclient.invalidateQueries(["comments"])
            },onError:()=>{
                
            }
        })

        const commentdelete=(id)=>{
            codelmutate.mutate(id);
        }

    return (
        <>
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

===============================댓글작성==================
<Commentform noticenum ={noticeid} depth="0" cnum=""
commentsubmit={commentcr}
/>
        </>
    )
}