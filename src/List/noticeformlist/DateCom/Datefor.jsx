import React from "react";
import styled from "styled-components";


const Timecss=styled.div`

    color:${(props)=>props.color || "gray"} ;
`
/*
 * 서버 시간 문자열을 Date 로.
 *
 * 서버는 "2026.09.15/09:09:7" 처럼 보낸다(초가 한 자리일 때도 있다).
 * 크롬은 이 비표준 형식을 new Date() 로 알아서 읽지만 **파이어폭스는 Invalid Date** 를 내서
 * 화면에 「NaN년 전」 이 떴다(2026-09-15). 그래서 직접 쪼갠다. 한국 시간 기준으로 저장된 값이다.
 * 형식이 다르면(ISO 등) 예전처럼 new Date() 에 맡긴다.
 */
export function parseServerDate(value){
    if(value==null) return new Date(NaN)
    const m=String(value).match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})\/(\d{1,2}):(\d{1,2}):(\d{1,2})/)
    if(m){
        const [,y,mo,d,h,mi,s]=m.map(Number)
        return new Date(y,mo-1,d,h,mi,s)
    }
    return new Date(value)
}

export default function Datefor(props){
    const {inputdate,colors}=props;

    //현재시각
    let currentdate=new Date();
  
    //받은데이터포맷...애시당초에 백에서 포맷안하는게나은듯
    let parseTime=parseServerDate(inputdate)

    //타임스태프를이용하자 근데밀리세컨드라 1000으로나눠야함
    
   
    const timemethod=()=>{
        if(isNaN(parseTime.getTime())) return ""   //못 읽는 값이면 「NaN년 전」 대신 비운다
        
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
        <Timecss color={colors}>
         {result}
        </Timecss>
    )
}
