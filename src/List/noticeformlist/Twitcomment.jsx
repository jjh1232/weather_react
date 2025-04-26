import React from "react"
import Twitcommentlistitem from "./Twitcommentlistitem"
import Commentform from "../../Noticepage/Commentform"
import Replycomment from "../../UI/Replycomment"
import Commentlist from "../Commentlist"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
export default function Twitcomment(props){


    const {noticeid,commentcreate
        ,commentupdate,
        commentdelete

    }=props

    

    
    const {data:comments}=useQuery({
        queryKey:["comments"],
        queryFn:async ()=>{
            const res= await axios.get("/open/commentshow",{
                params:{noticeid:noticeid}
            })
             
            return res.data.content
        }
    })
    return (
        <>
        {comments&&comments.map((data)=>{
            return (<>
               {data.depth===0 &&
               <div>
               <Twitcommentlistitem
                comment={data} 
                noticeid={noticeid}
                commentsubmit={commentcreate}
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
commentsubmit={commentcreate}
/>
        </>
    )
}