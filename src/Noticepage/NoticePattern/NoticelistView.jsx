import Noticelistlogic from "./Noticelistlogic";
import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import Noticelist from "../../List/Noticelist";

const Wrapper=styled.div`
    color:"white"
padding: 50px;
position:relative;
left:28.5%;
border:1px solid;
width:43%;
height:1000px;
top:14%;

`

//이건숙원사업으로하자 ..
export default function NoticelistView(){
    let [query,setQuery]=useSearchParams();
    const pages=query.get("pages")
    const selectoptions=query.get("selectoptions");
    const keywords=query.get("keywords");


    const {notice,totalpage,search,noticecreate,noticeonclick}
    =Noticelistlogic(pages,selectoptions,keywords);

    

return (
    <Wrapper>
       <Noticelist 
        posts={notice}
        onClickItem={
          noticeonclick
        }
    
        />

        <br/>
        <button onClick={noticecreate}>글쓰기 </button>
        페이지네이션 {pages}
        <br/>
        {pages>1&&<button >이전 </button>}
        
        {totalpage&&totalpage.map((pagelist)=>{
          return (
            <>
              
            {pages==pagelist
            ?<span style={{fontWeight:"bolder" ,padding:"5px"}}>
              {pagelist}
            </span>
            :<span style={{padding:"5px"}}  onClick={()=>{
              query.set("pages",pagelist)
              setQuery(query)
              
             }}>
            {pagelist}
          </span>
          }
            </>
          )
        })}
  
  {pages<totalpage.length-1&&<button >다음</button>}
  
        <br/>
        {//여기서 
        /*
     <select onChange={(e)=>{setSelectoption(e.target.value)}}>
        {options.map((option)=>{
          return (
            <option
            key={option.value}
            value={option.value}
            
            >
              
              {option.name}
            </option>
          )
        })}

  </select>
<input type="text" value={searchtext} onChange={(e)=>{
        setSearchtext(e.target.value)
        
      }}/>
      
      <button onClick={search}>검색</button>
      <h1> zz{selectoption}zz</h1>
      */}
      </Wrapper>
    )
}