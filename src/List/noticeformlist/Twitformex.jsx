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


const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;

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

export default function Twitformex(props){
    //const {posts,onClickItem,noticecreate,querydatas
   
        let [query,setQuery]=useSearchParams({
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

       //이거 어싱크함수로 밖에빼서 한번해볼까함 
       useEffect(()=>{
        noticedata()
        
    }
       ,[page,location])

       //인뷰를따로뺴야할거같은데 
       useEffect(()=>{
        console.log("트윗폼유즈이펙트시작")
        console.log(page)
        console.log(totalpage)
        

        if(page<=totalpage&&!isloading&&inView){
        setPage((prev)=>prev+1)
        console.log("현재페이지:"+page)
        console.log("토탈페이지:"+totalpage)    
        }
        
    
       },[inView])
      

       
      

       //이거 검색시 기존데이터삭제 메소드필요해서 서치에넘겨야할ㄷㅅ?
        

       const noticedata=()=>{
        console.log(query.get("keywords"))
       setIsloading(true)
        axios.get(`/open/noticesearch`,{
          params:{
          option:query.get("selectoptions"),
          keyword:query.get("keywords"),
          page:page
          }
        }).then((res)=>{
          
            console.log(res)
           
            
            const newcontent=res.data.content;
          
            console.log("뉴");
            if(res.data.content.length===0){
                console.log("자료가없어요!")
            }
            else{
                if(notice===""){
                    console.log("기존자료없음")
                    
                    let arr=totalpageget(res.data.totalPages).length-1
                    setTotalpage(arr);
                    setNotice(res.data.content)
                    if(page<=arr){
                        
                        console.log("토탈페이지11:"+arr)
                        console.log("토탈페이지111:"+totalpage)
                    }
                 
                }else{
                    ///...은배열이개별원소가된다 .객체의경우나머지를의미하게됨
                    console.log("포스트추가")
                    //전개연산자로재활당을해야하는데어떻게하지..
                setNotice([...notice,...res.data.content])
                let arr=totalpageget(res.data.totalPages).length-1
                
                setTotalpage(arr);
                
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
      /*
useEffect(()=>{
        console.log("트윗폼유즈이펙트")
        
    observer.observe(scrollref.current)
    
   // setIsloading(true)
    //프롭스가전달안되서 변경시 적용되야하는데어떤기준으로할지고민
   },[location])
*/
   
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
       //==============렌더링!==============================================================
       return (
        <>
       
        
       {process.env.PUBLIC_URL}
        <Wrapper>
        <button onClick={()=>{
            setIscreate(true)
        }}> 글작성하기 </button>{statuschange}
        <Noticeformbutton/>
        
        
        <br/>
        

        {iscreate &&<Modalout>

        <Modalin><button onClick={()=>{setIscreate(false)}}>글작성끄기</button>
        <Twitnoticecreate setIscreate={setIscreate} redataget={redataon}/>
        </Modalin>
        
        </Modalout>}
       
            
        <Searchtool
         searchdata={querydata}
         deletemethod={noticereset}
         twitformpage={setpagehandler}
        />
       
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
