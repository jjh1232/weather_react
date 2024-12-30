import React, { useEffect, useRef,useState } from "react";
import * as StompJs from "@stomp/stompjs"
import SockJS from "sockjs-client";

function Stompalrams(){

    const client=useRef(null)


    const [chat,setChat]=useState();
    const [chatdata,setChatdata]=useState("아직없음!");

    const stompgo=()=>{
        console.log("시작")
      
        //sockjs사용하지 않은버전 sockjs는나중에써보자
    client.current= new StompJs.Client({
        brokerURL:"ws://localhost:8081/open/stomp",
        //Authorization:"accesstoken",
        //Refreshtoken:"refreshtoken",
        //connectHeaders:{
        //    autho:"authheader"
        //},
        
        onConnect:()=>{
            console.log("구독함수시작")
            subcribe();//연결성공시구독하는로직실행
        }
    })
    
    client.current.activate();
    }
        //연결끊김
        const disconnect=()=>{
            console.log("연결끊김")
            client.current.deactivate();
        }
     //구독 구독주소는 보통 유저아이디나 머특정한 기준으로 설정 ㅇㅇ
        const subcribe=()=>{
            console.log("서브스크라이브실행")
        client.current.subscribe("/sub/channel/test1",(data)=>{
            console.log("흠")
            console.log(data)
              console.log(data.body)
            const js=JSON.parse(data.body)
            console.log(js)
            const message=js.chat
            console.log(message)
            console.log("실행아노딤?")
            
            SetChat((chatlist)=>[
                ...chatlist,js
            ])
            
        })
    }

    const sendchat=()=>{
        console.log("챗보내기")
        client.current.publish({
            destination:"/pub/channel/test1",
            body:JSON.stringify({
                sender:"testman",
                channerid:"2",
                data:chat
            })
    })
    }
    useEffect(()=>{
        
    },[])

    return (
        <>
        <div>
            <button onClick={stompgo}>스톰프연결시작</button>
            <br/>
            <div type="text" style={{width:"500px",height:"300px",backgroundColor : "white", border:"3px solid red"}}>
            {chatdata}
            </div>
            <br/>
                <input value={chat} onChange={(e)=>{setChat(e.target.value)}}/>
                <button onClick={sendchat}>확인</button>
                <button onClick={disconnect}>스톰프연결종료</button>
                {chat}
        </div>

        </>
    )

}

export default Stompalrams;