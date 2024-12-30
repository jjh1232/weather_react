import React, { useState } from "react";
import styled from "styled-components"
import NoticelistItem from "./NoticelistItem";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Searchtool from "../UI/Noticetools/Searchtool";
import { useEffect } from "react";


function Noticelist(props){
const {posts,onClickItem,noticecreate,querydatas,totalpage,
  setpagequery,commentcreate
}=props;

const [page,setPage]=useState(parseInt(querydatas.pages));

useEffect(()=>{

},[page])

return(
  <div>
      
      {querydatas.pages}
    
    {posts&&posts.map((post)=>{
      return (
        
        
        <NoticelistItem
        
        id={post.id}
        post={post}
        onClick={
          
            onClickItem
          
        }
        commentcreate={commentcreate}
        />
       
      )
    })}

     <br/>
        <button onClick={noticecreate}>글쓰기 </button>
        페이지네이션 {querydatas.pages}
        <br/>
        {querydatas.pages>1&&<button onClick={()=>{
          //여기수정 
          
    setpagequery(querydatas.pages-1)
  }} >이전 </button>}
        
        {totalpage&&totalpage.map((pagelist)=>{
          return (
            <>
              
            {querydatas.pages==pagelist
            ?<span style={{fontWeight:"bolder" ,padding:"5px"}}>
              {pagelist}
            </span>
            :<span style={{padding:"5px"}}  onClick={()=>{

              //============================여기도
              setpagequery(pagelist)
              
             }}>
            {pagelist}
          </span>
          }
            </>
          )
        })}
  
  {querydatas.pages<totalpage.length-1&&<button onClick={()=>{
    
    
    //여기도
    setpagequery(parseInt(querydatas.pages)+1)
  }} >다음</button>}
  
        <br/>
 

      <Searchtool searchdata={querydatas}/>
      <br/>
      

</div>
)

}
export default Noticelist;