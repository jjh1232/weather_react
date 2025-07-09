import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Twitformlist from "./Twitformlist";

import axios from "axios";
import Searchtool from "../../UI/Noticetools/Searchtool";
import { useLocation, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Noticeformbutton from "../../Noticepage/NoticePattern/Noticeformbutton";
import Noticecreate from "../../Noticepage/Noticecreate"
import Twitnoticecreate from "./Twitnoticecreate";
import CreateAxios from "../../customhook/CreateAxios";
import AuthCheck from "../../customhook/authCheck";


const Wrapper=styled.div`
    width: 100%;
    


`

//이게메인

export default function Twitformver(props){
    //const {posts,onClickItem,noticecreate,querydatas
        //로케이션으로 좋아요 와 일반게시글차이만들자
     
   
       // const axiosinstance=CreateAxios();
        let [query,setQuery]=useSearchParams({ //기초값일꺼임
            form:"twitform",
            selectoptions:"title",
            keywords:"",
            pages:1
        })
       const [page,setPage]=useState(parseInt(query.get("pages")));
          const [notice,setNotice]=useState("");
                  
     const [isloading,setIsloading]=useState(false);
      
          const [totalpage,setTotalpage]=useState(1);
       const [ref,inView]=useInView();
      //console.log("프롭스렝스:"+totalpages.length)
       //로케이션으로 좋아요 와 일반게시글차이만들자
      const location=useLocation();
             
       //스크롤페이지변경시 실행 
             
       let islogin=AuthCheck();
       //이거 어싱크함수로 밖에빼서 한번해볼까함 
       useEffect(()=>{
        console.log("노티스유즈이펙트실행!")
        let apiurl="/open/twitformnoticelist";
        
        if(location.pathname==="/notice/twitform"||location.pathname==="/main"||location.pathname==="/"){
            //islogin?apiurl=`/noticeget`: apiurl=`/open/noticesearch`
            
          
        }else if(location.pathname==="/notice/twitform/liked"){
           
             if(islogin){
                apiurl=`/onlikenotice`;
            
            }
            else{
            console.log("비로그인상태")
            alert("로그인을후 이용해주세요!")
                
            }
           
      
        }

        noticedata(apiurl)
    },[page,location,islogin,query,location.search])

       useEffect(()=>{
        setPage(1);
        setNotice([])
       },[location.pathname])
       //인뷰를따로뺴야할거같은데 
       useEffect(()=>{
        
        
        if(page<=totalpage&&!isloading&&inView){
        setPage((prev)=>prev+1)
         
        }
        
    
       },[inView])
      

       //검색시데이터초기화 무한스크롤이라필요
       useEffect(()=>{
        setPage(1)
        setNotice([])

       },[query])
      

   //훅규칙때매 여기서만들고 함수안에서분기
const axiosinstance= CreateAxios() ;

       const noticedata=(apiurl)=>{
        //외부에
        //함수안에서분기
        //const instance=islogin?axiosinstance:axios;
        //값없을시 막기
        if (!apiurl) return;
        console.log(query.get("keywords"))
       setIsloading(true)
        axiosinstance.get(apiurl,{
          params:{
          option:query.get("selectoptions"),
          keyword:query.get("keywords"),
          page:page
          }
        }).then((res)=>{    
           const newcontent=res.data.content;
          
            console.log("뉴:",newcontent);
            if(newcontent===undefined){
                console.log("자료가없어요!")
            }
            else{
                                                        
                    let arr=totalpageget(res.data.totalPages).length-1
                    setTotalpage(arr);
                    setNotice(prevNotice=>{
                        if(!prevNotice || prevNotice.length===0) return newcontent

                        
                    return [...prevNotice,...newcontent]
            });

                    if(page<=arr){
                        
                        console.log("토탈페이지11:"+arr)
                        console.log("토탈페이지111:"+totalpage)
                    }
                 
              
            }
           
          
            
            setIsloading(false)
        })
        
 
      }
     
      const totalpageget=(totalpage)=>{

        const arr=[]
        for(let i=1;i<=totalpage;i++){
            arr[i]=i;
        }
  
        return arr;
      }

   
      
     
       //==============렌더링!==============================================================
       return (
        
       
        
       
        <Wrapper>
        {notice&&
        <div>
        {notice.map((post,key)=>{
            return (
                <React.Fragment key={key}>

                <Twitformlist
                key={key} post={post} 
            />
            
            <br/>
           
            </React.Fragment>
            )
    
        }
      
    )
       
    }
            <div ref={ref} >마지막부분</div>
        </div>
        }
  
       
            
    
       
       
            
            
            
        
            
      
        </Wrapper>
        
    )
}
