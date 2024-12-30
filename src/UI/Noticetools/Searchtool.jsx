import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

Searchtool.defaultProps={
    searchdata:{
        form:"noticeform",
        selectoptions:"title",
        keywords:"",
    }
    
}

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
    <>
   
    <select onChange={(e)=>{
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

    </select>
    <input type="text" value={searchdatas.keyword} onChange={(e)=>{
         setSearchdatas((prev)=>({...prev,keyword:e.target.value}))
    }}/>
    <button onClick={search}>검색</button>
    <br/>기존값{searchdata.keywords}
   <br/> 바뀐값{searchdatas.keyword}
    </>
  )

}