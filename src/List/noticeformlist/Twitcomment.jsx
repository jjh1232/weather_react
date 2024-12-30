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

    return (
        <>
        {comments&&comments.map((data)=>{
            return (<>
                
                <Twitcommentlistitem
                comment={data} 
                noticeid={noticeid}
                commentsubmit={commentcreate}
                
                />
               <Replycomment parentid={data.id} commentslist={comments}
                 commentupdate={commentupdate}
                 commentdelete={commentdelete}
                 //스타일드
                 formstyle="twitform"
                 />


                

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