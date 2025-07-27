import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay as front } from "@fortawesome/free-solid-svg-icons";

const Wrapper=styled.div`
    display: flex;
    position: relative;
    width: 300px;
    
    float: left;
 
    gap: 4px;
`
const Firstdiv=styled.div`
display: flex;
   gap: 4px;
`
const Pagediv=styled.div`
    display: flex;
    
    //border: 1px solid red;
       gap: 5px;
`
const Lastdiv=styled.div`
    display: flex;
    gap: 4px;
`

const Numbutton=styled.button`
    position: relative;
    background: ${(props)=>props.current?"gray":"none"};
    border:0.5px solid  gray;
  //  border: 1px solid gray;
     cursor: pointer;
     /*가상 요소로 밑줄 만들기 */
     &::after{
        content: ""; //가상요소생성필수
        position: absolute; //위치고정용
        left: 20%;
        bottom: 1px; //버튼텍스트바로아래위치
        width: 70%;
        height: 2px; //밑줄두께
        background-color: black; //줄색
         transform-origin: left;      /* 확장 애니메이션 시작점: 왼쪽에서 */
        transform: scaleX(0);        /* 시작은 밑줄 안 보이게(길이 0) */
        //transition: transform 0.3s ease; /* 부드럽게 변하도록 */
    }
      /* 마우스 올릴 때: 밑줄 길이를 100%로 확대 */
  &:hover::after {
    transform: scaleX(1);
  }
    
`
//따로태그만드는게더쉬울듯
const Numspan=styled.span`
    position: relative;
    color:${(props)=>props.current?"red":"black"};
    
`
const Pagebutton=styled.button`
    visibility: ${(props) => (props.hidden ? 'hidden' : 'visible')};
   
    background: none;
    cursor: pointer;
    position: relative;
    border:0.5px solid  gray;
     /*가상 요소로 밑줄 만들기 */
     &::after{
        content: ""; //가상요소생성필수
        position: absolute; //위치고정용
        left: 20%;
        bottom: 1px; //버튼텍스트바로아래위치
        width: 70%;
        height: 2px; //밑줄두께
        background-color: black; //줄색
         transform-origin: left;      /* 확장 애니메이션 시작점: 왼쪽에서 */
        transform: scaleX(0);        /* 시작은 밑줄 안 보이게(길이 0) */
        //transition: transform 0.3s ease; /* 부드럽게 변하도록 */
    }
      /* 마우스 올릴 때: 밑줄 길이를 100%로 확대 */
  &:hover::after {
    transform: scaleX(1);
  }
`
const Playimo=styled(FontAwesomeIcon)`
    
`
const Backimo=styled(FontAwesomeIcon)`
    transform: scaleX(-1);//좌우뒤집기
`


function WeatherPagenation(props){

    const {currentpage,getpagedata,totalpages}=props;

   

   
    let startpage,endpage;
    const maxpageshow=5;//보여줄양

    if(totalpages <=maxpageshow){
        startpage=1;
        endpage=totalpages;
    }else{
        const middle=Math.floor(maxpageshow/2);//페이지가 소수가 될수있어서 버려야함

        if(currentpage<=middle+1){
            startpage=1;
            endpage=maxpageshow;
        }else if(currentpage >=totalpages-middle){
            startpage=totalpages-maxpageshow+1;//4가차이나야하니까 +1
            endpage=totalpages;
        }else{
            startpage=currentpage-middle;
            endpage=currentpage+middle;
        }
    }
    const pagearray=[];
            
const setPage=(currentpagedata)=>{
    getpagedata(currentpagedata);
}

for (let i=startpage ; i<=endpage;i++){
    pagearray.push(i)
}


            return(<Wrapper key="pagenation">
                    
                <Firstdiv>

            
         
             <Pagebutton hidden={startpage>1?false:true} 
             onClick={(e)=>{ e.preventDefault()
                 setPage(1)}}>...1</Pagebutton>
           
             <Pagebutton hidden={startpage<2?true:false} 
              onClick={(e)=>{ e.preventDefault()
                 setPage(startpage-1)}}>
                    <Backimo icon={front}/>

                 </Pagebutton>

                </Firstdiv>
               
                <Pagediv>
             {pagearray.map((p,key)=>{
                
               return (
                  
                       
                        
                        <Numbutton key={key} current={p===currentpage?true:false} onClick={(e)=>{
                            e.preventDefault();
                            setPage(p)}
                        }>
                            <Numspan current={p===currentpage?true:false}>{p}</Numspan>
                        </Numbutton> 

                   
                )

             })}
             </Pagediv>
              <Lastdiv>
                <Pagebutton hidden={endpage===totalpages?true:false} 
                onClick={(e)=>{e.preventDefault()
                    setPage(endpage+1)}}>
                    <Playimo icon={front} />

                    </Pagebutton>

                <Pagebutton hidden={endpage===totalpages?true:false}
                onClick={(e)=>{e.preventDefault()
                    setPage(totalpages)}}>...{totalpages}</Pagebutton>
              
               </Lastdiv>
            

             </Wrapper>   
            )
    
    


}
export default WeatherPagenation;