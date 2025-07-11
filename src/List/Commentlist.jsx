import React, { useEffect, useState } from "react";
import Commentlistitem from "./Commentlistitem";
import Commentform from "../Noticepage/Commentform";
import Replycomment from "../UI/Replycomment";
import CommentTree from "./CommentTree";
function Commentlist(props){

  const {comments,noticeid,page}=props
 
  
if (!comments || comments.length===0){
  return <>댓글이없습니다</>
}
     
  return (
    <div>
       
            <div>
              {comments&&comments.map((comment,key)=>{
                return(
                  
                   <React.Fragment key={key}>
                 <Commentlistitem 

                  key={key}
                  data={comment}
                  noticeid={noticeid}
                  page={page}
               
                 />

                 </React.Fragment>
            
                )
              })}
             
        
              
                          
                 
                       
         
          
         </div>
        
          
            
   
      
    </div>
  )
}
export default Commentlist;