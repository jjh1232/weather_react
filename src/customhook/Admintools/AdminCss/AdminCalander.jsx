import React, { useEffect } from "react";
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
    const headers=["일","월","화","수","목","금","토"]
    //const weekstartdate=startOfWeek(new Date()); //시작데이트지정인듯?
    const {currentdate,movemethod}=props;
    const monthStart = startOfMonth(currentdate); //현재달의시작날짜
    const monthEnd = endOfMonth(monthStart); //현재달의 마지막날짜
    const startDate = startOfWeek(monthStart); //현재주의첫주날짜
    const endDate = endOfWeek(monthEnd);  //현재달의 마지막주의 끝날짜

    const [current,setCurrent]=useState(
        {
            year:format(currentdate,'y'),
            month:format(currentdate,'M'),
            day:format(currentdate,'d')
        }
    );

    const days=eachDayOfInterval({start:startDate,end:endDate}); //현재달의첫주의마지막주의끝날짜
    for (let year=0;year<3;year+=1){
       
        Years.push(format(currentdate,"y")-year)
        console.log("년도"+format(currentdate,"y"))
    }

    for(let day=0;day<7;day+=1){
        console.log("데이배열")
        weekdays.push(format(addDays(startDate,day),`EEEEE`))
    }
    for (let month=1;month<13;month+=1){
       // Months.push(addMonths(monthStart,month));
       console.log("달배열")
        Months.push(month.toString())
        
    }

    
    useEffect(()=>{
        movemethod(current)
    },[current.day])
   
    const onClickday=async(data)=>{
        //이거좀늦는데..usestate동기화문제가 useeffect말곤해결법몰루겟음
      
            setCurrent((prev)=>({...prev,day:format(data,'d')}))

    
    
        
        
    }
   

   

    return (
        <>
        {console.log("달의시작날짜"+endDate)}
        현재시각:{current.year}년{current.month}월{current.day}일
        <Yearcss 
        >
            {Years.reverse().map((data,key)=>{return(
                <Yeartd onClick={()=>{
                    setCurrent({...current,year:data})
                }} key={key} Selected={data===current.year?true:false}>
                    {data}년
                </Yeartd>
              )}
              )}
    
            </Yearcss>
        
        <Monthcss>{Months.map((data,key)=> <Monthtd onClick={()=>{
                    setCurrent({...current,month:data})
                }} key={key} Selected={data===current.month?true:false}
                >
                    {data}월</Monthtd>)}</Monthcss>
        <Container>
                <DayHeader>{headers.map((data,key)=>{
                    return (
                        <Daytd key={key} >
                            {data}
                        </Daytd>
                    )
                })}</DayHeader>
                {days.map((day,key)=>{
            return (

                <Daycss onClick={()=>{
                    onClickday(day);
                }} key={key} 
                Selected={format(day,'d')===current.day?true:false}
                >
                {format(day,'d')}
                
                </Daycss>
            )
        })}

</Container>
        </>
    )

}
const Daycss=styled.div`
    width:13.7%;
    height: 50px;
    border:1px solid gray;
    display: flex;
  justify-content: center;
  align-items: center;
 
    background-color:${(props)=>props.Selected?"blue":"white"};
`
const Container=styled.div`
    display: flex;
    flex-wrap:wrap;
    border: 1px solid red;
    
    width: 100%;
    height: 300px;
`
const Monthcss=styled.div`
    display: flex;
    
    border: 1px solid black;
`
const Monthtd=styled.div`
   text-align: center;
   border:1px solid black;
    background-color:${(props)=>props.Selected?"blue":"white"};
`
const Yeartd=styled.div`
   text-align: center;
   border:1px solid black;
     background-color:${(props)=>props.Selected?"blue":"white"};
`
const Yearcss=styled.div`
   display: flex;
`
const DayHeader=styled.div`
    display: flex;
    flex-wrap:wrap;
    width:100%;
    height: 30px;
    border:1px solid blue;
`
const Daytd=styled.div`
    text-align: center;
    border:1px solid green;
    width:13.7%;
    height: 100%;
    
`