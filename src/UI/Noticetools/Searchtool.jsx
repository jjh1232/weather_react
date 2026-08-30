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
  /* top:6px 때문에 같은 줄의 버튼/탭보다 혼자 6px 내려가 있었다 */
  width: 100%;
  gap: 6px;
  align-items: center;      /* 세로(수직) 중앙정렬 */
  justify-content: flex-end;
`
const SearchSelect=styled.select`
  flex-shrink: 0;
  /* 글작성하기 버튼(2.25rem=36px)과 탭 높이에 맞춘다 */
  height: 36px;
  padding: 0 8px;
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusSm};
  background: ${(props)=>props.theme.surfaceAlt};
  color: ${(props)=>props.theme.text};
  font-size: 13px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: border-color ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition};

  &:hover {
    border-color: ${(props)=>props.theme.borderStrong};
  }
  &:focus {
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
  }
`
const Searchinput=styled.input`

  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusPill};
  font-size: 14px;
  background: ${(props)=>props.theme.surfaceAlt};
  color: ${(props)=>props.theme.text};
  outline: none;
  transition: border-color ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition},
              background ${(props)=>props.theme.transition};

  &::placeholder {
    color: ${(props)=>props.theme.textFaint};
    opacity: 1;
    font-size: 0.95em;
  }

  &:focus {
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    background: ${(props)=>props.theme.surface};
  }
`;

const SearchButton=styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusPill};
  cursor: pointer;
  background-color: ${(props)=>props.theme.surfaceAlt};
  color: ${(props)=>props.theme.textMuted};
  transition: background ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition},
              border-color ${(props)=>props.theme.transition};

  &:hover {
    color: ${(props)=>props.theme.accent};
    border-color: ${(props)=>props.theme.accent};
    background-color: ${(props)=>props.theme.accentSoft};
  }
  &:active {
    color: #fff;
    background-color: ${(props)=>props.theme.accentActive};
    border-color: ${(props)=>props.theme.accentActive};
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
    <Searchinput type="text" placeholder="검색어를 입력하세요" value={searchdatas.keyword} onChange={(e)=>{
         setSearchdatas((prev)=>({...prev,keyword:e.target.value}))
    }}/>
    <SearchButton onClick={search}>
    <FontAwesomeIcon icon={glass}/>

    </SearchButton>
    
    </Wrapper>
  )

}