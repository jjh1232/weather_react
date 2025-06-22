import React from "react";
import Commentlistitem from "./Commentlistitem";
//재귀
//근데 대댓글만있어서 구지쓰지말자
export default function CommentTree({comment,...props}){
    return (
        <React.Fragment>
        <Commentlistitem   
        key={comment.id}
        data={comment}
        noticeid={props.noticeid}
        page={props.page}
       
        />
         {/* 자식 댓글이 있으면 재귀적으로 렌더 */}
         {comment.childs&&comment.childs.length>0 && (
            <div style={{ marginLeft: 24 }}>
                {comment.childs.map((child)=>(
                    <CommentTree 
                    key={child.id}
                    comment={child}
                    {...props}
                    />
                ))}
            </div>
         )}
        </React.Fragment>
    )
}