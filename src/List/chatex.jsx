import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
import Chatmenumoda from "../UI/Modals/Chatmenumoda";

const Wrapper=styled.div`

`

const Chatdiv=styled.div`
   display: flex;
    border:1px solid red;
`
const Profile=styled.img`
    position: relative;
    border:1px solid blue;
    width: 50px;
    height: 50px;
`
const ChatContainer=styled.div`
    position: relative;
    flex-direction: column;
    width: 100%;
    display: flex;
    border:1px solid blue;
`
const ChatTop=styled.div`
    border:1px solid green;
    width: 100%;
`
const ChatMain=styled.div`
     border:1px solid yellow;
     width:100%;
`
const Chatbottom=styled.div`
    border:1px solid black;
    text-align: right;
    width:100%;
`

//채팅보내기시 리렌더링시 아래로안내려가는문제가..
function Chatex(props){
    
    //const [loginuser,Setloginuser,removeloginuser]=useCookies(['userinfo'])
    const {roomid,setcontent}=props;
    const [message,Setmessage]=useState();
    const [loginuser,setLoginuser,removeLoginuser]=useCookies();
    const [chatdata,setChatdata]=useState();

    const axiosinstance=CreateAxios();
    const navigate=useNavigate();
    const [menuopen,setMenuopen]=useState(false);
    //스크롤 감지 로 채팅데이터를 뒤에서 가져오자
    const [scroll,setScroll]=useState(false);
    const scrollref=useRef();
    const menuref=useRef();

    //채팅 나누기관리
    const [monthchat,setMonthchat]=useState();
    const client=useRef(null);
    

    const [chatroomdata,setChatroomdata]=useState();

    
    //const username=loginuser.userinfo[`nickname`]
    const door=new SockJS("http://localhost:8081/open/stomp")//인증안하게설정해둬야할듯..방법이없다
    
    //스크롤 관련
    const handleScroll=()=>{
        //스크롤이 올라가면 하자
        if(window.scrollY<=50 ){
            console.log("스크롤올라감다음페이지!")
        }
        else{
            console.log("ㄱㅊ")
        }


    }
    //웹소캣연결
    const con=()=>{
    console.log("스톰프연결전")
    client.current=Stomp.over(door,{
       

    });
    console.log("스톰프오버이후")

    client.current.connect({  //코넥트함수(헤더,연결후행동,에러시행동,종료시행동)헤더에서하자
        //유효성검증을위한 헤더 
        //이거 인터셉터에서 거르는 로직해야하는데 잘모르겟네 여기선안들어가고over에넣어야들어감
        Authorization:"Bearer "+loginuser.Acesstoken,
        Refreshtoken:"Bearer "+loginuser.Refreshtoken
       
    },function(){//연결시 할행동
        console.log("연결")

        client.current.subscribe("/sub/channel/"+roomid,
        function(response){//메세지콜백
            console.log("응답:"+response.body)
          
           const res=JSON.parse(response.body)
           console.log("json파싱"+res) //json으로오기떄문에  자바스크립트로 변환해줘야한다!
           //이거날자구분떄매변경
          //const test=makeSection(res);
          console.log("챗데이터구조:"+JSON.stringify(chatdata))
         
            const newchat=liveSection(res);
            setChatdata(newchat);
            
         
            scrollcontroller();
        },
        { //유효성검증헤더넣을수있다네?
                                
        })
    })

    client.current.onmessage=(event)=>{
        console.log("온메세지:"+event.body)
    }
   
    }

   const disconect=()=>{
    console.log("디스코넥트")
    if(client.current){
        client.current.deactivate();
        
    }
   }
   useEffect(()=>{
    
    con()
    chatroomdataget()
    return ()=>disconect();
},[])

//따로 이펙트만들어줬음..
   useEffect(()=>{
    scrollcontroller();
   },[chatdata])

   //스크롤감지
   useEffect(()=>{
    window.addEventListener("scroll",handleScroll)

    return ()=>window.removeEventListener("scroll",handleScroll)
   })

    const scrollcontroller=()=>{
        scrollref.current.scrollIntoView({behavior:"smooth"});
    }
      

    const sendmessage=()=>{
       
            console.log("챗보내기")
            client.current.publish({
                destination:`/pub/channel/${chatroomdata.roomid}`,//1
                body:JSON.stringify({
                    username:loginuser.userinfo["username"],
                    sender:loginuser.userinfo["nickname"],
                    messageType:"chat",
                    message:message
                })
        })
        
        //보내고 챗리셋해야할듯?
           
        Setmessage("")
        
    }

    //챗룸기존데이터가져오기
    const chatroomdataget=()=>{
        console.log("챗데이터불러오기1")
        axiosinstance.get("/chatroomdataget?roomid="+roomid)//2
        .then((data)=>{
              
                setChatroomdata(data.data.roomdata)
                setChatdata(makeSection(data.data.beforechat))
                console.log("실행완료")
             scrollcontroller();
        }).catch((err)=>{
            console.log("에러"+err)
        })
    }
      //섹션으로 날짜나누기
      const makeSection=(chatdata)=>{
        let chatmonth={}
        console.log("챗데이터"+chatdata)
        chatdata.map((chat)=>{
            
            let monthDate=chat.red.substr(0,10)
            console.log("날짜"+monthDate)
            if(Array.isArray(chatmonth[monthDate])){
                chatmonth[monthDate].push(chat)
            }else{
                chatmonth[monthDate]=[chat]
            }
            
        })
        return chatmonth;
    }
    //받는챗은또다르게 세팅해야할듯
    const liveSection=(chat)=>{
        const beforchat=chatdata;
        let monthDate=chat.red.substr(0,10).replaceAll(".","-")
        //왠진몰라도.으로들어옴;
               
            if(Array.isArray(beforchat[monthDate])){
                console.log("해당날짜의객체 임")
                beforchat[monthDate].push(chat)
                
            }else{
                console.log("해당날짜의객체가 없습니다")
                beforchat[monthDate]=[chat]
            }
        return beforchat;
        
      
       // Object.entries(chatdata).map(([date,chats])=>{}
        
        
    }

    //메뉴선택 닫기 
    
    useEffect(()=>{
        document.addEventListener("mousedown",menuclose)

        return ()=>{
            document.removeEventListener("mousedown",menuclose)
        }

    })

    
    const menuclose=(e)=>{
        console.log("클릭이벤트:"+e.target.className)
        
        if(menuopen&&!(menuref.current.className.includes(e.target.className))){
            console.log("ref지정"+menuref.current.className)
            console.log("다른곳클릭")
            setMenuopen(false)
        }
        else{
            
        }
    }
    //넘길함수 
    const userinvite=(roomid,checklist)=>{
        axiosinstance.post("/chatroominvite",{
            roomid: roomid,
            userlist:checklist
        }).then((res)=>{
            console.log(res.data)
            setChatroomdata(res.data)
            
        }).catch((err)=>{
            console.log("에러")
        })
        
    }

    //뒤로가기
    const backpage=()=>{
        console.log("실행")
        setcontent("chatroomlist")
    }
   
    return(
        <>
        <div>


                  
        {/*상단의 메뉴버튼 */}
                     
          
           <div style={{height:"30px",border:"1px solid",top:"5px",position:"relative"}}>
           <button onClick={backpage}>뒤로가기</button>
            {chatroomdata&&chatroomdata.roomname}
            {chatroomdata&&chatroomdata.namelist.length}

            <button style={{float:"right"}} 
            onClick={()=>{
                setMenuopen(true)
            }}
            >메뉴버튼</button>
            
            
              
            </div>
            {/*메뉴누르고난다음 */}

            {menuopen&&<Chatmenumoda ref={menuref} roomdata={chatroomdata} 
            invite={userinvite} /> }
           
            {/* 챗데이터 내용 div */}
            <div style={{width:"100%",height:"500px", overflow:"auto",border:"1px solid yellow"}}>
                {chatdata&&
                Object.entries(chatdata).map(([date,chats])=>{
                    
                    return(
                         
                        <div key={date} >
                            
                        <>{date}</>

                        {chats.map((data)=>{
                            return (
                            <Chatdiv >
                                {console.log("렌더링데이터z"+data)}
                              {loginuser.userinfo["nickname"]===data.writer
                        ?
                         <> 
                        
                        <Profile src={process.env.PUBLIC_URL+"/userprofileimg"+data.userprofile}/>
                        <ChatContainer>
                            <ChatTop>{data.writer}</ChatTop>
                            <ChatMain>{data.message}</ChatMain>
                            <Chatbottom> {data.red.substr(11,5)}</Chatbottom>
                            
                        </ChatContainer>
                         </>
                        :
                        <> 
                        <Profile src={process.env.PUBLIC_URL+"/userprofileimg"+data.userprofile}/>
                        <ChatContainer>
                        <ChatTop>{data.writer}</ChatTop>
                            <ChatMain>{data.message}</ChatMain>
                            <Chatbottom> {data.red.substr(11,5)}</Chatbottom>
                        </ChatContainer>
                        </>
                        }  
                        
                            </Chatdiv>
                            )

                        })
                       
                    }
                        </div>
                
                    )

                })}
     
                  {//아래로 내리기위한 div태그
            }
            
            <div ref={scrollref}></div>
            
              
             {/*내용div */}   
          
            </div>
            <div style={{background:"green", position:"sticky"}}>
            <input type="text" style={{width:"75%"}}value={message} onChange={(e)=>{Setmessage(e.target.value)}}/>
            <button onClick={()=>{sendmessage()}}>보내기</button>
            </div> 
           
           
            
            <br/>
            

        </div>
        
        </>
    )



}export default Chatex;