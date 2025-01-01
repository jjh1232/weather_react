import React, { useEffect, useState } from "react";
import * as Weatherpa from "./Noticetools/Weatherpar"

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

    
    useEffect(()=>{
                   
          const sky1=Weatherpa.getsky(dates.sky)   
          const pty1=Weatherpa.getpty(dates.pty)      

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