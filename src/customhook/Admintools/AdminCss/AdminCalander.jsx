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
    let Years=[];
    const headers=["일","월","화","수","목","금","토"]
    //const weekstartdate=startOfWeek(new Date()); //시작데이트지정인듯?
    const {currentdate,movemethod,chatdata}=props;
    const [newcurrentdate,setNewcurrentdate]=useState(currentdate);

    const [current,setCurrent]=useState(
        {
            year:format(currentdate,'y'),
            month:format(currentdate,'M'),
            day:format(currentdate,'d')
        }
    );


    const monthStart = startOfMonth(newcurrentdate); //현재달의시작날짜
    const monthEnd = endOfMonth(monthStart); //현재달의 마지막날짜
    const startDate = startOfWeek(monthStart); //현재주의첫주날짜
    const endDate = endOfWeek(monthEnd);  //현재달의 마지막주의 끝날짜

    
    const days=eachDayOfInterval({start:startDate,end:endDate}); //현재달의첫주의마지막주의끝날짜
   
    for (let year=0;year<3;year+=1){
        //얘는 고정으로가야할거같아서 props로바로사용
        Years.push(format(currentdate,"y")-year)
        
    }
    for (let month=1;month<13;month+=1){
        // Months.push(addMonths(monthStart,month));
        console.log("달배열")
         Months.push(month.toString())
         
     }

    for(let day=0;day<7;day+=1){
        console.log("데이배열")
        weekdays.push(format(addDays(startDate,day),`EEEEE`))
    }
   

    
    useEffect(()=>{
        movemethod(current)
    },[current.day])
   
    const onClickday=async(data)=>{
        //이거좀늦는데..usestate동기화문제가 useeffect말곤해결법몰루겟음
      
            setCurrent((prev)=>({...prev,day:format(data,'d')}))

    
    
        
        
    }
   
    const onClickMonth=(month)=>{
        const newd=new Date(current.year+"-"+month+"-"+current.day)
        setNewcurrentdate(newd)
    }
    const onClickYear=(year)=>{
        
        const newy=new Date(year+"-"+current.month+"-"+current.day)
        
        setNewcurrentdate(newy)

    }
   
    //var chatdate=Object.keys(chatdata)
    //console.log("채팅있느날짜"+chatdate)
    return (
        <>
               <CalanderHeader>
        Callander
        </CalanderHeader>
        <Yearcss 
        >
            {Years.reverse().map((data,key)=>{return(
                <Yeartd onClick={()=>{
                    setCurrent({...current,year:data})
                    onClickYear(data)
                }} key={key} Selected={data===current.year?true:false}>
                    {data}년
                </Yeartd>
              )}
              )}
    
            </Yearcss>
        
        <Monthcss>{Months.map((data,key)=> <Monthtd onClick={()=>{
                    setCurrent({...current,month:data})
                    onClickMonth(data)
                }} key={key} Selected={data===current.month?true:false}
                >
                    {data}월</Monthtd>)}</Monthcss>

             

        <Container>
                <DayHeader>{headers.map((data,key)=>{
                    return (
                        <Daytd key={key} IsSunday={data==="일"?true:false}>
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
                IsSunday={day.getDay()===0?true:false}
                IsCurrentmonth={monthStart<=day&&day<=monthEnd?true:false}
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
    color:${(props)=>props.IsSunday?"red":"black"};
    background-color:${(props)=>props.Selected?"blue":"white"};
    opacity:${(props)=>props.IsCurrentmonth?1:0.6};
    font-size: 20px;
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
    margin-top: 10px;
    width:100%;
    height: 40px;
    border: 1px solid black;
`
const Monthtd=styled.div`
   text-align: center;
   border:1px solid black;
   display: flex;
  justify-content: center;
  align-items: center;
   width: 8.3%;
    background-color:${(props)=>props.Selected?"blue":"white"};
`
const Yeartd=styled.div`
   
   border:1px solid black;
   width: 33%;
   display: flex;
  justify-content: center;
  align-items: center;
     background-color:${(props)=>props.Selected?"blue":"white"};
`
const Yearcss=styled.div`
   display: flex;
   height: 50px;
   margin-top: 10px;
   border: 1px solid black;
`
const DayHeader=styled.div`
    background-color: white;
    flex-wrap:wrap;
    width:100%;
    height: 30px;
  
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
 
`
const Daytd=styled.div`
    position: relative;
    text-align: center;
    
    border: 1px solid gray;
    width:13.7%;
    height: 100%;
    color: ${(props)=>props.IsSunday?"red":"black"};
    
`
const CalanderHeader=styled.div`
    border: 1px solid black;
    height: 30px;
    margin-top:10px;
    font-size: 20px;
    
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
`
const DataCircle=styled.div`
width : 100px;
  height : 100px;
  border-radius: 50%;
  background-color: tomato;
`