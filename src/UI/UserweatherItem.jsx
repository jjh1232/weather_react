import React, { useEffect, useState } from "react";


function Userweatheritem(props){

    const {dates}=props;
    const [data,setData]=useState({
        time:dates.time,
        date:dates.date,
        reh:dates.reh,
        rn1:dates.rn1,
        sky:"",
        t1h:dates.t1H,
        pty:"",
        wsd:dates.wsd
    });

    const skydata=(data)=>{
        //console.log("sky데이터가공")
        let sky="";
        switch(data){
           

            case "1":
               // console.log(dates.sky)
               sky="맑음";
                break;
           
            case "3":
            sky="구름맑음"
                  break;
    
            case "4":
             //   console.log("음")
                sky="흐림"
                break;
            }
            return sky;
    }
    const ptydata=(data)=>{
        //console.log("pty데이터가공")
        let pty="";
        switch(data){
            
            case "0":
               pty="맑음";
                break;
           
            case "1":
                pty="비";
                  break;
    
            case "2":
                //console.log("음")
                pty="비/눈";
                break;
            case "3":
                  //  console.log(dates.sky)
                    pty="눈";
                    break;
               
            case "5":
                pty="빗방울";
                      break;
        
            case "6":
                 //   console.log("음")
                    pty="빗방울,눈날림";
                    break;
             case "7":
                     //   console.log("음")
                        pty="눈날림";
                        break;
            }
            return pty;
    }
    useEffect(()=>{
                   
          const sky1=skydata(dates.sky);
          const pty1=ptydata(dates.pty);   

          setData({...data,sky:sky1,pty:pty1})



    },[])
   

    return (<div>
    날짜:{data.date}
    시간:{data.time}<br/>
    습도:{data.reh}<br/>
    1시간강수량:{data.rn1}<br/>
    하늘상태:{data.sky
    //- 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
    }<br/>
    온도:{data.t1h}<br/>
    강수형태:{
        data.pty
        // 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7) 
    }<br/>
    풍속:{data.wsd
    }<br/>

    
    </div>)

}
export default Userweatheritem;