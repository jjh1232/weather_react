import React from "react";


export default function Adminnoticereply(props){
    const {comment}=props;

    return (
      
              <>
              
              대댓글
               {comment.nickname}<br/>
              {comment.username}
             
             <br/>
             {comment.text}
              <br/>
              {comment.createdDate}
              <br/>
              </>
            )

    
    
}