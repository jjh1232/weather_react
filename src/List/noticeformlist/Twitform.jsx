import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Twitformlist from "./Twitformlist";
import useDidMounteffect from "../../customhook/usdDidMountEffect";
import axios from "axios";
import Searchtool from "../../UI/Noticetools/Searchtool";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";


//현재안씀
export default function Twitform({posts,noticecreate,setpagequery
    ,noticereset,querydatas,totalpages}){
    //const {posts,onClickItem,noticecreate,querydatas
        
       
     
       //}=props;
        console.log(`트윗폼메인함수시작`+totalpages.length)
       
       const [isloading,setIsloading]=useState(false);
     
       const scrollref=useRef();
        
      const location=useLocation();
        const totalpage=totalpages.length
        console.log("토탈페이지변수"+totalpage)
      //console.log("프롭스렝스:"+totalpages.length)

       
       //스크롤페이지변경시 실행 
       /*
       useEffect(()=>{

        noticedata()
       },[location])

       //이거 검색시 기존데이터삭제 메소드필요해서 서치에넘겨야할ㄷㅅ?
      
       const noticedata=()=>{
     
        if(page===0){

        }
        else{
        axios.get(`/open/noticesearch`,{
          params:{
          option:querydatas.selectoptions,
          keyword:querydatas.keywords,
          page:querydatas.pages
          }
        }).then((res)=>{
          
            console.log(res.data.content)
           setIsloading(true)
            
            const newcontent=res.data.content;
          
            console.log("뉴"+newcontent)
            if(res.data.content.length===0){
                console.log("자료가없어요!")
            }
            else{
                if(posts===null){
                    console.log("자료없음")
                    setNotice(res.data.content)
                }else{
                    ///...은배열이개별원소가된다 .객체의경우나머지를의미하게됨
                    console.log("포스트추가")
                setNotice([...notice,...res.data.content])
                
                }
            }
           
          
            
           
        })
    }
    setIsloading(false)
      }
*/
useEffect(()=>{
        console.log("트윗폼유즈이펙트")
        
    observer.observe(scrollref.current)
    
   // setIsloading(true)
    //프롭스가전달안되서 변경시 적용되야하는데어떤기준으로할지고민
   },[location])

       //intersection Obserber 설정========================================
       let interoptions={
        root:null, //타겟 요소가 어디에 들어왔을떄 콜백함수를실행할것인지
        //null이면 viewport(내가보는화면)가 null로지정됨 ex)root:document.queryselector(#스크롤지역)
        //특정요소 선택
        rootMargin:`0px`,//root에 마진값을 주어 범위 확장 가능 
        threshold:1 //타겟요소가 얼마나 들어왔을떄 콜백함수실행할지 1이면 전체요소다임

       }
       const callback=()=>{
        console.log("콜백:"+totalpage.length)
       }
       const observercallback=(entries,       
        observer)=>{
            console.log("트윗폼옵저버콜백함수======================")
            const tar=entries[0]
            //타겟정보가 entries0에있나봄 
            console.log("옵저버콜백토탈111:"+totalpage)
            console.log("옵저버현재페이지:"+querydatas.pages)
        if(tar.isIntersecting){//위의타겟에 entries배열확인하면서 노출여부확인
            console.log("옵저버콜백토탈222:"+totalpages.length)
            
            if(querydatas.pages<totalpages.length-1)
            {
                console.log("토탈페이지이하")
            setpagequery(parseInt(querydatas.pages)+1)
             }
             else{
                console.log("토탈페이지보다큼")
                
             }
        }else{
            console.log("감지되지않음")
            
        }
       }
       //첫번째 인자관측시 콜백함수실행
       //두번째관측 옵션
       let observer=new IntersectionObserver(observercallback,interoptions)
       
       //타겟요소 관측시작 이건 유즈이펙트로
       //observer.observe(scrollref)
       //타겟요소 관측 종료 
       //observer.unobserve(scrollref)

       
    

    
       //==============렌더링!==============================================================
       return (
        <>
        {    console.log("트윗폼렌더링시작")}
        <button onClick={noticereset}> 노티스삭제</button>
        <br/>
        페이지 {querydatas.pages}
        <br/>
        토탈{totalpages.length}
      
        <Searchtool searchdata={querydatas} deletemethod={noticereset}/>
       
        {posts&&
        <div>
        {posts.map((post,key)=>{
            return (
                <>

                <Twitformlist
                key={key} post={post} 
            />
            <br/>
           
            </>
            )
        })
    }
       
        </div>
        }
       <div ref={scrollref}>
        더이상자료가없습니다 {querydatas.pages}
        <br/>
        {isloading?"true":"false"}
        </div>
        </>
    )
}