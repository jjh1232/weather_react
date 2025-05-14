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
position: relative;
left:28.5%;
width:43%;
height:100%;

 color:${props => props.theme.text};
 background:${props => props.theme.background};
 top: 8%;

`
const Modalout=styled.div`
width:45% ;
height:85% ;
position: fixed;
background:rgba(0,0,0,0.5);
display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center; //위로부터 중간
`

const Modalin=styled.div`
padding: 15px;
width:90%;
height:70%;
background-color: #FFFFFF;

`
//헤더
const Headerdiv=styled.div`
    display: flex;
    
    border: 1px solid red;
`
const Creatediv=styled.div`
    
     
`
const CreateButton=styled.button`
    //display: inline-flex;
  align-items: center;
  outline: none;
  border: 1px solid black;
  border-radius: 4px;
  white-space: nowrap;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 0 1rem;
  height: 2.25rem;
  font-size: 1rem;
  background: #228be6;  /* 솔리드 컬러 */
  transition: background 0.2s;
  /* 기본 그림자 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  &:hover {
    background: #339af0;
  }
  &:active {
    background: #1c7ed6;
  }
`
const Searchdiv=styled.div`
     //border: 1px solid yellow;
     width: 50%;
`
const Formdiv=styled.div`
     border: 1px solid green;
     width: 50%;
`

export default function Twitformex(props){
    //const {posts,onClickItem,noticecreate,querydatas
        //로케이션으로 좋아요 와 일반게시글차이만들자
     
   
       // const axiosinstance=CreateAxios();

        let [query,setQuery]=useSearchParams({ //기초값일꺼임
            form:"twitform",
            selectoptions:"title",
            keywords:"",
            pages:1
        })
        const [statuschange,setStatuschange]=useState()
       //}=props;
        //console.log(`트윗폼메인함수시작`+totalpages.length)
       
        const [notice,setNotice]=useState("");
     
       const scrollref=useRef(null);
        
     const [isloading,setIsloading]=useState(false);

      const [page,setPage]=useState(parseInt(query.get("pages")));
      console.log("트윗폼시작"+page)
      const [totalpage,setTotalpage]=useState(1);
       const [ref,inView]=useInView();
      //console.log("프롭스렝스:"+totalpages.length)
       //로케이션으로 좋아요 와 일반게시글차이만들자
      const location=useLocation();
       const [searchdatas,setSearchdatas]=useState(
        {
            form:query.get("form"),
            selectoptions:query.get("selectoptions"),
            keywords:query.get("keywords"),
            
        }
       )
       const querydata={

            form:query.get("form"),
            selectoptions:query.get("selectoptions"),
            keywords:query.get("keywords"),
       }
       //스크롤페이지변경시 실행 
       

       const [iscreate,setIscreate]=useState(false)
       let islogin=AuthCheck();
       //이거 어싱크함수로 밖에빼서 한번해볼까함 
       useEffect(()=>{
        let apiurl="";
        if(location.pathname==="/notice/twitform"){
            islogin?apiurl=`/noticeget`: apiurl=`/open/noticesearch`
          
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
    }
       ,[page,location,islogin])

       //인뷰를따로뺴야할거같은데 
       useEffect(()=>{
        
        

        if(page<=totalpage&&!isloading&&inView){
        setPage((prev)=>prev+1)
        console.log("현재페이지:"+page)
        console.log("토탈페이지:"+totalpage)    
        }
        
    
       },[inView])
      

       
      

    const axiosinstance=islogin ? CreateAxios() : axios;

       const noticedata=(apiurl)=>{
       
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
          
            console.log("뉴");
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
      //로그인시 일단따로
      const loginnoticedata=()=>{
        console.log(query.get("keywords"))
       setIsloading(true)
        axiosinstance.get(`/noticeget`,{
          params:{
          option:query.get("selectoptions"),
          keyword:query.get("keywords"),
          page:page
          }
        }).then((res)=>{
          
           
           
            
            const newcontent=res.data.content;
          
            console.log("뉴"+newcontent);
            if(newcontent===undefined){
                
                console.log("자료가없어요!")
            }
            else{
                
                    let arr=totalpageget(res.data.totalPages).length-1
                    setTotalpage(arr);
                    setNotice(prevData=>{
                        if(!prevData||prevData.length===0) return newcontent

                        return [...prevData,...newcontent]
                    })
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

   
       //검색옵션 =========================================
       //서치툴로 다해결하고싶은데 props일일히 주고 옮기기도귀찮고 그냥여기서 검색메서드넘기자
       const noticereset=()=>{
        setNotice("")
        //노티스리셋
        
       }
       //페이지리셋이 쿼리단계로안먹힘..
       const setpagehandler=()=>{
        setPage(1)
       }
       //글작성시상태변경
       const redataon=()=>{
        console.log("글작성시리렌더노티스지워준뒤다시")
        //배열아니면map을못받고 스프레드연산자를 배열밖에서안쓰면map이안되고..
        //일단무식하게그냥새로고침..
        //setNotice([...notice])
        window.location.reload();
       }
       const islogincheck=AuthCheck();
       const Createnotice=()=>{
            if(islogincheck){
                setIscreate(true)
            }
            else{
                alert("로그인후이용해주세요!")
            }
       }
       //==============렌더링!==============================================================
       return (
        <>
       
        
       
        <Wrapper>
        <Headerdiv>
        
            <Creatediv>
        <CreateButton onClick={()=>{
            Createnotice();
        }}> 글작성하기 </CreateButton>
        </Creatediv>
       
       <Formdiv>
        <Noticeformbutton/>
    </Formdiv>
        
                    <Searchdiv>
    <Searchtool
         searchdata={querydata}
         deletemethod={noticereset}
         twitformpage={setpagehandler}
        />
         </Searchdiv>
 
</Headerdiv>

        {iscreate &&<Modalout>

        <Modalin><button onClick={()=>{setIscreate(false)}}>글작성끄기</button>
        <Twitnoticecreate setIscreate={setIscreate} redataget={redataon}/>
        </Modalin>
        
        </Modalout>}
       
            
    
       
        {notice&&
        <div>
        {notice.map((post,key)=>{
            return (
                <>

                <Twitformlist
                key={key} post={post} 
            />
            
            <br/>
           
            </>
            )
    
        }
      
    )
       
    }
            <div ref={ref} >마지막부분</div>
        </div>
        }
            
            
            
        
            
      
        </Wrapper>
        </>
    )
}
