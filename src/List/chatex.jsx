import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
import Chatmenumoda from "../UI/Modals/Chatmenumoda";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
   
    height: 100%;
    width:100%;
   
`

const Header=styled.div`
    display: flex;
    position: relative;
    top: 1px;
  
`
const Main=styled.div`
  width: 100%;
  height: 495px;
  overflow: auto;
 

`
const Roomnamecss=styled.div`
     
     text-align: center;
     max-width:200px;
    text-overflow: ellipsis;
    white-space: nowrap; 
    overflow: hidden;
`

const Datediv=styled.div`
 

`
const Datecss=styled.div`
    
    display: flex;
    align-items: center; /* 세로 가운데 정렬 */
    text-align: center;
    &::before{
        content: "";
        margin-right: 0.5em;
        width: 30%;
        border-bottom: 1px solid gray;
    }
    &::after{
        content: "";
        
        border-bottom: 1px solid gray;
       width: 30%;
      
    }
`
 const Datetext=styled.div`
    max-width: 60%;
    background-color: gray;
    border-radius: 10px;
    padding: 1px 5px;
    margin-top:5px;
    margin-bottom: 5px;
 `
const Chatdiv = styled.div`
   display: flex;
   overflow-x:hidden;
  
`

const Mychat=styled.div`
    display: flex;
   flex-direction: row-reverse ;//오른쪽으로 시작하게
   margin-top:5px;
    margin-left:auto;//이것만오른쪽이되네
    max-width: 85%;
   
`
const Anotherchat=styled.div`
      
      display: flex;
      margin-top:5px;
      max-width: 85%;
    
`
const Systemchat=styled.div`
display: flex;
align-items: center; /* 세로 가운데 정렬 */
  text-align: center;
width: 100%;
font-size:10px;



&::before{
        content: "";
        margin-right: 0.5em;
        
        width: 20%;
        border-bottom: 1px solid gray;
    }
    &::after{
        content: "";
        
        border-bottom: 1px solid gray;
        width: 20%;
        
        margin-left:0.5em;
    }
`
const Systemtext=styled.div`
     background-color: gray;
    border-radius: 10px;
    padding: 1px 5px;
    margin-top:5px;
    margin-bottom: 5px;
 max-width: 85%;
`
const Profilecss=styled.div`
    position  :relative ;
    width: 40px;
    min-height: 20px;
    margin: 3px;


`
const Profile = styled.img`
    position: relative;
    border:1px solid black;
    background-color: white;
    width: 40px;
    height: 40px;
    display: ${props=>props.isprev?"none":""};

    
`
const ChatContainer = styled.div`
    position: relative;
    
    flex-direction: column;
    max-width: 130px;
    display: flex;
    
`
const ChatTop = styled.div`
   
    max-width: 130px;
    text-align: ${props=>props.isme?"right":"left"};
    display: ${props=>props.isprev?"none":""};
`
const ChatMain = styled.div`
    
    max-width: 130px;
     text-align: ${props=>props.isme?"right":"left"};
     
     background-color: ${props=>props.isme?"yellow":"white"};
     border-radius: 10px;
     padding: 3px 6px;//y축 x축순
     justify-content: center;
     //margin-bottom: 10px; 아래쪽마진
`
const Chatbottom = styled.div`
    display: flex;
    flex-direction: column-reverse;
    
    text-align: ${props=>props.isme?"left":"right"};
    align-items: flex-end;
    font-size:12px;
    width:30px;

`

const Senddiv=styled.div`
    border: 1px solid blue;
    background-color: black;
     
`
const Sendinput=styled.input`
     width: 75% ;
     margin: 2px;
     
`
const SendButton=styled.button`
    
`
//채팅보내기시 리렌더링시 아래로안내려가는문제가..
function Chatex(props) {

    //const [loginuser,Setloginuser,removeloginuser]=useCookies(['userinfo'])
    const { roomid, setcontent } = props;
    const [message, Setmessage] = useState();
    const [loginuser, setLoginuser, removeLoginuser] = useCookies();
    

    const queryclient = useQueryClient()
    const axiosinstance = CreateAxios();
    const navigate = useNavigate();
    const [menuopen, setMenuopen] = useState(false);
    //스크롤 감지 로 채팅데이터를 뒤에서 가져오자
    const [scroll, setScroll] = useState(false);
    const scrollref = useRef();
    const menuref = useRef();

    //채팅 나누기관리
    const [monthchat, setMonthchat] = useState();
    const client = useRef(null);


    const [chatroomdata, setChatroomdata] = useState();


    //const username=loginuser.userinfo[`nickname`]
    const door = new SockJS("http://localhost:8081/open/stomp")//인증안하게설정해둬야할듯..방법이없다

    //스크롤 관련
    const handleScroll = () => {
        //스크롤이 올라가면 하자
        if (window.scrollY <= 50) {
            console.log("스크롤올라감다음페이지!")
        }
        else {
            console.log("ㄱㅊ")
        }


    }
    //웹소캣연결
    const con = () => {
        console.log("스톰프연결전")
        client.current = Stomp.over(door, {


        });
        console.log("스톰프오버이후")

        client.current.connect({  //코넥트함수(헤더,연결후행동,에러시행동,종료시행동)헤더에서하자
            //유효성검증을위한 헤더 
            //이거 인터셉터에서 거르는 로직해야하는데 잘모르겟네 여기선안들어가고over에넣어야들어감
            Authorization: "Bearer " + loginuser.Acesstoken,
            Refreshtoken: "Bearer " + loginuser.Refreshtoken

        }, function () {//연결시 할행동
            console.log("연결")

            client.current.subscribe("/sub/channel/" + roomid,
                function (response) {//메세지콜백
                    console.log("응답:" + response.body)

                    const res = JSON.parse(response.body)
                    console.log("json파싱" + res) //json으로오기떄문에  자바스크립트로 변환해줘야한다!
                    //이거날자구분떄매변경
                    //const test=makeSection(res);
                    console.log("챗데이터구조:" + JSON.stringify(chatdata))

                    //여기서다셋도하기때문에 필요없다
                    liveSection(res);

                    

                  


                    scrollcontroller();
                },
                { //유효성검증헤더넣을수있다네?

                })
        })

        client.current.onmessage = (event) => {
            console.log("온메세지:" + event.body)
        }

    }

    const disconect = () => {
        console.log("디스코넥트")
        if (client.current) {
            client.current.deactivate();

        }
    }
    useEffect(() => {

      //  con()
        //chatroomdataget()
        return () => disconect();
    }, [])


    //스크롤감지
    useEffect(() => {
        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    })

    const scrollcontroller = () => {
        scrollref.current.scrollIntoView({ behavior: "smooth" });
    }


    const sendmessage = () => {

        console.log("챗보내기")
        //스톰프는 역직렬화 JSON.stringify 를 해야한다고함 근데문자열은생략가능하다는디
        const data={
            sender:{
                 email:loginuser.userinfo["username"],
                 nickname:loginuser.userinfo["nickname"],
                 profileurl:loginuser.userinfo["profileimg"]
                }
            ,
            message:message,
            messageType:"chat"
        }
        client.current.publish({
            destination: `/pub/channel/${roomid}`,//1
            body: JSON.stringify(
                data
            )
        })

        //보내고 챗리셋해야할듯?
       

        Setmessage("")

    }


    //챗룸기존데이터가져오기
    const [chatdata, setChatdata] = useState();
    const [roomdata,setRoomdata]=useState();
    const {data,isLoading,error}=useQuery({
        queryKey:["chatdata"],
        queryFn:async ()=>{
            console.log("쿼리실행")
            const res=await axiosinstance.get("/chatroomdataget?roomid=" + roomid)
           
            return res.data
        },
        select:(data)=>{
            
            const {chatdata,...roomdatawithoutchat}=data;
           return {
            chatdata:makeSection(chatdata),
            roomdata:roomdatawithoutchat
           }
        }   
        
    })
    //유즈이펙트쓰래 
    useEffect(()=>{
        if(data){ //데이터가 처음에없어서 에러난다 
            setChatdata(data.chatdata)
            setRoomdata(data.roomdata)
        }
    },[data])
   /*
    const chatroomdataget = () => {
        console.log("챗데이터불러오기1")
        axiosinstance.get("/chatroomdataget?roomid=" + roomid)//2
            .then((data) => {

                setChatroomdata(data.data.roomdata)
                setChatdata(makeSection(data.data.beforechat))
                console.log("실행완료")
                scrollcontroller();
            }).catch((err) => {
                console.log("에러" + err)
            })
    }
            */
    //섹션으로 날짜나누기
        //따로 이펙트만들어줬음..
        useEffect(() => {
            scrollcontroller();
        }, [chatdata])
    
    const makeSection = (chatdata) => {
        let chatmonth = {}
        console.log("메이크섹션시작:" + chatdata)
        chatdata.map((chat) => {

            let monthDate = chat.red.substr(0, 10)
            console.log("날짜" + monthDate)
            if (Array.isArray(chatmonth[monthDate])) {
                chatmonth[monthDate].push(chat)
            } else {
                chatmonth[monthDate] = [chat]
            }

        })
        return chatmonth;
    }
    //받는챗은또다르게 세팅해야할듯
    const liveSection = (chat) => {
       
        console.log("단일채팅:"+chat.red)
        let monthDate = chat.red.substr(0, 10).replaceAll(".", "-")
        //왠진몰라도.으로들어옴;
       
        console.log("수정후날짜:"+monthDate)
        setChatdata(prev=>{
            
            const newMessagesdate={...prev}
            console.log("이전:"+JSON.stringify(newMessagesdate))
            if (!Array.isArray(prev[monthDate])) {
                console.log("없는날짜라배열생성날짜이다")
                
                newMessagesdate[monthDate]=[];
                
             } 
             newMessagesdate[monthDate]=[...newMessagesdate[monthDate],chat] 
             
             return newMessagesdate
        })
       
       


        // Object.entries(chatdata).map(([date,chats])=>{}


    }

    //메뉴선택 닫기 

    useEffect(() => {
        document.addEventListener("mousedown", menuclose)

        return () => {
            document.removeEventListener("mousedown", menuclose)
        }

    })


    const menuclose = (e) => {
        console.log("클릭이벤트:" + e.target.className)

        const String="chatroommenu"
        //menuref.current.className
        if (menuopen && !(e.target.className.includes("chatroommenu"))) {
            console.log("ref지정" + e.target.className)
            console.log("다른곳클릭")
            setMenuopen(false)
        }
            
       
    }
  

    //뒤로가기
    const backpage = () => {
        console.log("실행")
        setcontent("chatroomlist")
    }

    //이전처리용
    let prevname=null;
    const prevhandler=(writer)=>{
        prevname=writer
    }
    return (
        <>
            <Wrapper>



                {/*상단의 메뉴버튼 */}


                <Header >
                    
                    <FontAwesomeIcon icon={faArrowLeft} size="xl" onClick={backpage}
                    style={{paddingLeft:"3px",paddingRight:"3px", marginRight:"auto"}}
                    ></FontAwesomeIcon>
                    <Roomnamecss>
                    {roomdata && roomdata.roomname}
                    </Roomnamecss>
                    ({roomdata && roomdata.memberlist.length})

                    
                    <FontAwesomeIcon icon={faBars} size="xl" style={{ float: "right", 
                    paddingRight:"3px", marginLeft:"auto"}}
                        onClick={() => {
                            setMenuopen(true)
                        }}/>



                </Header>
                {/*메뉴누르고난다음 */}

                {menuopen && <Chatmenumoda ref={menuref} roomdata={roomdata}
                     />}

                {/* 챗데이터 내용 div */}
                
                <Main >
                    {chatdata &&
                        Object.entries(chatdata).map(([date, chats]) => {

                            return (

                                <Datediv key={date} >

                                    <Datecss>
                                        <Datetext>{date}</Datetext>
                                        {prevhandler("")}
                                        </Datecss>

                                    {chats.map((data) => {

                                        return (
                                            <Chatdiv >
                                                
                                                {data.messagetype==="System"?<Systemchat>
                                                    
                                                    <Systemtext>{data.message}</Systemtext>
                                                    {prevhandler(data.sender.email)}

                                                </Systemchat>:
                                                <>
                                                
                                                {loginuser.userinfo["username"] === data.sender.email
                                                    ?
                                                    <Mychat>
                                                        <Profilecss>
                                                        <Profile src={process.env.PUBLIC_URL + "/userprofileimg" + data.sender.profileurl}
                                                                isprev={prevname===data.sender.email?true:false}
                                                        />
                                                        </Profilecss>
                                                        <ChatContainer>
                                                            <ChatTop isme 
                                                            isprev={prevname===data.sender.email?true:false}>{data.sender.nickname}</ChatTop>
                                                            <ChatMain isme >
                                                            
                                                                {data.message}
                                                             </ChatMain>
                                                           

                                                        </ChatContainer>
                                                        <Chatbottom>
                                                       
                                                        
                                                        <div style={{width:"100%"}}>  {data.red.substr(11, 5)}</div>
                                                            {12<data.red.substr(11, 2)?<div style={{textAlign:"center",width:"100%"}}>pm</div>:<div style={{textAlign:"center",width:"100%"}}>am</div>}
                                                            </Chatbottom>
                                                    </Mychat>
                                                    :
                                                    <Anotherchat>
                                                         <Profilecss>
                                                        <Profile src={process.env.PUBLIC_URL + "/userprofileimg" + data.sender.profileurl} 
                                                        isprev={prevname===data.sender.email?true:false}/>
                                                        </Profilecss>
                                                        <ChatContainer>
                                                            <ChatTop
                                                            isprev={prevname===data.sender.email?true:false}
                                                            >{data.sender.nickname}</ChatTop>
                                                            <ChatMain>{data.message}

                                                            

                                                            </ChatMain>
                                                            
                                                        </ChatContainer>
                                                        <Chatbottom>
                                                        
                                                            
                                                            <div style={{width:"100%"}}>  {data.red.substr(11, 5)}</div>
                                                            {12<data.red.substr(11, 2)?<div style={{textAlign:"center",width:"100%"}}>pm</div>:<div style={{textAlign:"center",width:"100%"}}>am</div>}
                                                            </Chatbottom>
                                                    </Anotherchat>
                                                
                                                }
                                                     {prevhandler(data.sender.email)}    
                                            </>
                                            }
                                            </Chatdiv>
                                       
                                        )

                                    })

                                    }
                                    
                                </Datediv>

                            )

                        })}

                    {//아래로 내리기위한 div태그
                    }

                    <div ref={scrollref}></div>


                    {/*내용div */}

                </Main>
                <Senddiv>
                    <Sendinput type="text"  value={message} onChange={(e) => { Setmessage(e.target.value) }} />
                    <SendButton onClick={() => { sendmessage() }}>보내기</SendButton>
                </Senddiv>



               


            </Wrapper>

        </>
    )



} export default Chatex;