import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import Noticelist from "../List/Noticelist";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../customhook/authCheck";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import Twitform from "../List/noticeformlist/Twitform";
import CreateAxios from "../customhook/CreateAxios";
import { useLocation } from "react-router-dom";
import Noticeformbutton from "./NoticePattern/Noticeformbutton";

const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;

`

Noticeex.defaultProps={
  form:"noticeform"
}

//이걸로새로 해보자 
function Noticeex(props){
    console.log("노티스ex시작 ")
  //쿼리스트링 가져오기 
  let [query,setQuery]=useSearchParams({
    form:"noticeform",
    pages:1,
    selectoptions:"title",
    keywords:""

  });
  
 
    
    const querydataparam={
      form:query.get("form"),
      pages:query.get("pages"),
      selectoptions:query.get("selectoptions"),
      keywords:query.get("keywords")

    }
    
 
const location=useLocation();

   
   

  const [notice,setNotice]=useState();
  const [totalpage,setTotalpages]=useState([]);
  
  const [searchtext,setSearchtext]=useState();
  

  
  const navigate=useNavigate();
  const logincheck=AuthCheck();
  const axiosinstance=CreateAxios();
  //셀렉트검색
  const options = [
    {value:"title",name:"제목"}, 
    {value:"text",name:"내용"}, 
    {value:"titletext",name:"제목+내용"}, 
    {value:"name",name:"글쓴이"} 
  ]

const defaultnotice=`/open/notice`;
const searchurl=`/open/noticesearch`;

const noticereset=()=>{
  console.log("노티스삭제")
  
  setNotice()
 }
useEffect(()=>{
  console.log("노티스유즈이펙트데이터겟")
  

 
 
    searchdata();
  
},[location])

 
  //데이터 가져오기
  const searchdata=(e)=>{
     
     
      axios.get(searchurl,{
        params:{
        option:querydataparam.selectoptions,
        keyword:querydataparam.keywords,
        page:querydataparam.pages,
        }
      }).then((res)=>{
        if (querydataparam.form==="twitform"){
          console.log(`트윗폼데이터!`)
          if(notice){
            console.log("기존노티스존재")
            const arr=totalpageget(res.data.totalPages)
          setNotice([...notice,...res.data.content])
          setTotalpages(arr)
          }
          else{
            console.log("기존노티스없음")
            const arr=totalpageget(res.data.totalPages)
            setNotice([...res.data.content])
            setTotalpages(arr)
          }
        }
          
          else{

          console.log("다른데이터버전")
         
          console.log(res.data.totalPages)
          const arr=totalpageget(res.data.totalPages)
          setTotalpages(arr)
          setNotice(res.data.content)
          }
         
      })
    
    }
   

    const totalpageget=(totalpage)=>{

      const arr=[]
      for(let i=1;i<=totalpage;i++){
          arr[i]=i;
      }

      return arr;
    }

    const noticecreate=()=>{
      if(logincheck){
        navigate(`/noticecreate`)
      }
      else{
        alert("로그인후작성할수있습니다")
      }
    }
    const noticeonclick=(detailnum)=>{
      navigate(`/noticedetail/${detailnum}`)
    
    }

    const setpagequery=(page)=>{
      console.log("셋페이즈쿼리메서드실행:"+page)
      query.set("pages",page)
      setQuery(query)
    }

    //게시판폼변경=====================================
    const transform=(formdata)=>{    
      console.log("게시판폼변경 ")
      if(formdata.form==="noticeform"){

        return(<>
        <Noticelist 
        posts={notice}
        onClickItem={
          noticeonclick
        }
        noticecreate={noticecreate}
        
        querydatas={formdata}
        totalpage={totalpage}
        
        setpagequery={setpagequery}
       
        //searchtext={searchtext}
        //setsearchtext={setSearchtext}
        //setselectoption={setSelectoptions}
        
        />
        </>)
      }
      else if(formdata.form==="twitform"){
        return (<>
          <Twitform
           posts={notice}
           onClickItem={
             noticeonclick
           }
           noticereset={noticereset}
           noticecreate={noticecreate}
          
           querydatas={formdata}
           totalpages={totalpage}
           
           setpagequery={setpagequery}
           commentcreate={commentsubmit}
          />
        </>)
      }
      else if(formdata==="previewform"){
        return (<>
          프리뷰폼
        </>)
      }
    }

    //코멘트 작성 함수
    const commentsubmit=(
      username,usernickname,comment,noticenum,depth,cnum
    )=>{
      console.log("시작왜리렌더링")
      
      
      if(comment===''){
        alert("글을작성해주십시오")
      }
      else{
        
        axiosinstance.post("/commentcreate",{
          noticeid:noticenum,
          depth:depth,
          cnum:cnum,
          username:username,
          nickname:usernickname,
          text:comment,
          

        }).then((res)=>{
                      
          alert("작성완료")
        
        }).catch((error)=>{
            alert("코멘트에러!")
            console.log("코멘트에러")
        })
      
      }
      
    }
    
    return (
      <Wrapper>
       
        <Noticeformbutton/>
          
          <br/> 
            ex토탈{totalpage.length}
            {querydataparam&&transform(querydataparam)}
        
       
     
      </Wrapper>
    )



  }
export default Noticeex;