import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Twitformlist from "./Twitformlist";

import axios from "axios";
import Searchtool from "../../UI/Noticetools/Searchtool";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Noticeformbutton from "../../Noticepage/NoticePattern/Noticeformbutton";
import Noticecreate from "../../Noticepage/Noticecreate"
import Twitnoticecreate from "./Twitnoticecreate";
import CreateAxios from "../../customhook/CreateAxios";
import AuthCheck from "../../customhook/authCheck";
import { TimelineSkeleton, TimelineEmpty, TimelineEnd } from "../../UI/Noticetools/Timelinestate";
import { useToast } from "../../UI/Feedback/FeedbackProvider";


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

       //notice 는 초기값이 "" 이고 목록을 받으면 배열이 된다.
       //"아직 안 받음" 과 "받았는데 0개" 를 구분해야 빈 상태를 제대로 띄울 수 있다.
       const hasloaded=Array.isArray(notice);
       const loadedcount=hasloaded?notice.length:0;
       const emptyvariant=location.pathname==="/notice/twitform/liked"
            ?"liked"
            :location.pathname==="/notice/twitform/following"
            ?"following"
            :(location.pathname.startsWith("/notice/imgform")?"image":"notice");

       //글작성 모달은 부모(Twitformex)에 있어서 여기 목록 state 를 직접 못 건드린다.
       //부모가 refreshkey 를 올려주면 그걸 신호로 목록을 처음부터 다시 받는다.
       const {refreshkey}=useOutletContext() ?? {};

       //스크롤페이지변경시 실행 
             
       let islogin=AuthCheck();
       const toast=useToast();

       //경로에 따라 어느 API 를 쓸지만 정한다.
       //목록을 새로 받을 때도 같은 판단이 필요해서 useEffect 밖으로 뺐다.
       const getapiurl=()=>{
        let apiurl="/open/twitformnoticelist";
        
        if(location.pathname==="/notice/twitform"||location.pathname==="/main"||location.pathname==="/"){
            //islogin?apiurl=`/noticeget`: apiurl=`/open/noticesearch`
            
          
        }else if(location.pathname==="/notice/twitform/liked"){

             if(islogin){
                apiurl=`/onlikenotice`;

            }
            else{
            console.log("비로그인상태")
            toast.info("로그인하면 좋아요한 글을 모아볼 수 있습니다.")

            }

        }else if(location.pathname==="/notice/twitform/following"){

            if(islogin){
                apiurl=`/followingnotice`;
            }
            else{
            toast.info("로그인하면 팔로우한 사람들의 글만 모아볼 수 있습니다.")
            }

        }
        return apiurl;
       }

       //이거 어싱크함수로 밖에빼서 한번해볼까함 
       useEffect(()=>{
        console.log("노티스유즈이펙트실행!")
        noticedata(getapiurl())
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

       //글 작성 성공 신호(refreshkey). 최초 마운트 때는 위 useEffect 가 이미 받아오므로 건너뛴다.
       const isfirstrefresh=useRef(true);
       useEffect(()=>{
        if(refreshkey===undefined) return;
        if(isfirstrefresh.current){
            isfirstrefresh.current=false;
            return;
        }

        //무한스크롤이라 누적분을 비우지 않으면 새 글이 목록 아래에 덧붙는다
        setNotice([])

        if(page===1){
            //page 가 그대로면 위 useEffect 가 다시 돌지 않으므로 여기서 직접 받는다
            noticedata(getapiurl())
        }else{
            //page 가 바뀌면 위 useEffect 가 1페이지를 받아온다(중복 요청 방지)
            setPage(1)
        }

       },[refreshkey])
      

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

        {/* 아직 아무것도 못 받은 동안은 스켈레톤이 자리를 잡아준다.
            빈 화면을 보여주면 "글이 없는 것"과 "아직 로딩 중"이 구분되지 않는다. */}
        {isloading&&loadedcount===0&&<TimelineSkeleton rows={3}/>}

        {/* 다 받았는데 정말로 글이 하나도 없을 때 */}
        {!isloading&&hasloaded&&loadedcount===0&&<TimelineEmpty variant={emptyvariant}/>}

        {loadedcount>0&&
        <div>
        {notice.map((post,key)=>{
            return (
                <React.Fragment key={post.id}>
                 
                <Twitformlist
                key={post.id} post={post} 
           
            />
            
            <br/>
           
            </React.Fragment>
            )
    
        }
      
    )
       
    }
            {/* 무한스크롤 감지점. 예전에는 여기 "마지막부분" 이라는 개발용 문구가 그대로 보였다. */}
            <div ref={ref}>
                <TimelineEnd loading={isloading} done={page>totalpage}/>
            </div>
        </div>
        }
  
       
            
    
       
       
            
            
            
        
            
      
        </Wrapper>
        
    )
}
