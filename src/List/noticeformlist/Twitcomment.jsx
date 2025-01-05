import React from "react"
import Twitcommentlistitem from "./Twitcommentlistitem"
import Commentform from "../../Noticepage/Commentform"
import Replycomment from "../../UI/Replycomment"
import Commentlist from "../Commentlist"
export default function Twitcomment(props){


    const {comments,noticeid,commentcreate
        ,commentupdate,
        commentdelete

    }=props

    console.log("메인코멘트에서코멘츠"+comments)
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

===========================================댓글작성
<Commentform noticenum ={noticeid} depth="0" cnum=""
commentsubmit={commentcreate}
/>
        </>
    )
}