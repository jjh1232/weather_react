import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

Searchtool.defaultProps={
    searchdata:{
        form:"noticeform",
        selectoptions:"title",
        keywords:"",
    }
    
}

const Wrapper=styled.div`
  float: right;
  
  width: 100%;
  display: flex;
 
`
const SearchSelect=styled.select`
 //    padding: 0 12px;
  border: 1.5px solid #bdbdbd;
  border-radius: 6px;
  background: #fff;
  color: #222;
  font-size: 16px;
  //appearance: none; /* 브라우저 기본 스타일 제거 */
  outline: none;
  cursor: pointer;
  transition: border 0.2s;

  &:hover, &:focus {
    border: 1.5px solid #4caf50;
    background: #f5fff5;
  }
`
const Searchinput=styled.input`
  width: 60%;
`
const SearchButton=styled.button`
  
`
export default function Searchtool(props){

    const {searchdata,deletemethod,twitformpage}=props
    const navigate=useNavigate();
        const [searchdatas,setSearchdatas]=useState(searchdata);
      //셀렉트검색
  const options = [
    {value:"title",name:"제목"}, 
    {value:"text",name:"내용"}, 
    {value:"titletext",name:"제목+내용"}, 
    {value:"name",name:"글쓴이"} 
  ]

  const search=()=>{
    console.log("서치메소드시작")
    console.log("셀렉트옵션:"+searchdatas.selectoptions)
    console.log("서치키워드"+searchdatas.keywords)
   

    if(searchdatas.keyword===""){
      alert("검색어를입력하세요")
    }
  else{  
    if(searchdatas.form==="twitform"){
        deletemethod();
        twitformpage(1);
        console.log("트윗폼")
        navigate(`/notice/twitform?form=${searchdatas.form}&pages=${1}&selectoptions=${searchdatas.selectoptions}&keywords=${searchdatas.keyword}`)
        //window.location.reload()
    }
    else{
   navigate(`/notice?form=${searchdatas.form}&pages=${1}&selectoptions=${searchdatas.selectoptions}&keywords=${searchdatas.keyword}`)
    }
  }
  }
  return (
    <Wrapper>
   
    <SearchSelect onChange={(e)=>{
        setSearchdatas((prev)=>({...prev,selectoptions:e.target.value}))
    }}>
        {options.map((option)=>{
            return (
                <option key={option.value}
                 value={option.value}
                >
                    {option.name}
                </option>
            )
        })}

    </SearchSelect>
    <Searchinput type="text" value={searchdatas.keyword} onChange={(e)=>{
         setSearchdatas((prev)=>({...prev,keyword:e.target.value}))
    }}/>
    <SearchButton onClick={search}>검색</SearchButton>
    
    </Wrapper>
  )

}