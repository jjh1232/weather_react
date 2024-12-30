import React from "react";
import { useNavigate } from "react-router-dom";

function NoticelistItem(props){

    const {id,post,onClick}=props;
    

    
//온클릭함수를 람다식으로안하면 바로실행됨;
    return (
        <div key={id} onClick={()=>{onClick(post.num)}}>
                
                {post.name}
                {post.title}
                {post.red}
        </div>
    )
}
export default NoticelistItem;