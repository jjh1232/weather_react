import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../customhook/authCheck";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";



//이걸로새로 해보자 
function Noticelistlogic(pages,selectoptions,keywords){
  
  /*쿼리스트링 가져오기 
  let [query,setQuery]=useSearchParams();
  const pages=query.get("pages")
  const selectoptions=query.get("selectoptions");
  const keywords=query.get("keywords");
  */

  const [page,setPage]=useState(1)
  const [notice,setNotice]=useState();
  const [totalpage,setTotalpages]=useState([]);
  
  const [searchtext,setSearchtext]=useState(keywords);
  const [selectoption,setSelectoption]=useState("title");
  
  const navigate=useNavigate();
  const logincheck=AuthCheck();
  //셀렉트검색
  const options = [
    {value:"title",name:"제목"}, 
    {value:"text",name:"내용"}, 
    {value:"titletext",name:"제목+내용"}, 
    {value:"name",name:"글쓴이"} 
  ]

const defaultnotice=`/open/notice`;
const searchurl=`/open/noticesearch`;


useEffect(()=>{
  console.log("리스트유스이펙트시작")
  if(keywords===null){
    console.log("서치아님")
  noticelist()
  }
  else{
    console.log("서치임")
    
    searchdata();
  }
},[])

  const noticelist=()=>{
    axios.get(defaultnotice,{
      params:{
        page:page
      }
    }).then((res)=>{

      console.log(res.data)
         
      console.log(res.data.totalPages)
      const arr=totalpageget(res.data.totalPages)
      console.log(arr)
      setTotalpages(arr)
      setNotice(res.data.content)
    })

  }

  const searchdata=(e)=>{
    
    console.log(selectoption)
    console.log(searchtext)
    
  
      axios.get(searchurl,{
        params:{
        option:selectoptions,
        keyword:keywords,
        page:pages,
        }
      }).then((res)=>{
        
          console.log(res.data)
         
          console.log(res.data.totalPages)
          const arr=totalpageget(res.data.totalPages)
          setTotalpages(arr)
          setNotice(res.data.content)
          
         
      })
    
    }

    const search=()=>{
      console.log("검색")

      if(searchtext===""){
        alert("검색어를입력하세요")
      }
    else{  
     navigate(`/notice?pages=${page}&selectoptions=${selectoption}&keywords=${searchtext}`)
    }
    }

    const totalpageget=(totalpage)=>{

      const arr=[]
      for(let i=1;i<=totalpage;i++){
          arr[i]=i;
      }

      return arr;
    }

    const noticecreate=()=>{
            navigate(`/noticecreate`)
    }

    const noticeonclick=(detailnum)=>{
      navigate(`/noticedetail/${detailnum}`)
    
    }

    
  
    return {notice,totalpage,search,noticecreate,noticeonclick}
}
    
     

export default Noticelistlogic;