import { EventSourcePolyfill } from "event-source-polyfill";
import React, { Children, createContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import AuthCheck from "../customhook/authCheck";

//1.SseContext 객체생성(전역적으로데이터공유통로역할) 
export const SseContext=createContext(); //대문자로시작 컨텍스트객체이름설정

//2.콘텍스트프로바이더정의 (전역상태공급)
export function SseProvider({children}){

    const [loginuser]=useCookies(['userinfo', 'Acesstoken', 'Refreshtoken']);
    
    const logincheck=AuthCheck();
    //실시간알림수
    const [alarmChatCount,setAlarmChatCount]=useState(0);
    //sse연결상태
    const [isSseConnected,setIsSseConnected]=useState(false);

    //sse인스턴스(재연결,해제위해ref사용)
    const eventSourceRef=useRef(null);
    
    useEffect(()=>{
        //로그인한경우만설정
        if(logincheck){
            console.log("로그인중SSe연결시작")
            const eventSource= new EventSourcePolyfill(
             "http://localhost:8081/ssesub",{
              heartbeatTimeout:60*5*1000,
             headers:{
               Authorization:"Bearer "+loginuser.Acesstoken,
               Refreshtoken:"Bearer "+loginuser.Refreshtoken
             },
             withCredentials:true,
           }
          )
          eventSource.onopen=(res)=>{
                //연결
          }
          eventSource.onmessage=()=>{
            //기본메세지수신
          }
          eventSource.onerror=(err)=>{
            //에러
          }
          //커스텀
          eventSource.addEventListener("connect",(res)=>{
            console.log("커넥트시!")

          })
             eventSource.addEventListener("unreadcount",(res)=>{
              
              //보통 string타입이니까 넘버전환
              setAlarmChatCount(Number(res.data))
          })
          //노티스알람
          eventSource.addEventListener("noticealarm",(res)=>{
            console.log("에미터테스트요!",res)
            console.log("셋전 알람카운트:"+alarmChatCount)
            setAlarmChatCount((prev)=>prev+1);
              console.log("셋후 알람카운트:"+alarmChatCount)

          })//코멘트알람
             eventSource.addEventListener("commentalarm",(res)=>{
            console.log("에미터테스트요!",res)
            console.log("셋전 알람카운트:"+alarmChatCount)
            setAlarmChatCount((prev)=>prev+1);
              console.log("셋후 알람카운트:"+alarmChatCount)

          })

   //컴포넌트언마운트시연결해제
              return ()=>{
            eventSource.close();

          }
        }
       
       
      
    },[logincheck])
    return (
        //provider 하위의 모든컴포넌트에 상태값전달
        <SseContext.Provider value={{alarmChatCount,setAlarmChatCount,
        isSseConnected
        }}>
            {children}
        </SseContext.Provider>
    )

}