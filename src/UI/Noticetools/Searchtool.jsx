import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass as glass } from "@fortawesome/free-solid-svg-icons";

Searchtool.defaultProps={
    searchdata:{
        form:"noticeform",
        selectoptions:"title",
        keywords:"",
    }
    
}

const Wrapper=styled.div`
  //float: right;
  display: flex;
  position: relative;
  top: 6px;
  align-items: center;      /* 세로(수직) 중앙정렬 */
  /* 필요하다면 가로(수평) 정렬도 추가 */
  justify-content: center;  /* 가로 중앙정렬 */
  
 
`
const SearchSelect=styled.select`
 // padding: 0 12px;
  border: 1.5px solid #bdbdbd;
  border-radius: 3px;
  background: #fff;
    height: 24px;
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

  width: 100%;
  height: 20px;
  border: 1.5px solid #cfd8dc;
  border-radius: 3px;
  font-size: 16px;
  background: #f5f7fa;
  color: #222;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #90a4ae;
    opacity: 1;
    font-size: 0.95em;
  }

  &:focus {
    border-color: #228be6;
    box-shadow: 0 2px 8px rgba(34, 139, 230, 0.12);
    background: #fff;
  }
`;

const SearchButton=styled.button`
  height: 27px;
  cursor:pointer;
  background-color: white;

    &:hover {
   color: #339af0;
   box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    background-color: rgba(128,128,128,0.6); /* 회색, 60% 불투명 */
  }
  &:active {
    color: #1c7ed6;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
     background-color: rgba(128,128,128,0.5); /* 회색, 50% 불투명 */
  }
`
export default function Searchtool(props){
  //path에따라 form값생성
  const location=useLocation();
  let form="default"
  if(location.pathname.includes("/liked")) form ="liked";
  else if (location.pathname.includes("/imgform")) form ="image";
    //const {searchdata,deletemethod,twitformpage}=props
    const navigate=useNavigate();
        const [searchdatas,setSearchdatas]=useState(
          {selectoptions:"title",
            keyword:"",
            
          }
        );
        
         useEffect(() => {
    // 페이지(탭) 이동 시 폼 초기화
    setSearchdatas({
      selectoptions: "title",
      keyword: "",
    });
  }, [location.pathname]);
  // ...이하 생략

         
      //셀렉트검색
  const options = [
    {value:"title",name:"제목"}, 
    {value:"text",name:"내용"}, 
    {value:"titletext",name:"제목+내용"}, 
    {value:"name",name:"글쓴이"} 
  ]

  const search=()=>{
    console.log("서치메소드시작")
   
   

    if(searchdatas.keyword===""){
      alert("검색어를입력하세요")
    }
  else{  
        if(form==="default"){
        navigate(`/notice/twitform?pages=${1}&selectoptions=${searchdatas.selectoptions}&keywords=${searchdatas.keyword}`)
        }
        else if(form ==="liked"){
        navigate(`/notice/twitform/liked?pages=${1}&selectoptions=${searchdatas.selectoptions}&keywords=${searchdatas.keyword}`)
        }
        else if(form ==="image"){
        navigate(`/notice/imgform?&selectoptions=${searchdatas.selectoptions}&keywords=${searchdatas.keyword}`)
        }
    }
   // else{
   //navigate(`/notice?form=${searchdatas.form}&pages=${1}&selectoptions=${searchdatas.selectoptions}&keywords=${searchdatas.keyword}`)
    //}
  }
  //}
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
    <SearchButton onClick={search}>
    <FontAwesomeIcon icon={glass}/>

    </SearchButton>
    
    </Wrapper>
  )

}