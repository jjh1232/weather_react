import React from "react";
import {
    addDays,
    endOfMonth,
    endOfWeek,
    startOfMonth,
    startOfWeek,
    eachDayOfInterval,
    format,
    addMonths,
    startOfYear,
  } from 'date-fns';
  import { useState } from "react";
  import styled from "styled-components";

export default function AdminCalander(props){
    const weekdays=[]; //일토요일배열
    const Months=[];
    const Years=[];
    //const weekstartdate=startOfWeek(new Date()); //시작데이트지정인듯?
    const {currentdate}=props;
    const monthStart = startOfMonth(currentdate); //현재달의시작날짜
    const monthEnd = endOfMonth(monthStart); //현재달의 마지막날짜
    const startDate = startOfWeek(monthStart); //현재주의첫주날짜
    const endDate = endOfWeek(monthEnd);  //현재달의 마지막주의 끝날짜

    const days=eachDayOfInterval({start:startDate,end:endDate}); //현재달의첫주의마지막주의끝날짜

    for(let day=0;day<7;day+=1){
        weekdays.push(format(addDays(startDate,day),`EEEEE`))
    }
    for (let month=1;month<13;month+=1){
       // Months.push(addMonths(monthStart,month));
        Months.push(month)
        
    }
    for (let year=3;year<1;year-=1){
        Years.push(format(currentdate,"Y")-year)
        console.log(year)
    }


    const [current,setCurrent]=useState();

    return (
        <>
        {console.log("달의시작날짜"+endDate)}
        <Yearcss>{Years.map((data,key)=>{return(<>{console.log("년도"+data)}{data}년</>)})}</Yearcss>
        
        <Monthcss>{Months.map((data,key)=> <>{data}월</>)}</Monthcss>
        <Container>
        {days.map((day,index)=>{
            return (

                <Daycss>
                {format(day,'d')}
                
                </Daycss>
            )
        })}

</Container>
        </>
    )

}
const Daycss=styled.div`
    width:14.28%;
    height: 30px;
    
    background-color: white;
`
const Container=styled.div`
    display: flex;
    flex-wrap:wrap;
    border: 1px solid red;
    
    width: 100%;
    height: 300px;
`
const Monthcss=styled.div`
    
    
    border: 1px solid black;
`
const Yearcss=styled.div`
    
`