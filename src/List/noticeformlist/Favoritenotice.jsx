import React, { useState,useEffect } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import {  useInView } from "react-intersection-observer";
import styled from "styled-components";
import Twitformlist from "./Twitformlist";
import Noticeformbutton from "../../Noticepage/NoticePattern/Noticeformbutton";
import Searchtool from "../../UI/Noticetools/Searchtool";
import Twitnoticecreate from "./Twitnoticecreate";
import { useNavigate } from "react-router-dom";

const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;
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
const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
function FavoriteNotice (){
   const [page,setPage]=useState(1); 
   const [totalpage,setTotalpage]=useState(1);
   const [notice,setNotice]=useState();
   const navigate=useNavigate();
   const [ref,inview]=useInView({
    threshold :0.1,       //뷰포트기준요소가몇%보이냐설정
    triggerOnce:false,  //기본도false임 observer가한번만실행댐트루면
   initialInView:false //inview초기값설정 처음부터 타겟이보일것으로예상되면
    //true줘도댐
    ,delay:1  //딜레이! 근데안먹히는디;
});

const [iscreate,setIscreate]=useState(false)
const axiosinstance=CreateAxios();

useEffect(()=>{
    if(totalpage>=page){
          
        
        getnoticedata()
        
    }
   
    
},[inview])

const getnoticedata=()=>{

    axiosinstance.get(`/onlikenotice`,{
        params:{
            page:page
        }
    }).then((res)=>{
        if(!notice){
        console.log("기존자료없ㅇ음")
        
        console.log(res.data.notice)
        console.log(res.data.totalpage)
        setNotice(res.data.notice)
        setTotalpage(res.data.totalpage)
        setPage(page+1)
        }
        else{
            
            setNotice([...notice,...res.data.notice])
            setTotalpage(res.data.totalpage)
            setPage(page+1)
        }
    }).catch((err)=>{
        console.log("에러")
    })
}
const noticereset=()=>{
    setNotice("")
    //노티스리셋
    
   }
const setpagehandler=()=>{
    setPage(1)
   }

   //데이터받기
   const redataon=()=>{
    
    navigate("/notice/twitform")
    
   }
return (
<div>
<Wrapper>
    
<Noticeformbutton/>

<button onClick={()=>{
            setIscreate(true)
        }}> 글작성하기 </button>

{iscreate?<div>
    <Modalout>
        <Modalin><button onClick={()=>{setIscreate(false)}}>글작성끄기</button>
            <Twitnoticecreate setIscreate={setIscreate} redataget={redataon}/>
        </Modalin>
    </Modalout>
</div>:<div></div>}
<Searchtool
         
         deletemethod={noticereset}
         twitformpage={setpagehandler}
        />
{notice&&notice.map((data,key)=>{
    return (
        <div>
            
          <Twitformlist
                        key={key} post={data} 
                    />
                    </div>
    )
})}




<div ref={ref}>
    마지막부분
</div>
</Wrapper>
</div>
)

}
export default FavoriteNotice