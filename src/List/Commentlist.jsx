import React, { useEffect, useState } from "react";
import Commentlistitem from "./Commentlistitem";
import Commentform from "../Noticepage/Commentform";
import Replycomment from "../UI/Replycomment";
function Commentlist(props){

  const {comments,noticeid,page,commentcreate,commentupdate,commentdelete}=props
  //const [comment]=[{}] 
    
  
  
  
  

  //const [reply]=[{}]

  

  

  
console.log(comments)
 
  
  return (
    <div>
       
            <div>
              {comments&&comments.map((coment,key)=>{
                return(
                  
                   <React.Fragment key={key}>
                    {coment.depth===0 &&
                    <div>
                 <Commentlistitem 

                  key={key}
                  data={coment}
                  noticeid={noticeid}
                  page={page}
                  commentcreate={commentcreate}
                  commentupdate={commentupdate}
                  commentdelete={commentdelete}
                 />
                 
                 <Replycomment parentid={coment.id} commentslist={comments}
                     noticeid={noticeid}
                   page={page}
                 commentupdate={commentupdate}
                 commentdelete={commentdelete}
                 />
                 </div>
                    }

                 </React.Fragment>
            
                )
              })}
             
        
              
                          
                 
                       
         
          
         </div>
        
          
            
   
      
    </div>
  )
}
export default Commentlist;