import React from "react";


export default function Datefor(props){
    const {inputdate}=props;

    //현재시각
    let currentdate=new Date();
    let result;
    //받은데이터포맷...애시당초에 백에서 포맷안하는게나은듯
    //자바스크립트는 yyyy-MM-dd tt:mm:nn을걍넣으면 Date가되네;
    let parseTime=new Date(inputdate)

    //타임스태프를이용하자 근데밀리세컨드라 1000으로나눠야함
    const seconds=Math.floor((currentdate.getTime()-parseTime.getTime()/1000))
   
    if(seconds<60) return `방금전`;

    const minutes= seconds/60;
    if(minutes<60) return `${Math.floor(minutes)}분전`
    
    const hours = minutes / 60;
	if (hours < 24) return `${Math.floor(hours)}시간 전`;

	const days = hours / 24;
	if (days < 7) return `${Math.floor(days)}일 전`;
   
    return (
        <>
         {result}
        </>
    )
}
