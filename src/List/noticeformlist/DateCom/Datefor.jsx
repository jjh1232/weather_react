import React from "react";
import styled from "styled-components";


const Timecss=styled.div`

    color: gray;
`
export default function Datefor(props){
    const {inputdate}=props;

    //현재시각
    let currentdate=new Date();
  
    //받은데이터포맷...애시당초에 백에서 포맷안하는게나은듯
    //자바스크립트는 yyyy-MM-dd tt:mm:nn을걍넣으면 Date가되네;
    let parseTime=new Date(inputdate)

    //타임스태프를이용하자 근데밀리세컨드라 1000으로나눠야함
    
   
    const timemethod=()=>{
        
        const seconds=Math.floor(((currentdate.getTime()-parseTime.getTime())/1000))
        const minutes= seconds/60;
        const hours = minutes / 60
        const days = hours / 24;
        const months=days/30;
        const years=months/12;

    if(seconds<60) 
        {
            console.log("방금전")   
            return `방금전`}

    
    else if(minutes<60){ 
        
        console.log("한시간이내")  
        return `${Math.floor(minutes)}분전`
    }

 
	else if (hours < 24) {
        
        console.log("하루이내")  
        return `${Math.floor(hours)}시간 전`}

	
	else if (days < 30) {
       console.log("시간"+Math.floor(days))
        return `${Math.floor(days)}일 전`
    }
    else if (months<12){
             return `${Math.floor(months)}달 전`
        
    }else {
         return `${Math.floor(years)}년 전`
    }

      
    }
    let result=timemethod();
    return (
        <Timecss>
         {result}
        </Timecss>
    )
}
