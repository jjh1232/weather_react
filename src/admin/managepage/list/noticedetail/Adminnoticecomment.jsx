import React from "react";
import Commentform from "../../../../Noticepage/Commentform";
import Adminnoticereply from "./Adminnoticereply";

export default function Adminnoticecomment(props){
    const {comment,comments}=props;
    
   
    return (
        <>
        
        {comment.nickname}<br/>
        {comment.username}
       
       <br/>
       {comment.text}
        <br/>
        {comment.createdDate}
        <br/>
        {comments.map((co)=>{
            return (
                <>
                {co.cnum===comment.id&&
                <>
            
                 <Adminnoticereply comment={co} />
                                            
                </>
                }
                </>
            )
            
        })
            
        }
        
        </>
    )
}