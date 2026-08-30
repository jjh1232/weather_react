import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateAxios from "../customhook/CreateAxios";
import styled, { keyframes } from "styled-components";
import Chatmenumoda from "../UI/Modals/Chatmenumoda";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faRotateRight, faComments } from "@fortawesome/free-solid-svg-icons";
import profileimage from "../UI/profileimage";
import { API_BASE } from "../config/api";
/* ─────────────────────────────────────────────────────────────
   채팅 스타일.
   예전엔 gray / white / yellow / black 을 그대로 박아서, 다크모드가 되면
   회색 배경 위에 밝은 글씨, 흰 말풍선 위에 흰 글씨가 되어 거의 안 보였다.
   전부 theme 토큰으로 바꾸고 글자색을 배경과 짝지어 지정한다.
   ───────────────────────────────────────────────────────────── */

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width:100%;
    min-height: 0;
    color: ${(props)=>props.theme.text};
`

const Header=styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    padding: 8px 10px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
    color: ${(props)=>props.theme.text};
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.02em;
`
const Main=styled.div`
  flex: 1;
  min-height: 0;          /* 예전엔 height:495px 고정이라 창 크기를 안 따라갔다 */
  width: 100%;
  padding: 6px 10px;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${(props)=>props.theme.surface};
`
const Roomnamecss=styled.div`
     text-align: center;
     max-width:170px;
    text-overflow: ellipsis;
    white-space: nowrap; 
    overflow: hidden;
`

const Datediv=styled.div`
 

`
/* 날짜 구분선 - 양옆 실선은 흐리게, 가운데 알약만 읽히게 */
const Datecss=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    &::before,&::after{
        content: "";
        flex: 1;
        border-bottom: 1px solid ${(props)=>props.theme.border};
    }
`
 const Datetext=styled.div`
    flex-shrink: 0;
    max-width: 60%;
    background-color: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.theme.border};
    color: ${(props)=>props.theme.textMuted};
    font-size: 11.5px;
    font-weight: 600;
    border-radius: ${(props)=>props.theme.radiusPill};
    padding: 2px 10px;
    margin: 8px 0;
 `
const Chatdiv = styled.div`
   display: flex;
   overflow-x:hidden;
`

const Mychat=styled.div`
    display: flex;
   flex-direction: row-reverse ;//오른쪽으로 시작하게
   align-items: flex-end;
   gap: 4px;
   margin-top:6px;
    margin-left:auto;//이것만오른쪽이되네
    max-width: 85%;
`
const Anotherchat=styled.div`
      display: flex;
      align-items: flex-end;
      gap: 4px;
      margin-top:6px;
      max-width: 85%;
`
/* 입장/퇴장 안내 */
const Systemchat=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    width: 100%;
    font-size:10px;

    &::before,&::after{
        content: "";
        flex: 1;
        border-bottom: 1px solid ${(props)=>props.theme.border};
    }
`
const Systemtext=styled.div`
    flex-shrink: 0;
    background-color: ${(props)=>props.theme.surfaceHover};
    color: ${(props)=>props.theme.textFaint};
    font-size: 11px;
    border-radius: ${(props)=>props.theme.radiusPill};
    padding: 2px 10px;
    margin: 6px 0;
    max-width: 85%;
 `
const Profilecss=styled.div`
    position  :relative ;
    width: 32px;
    flex-shrink: 0;
    min-height: 20px;
    margin: 0 2px;
`
const Profile = styled.img`
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border:1px solid ${(props)=>props.theme.border};
    background-color: ${(props)=>props.theme.surfaceAlt};
    display: ${props=>props.isprev?"none":""};
`
const ChatContainer = styled.div`
    position: relative;
    flex-direction: column;
    max-width: 150px;
    min-width: 0;
    display: flex;
    gap: 2px;
`
const ChatTop = styled.div`
    max-width: 150px;
    font-size: 11.5px;
    color: ${(props)=>props.theme.textMuted};
    text-align: ${props=>props.isme?"right":"left"};
    display: ${props=>props.isprev?"none":""};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
/* 말풍선. 내 말풍선은 accent, 상대는 눌린 면 */
const ChatMain = styled.div`
    max-width: 150px;
    font-size: 13px;
    line-height: 1.45;
    text-align: left;
    word-break: break-word;
    white-space: pre-wrap;

    background-color: ${props=>props.isme?props.theme.accent:props.theme.surfaceAlt};
    color: ${props=>props.isme?"#fff":props.theme.text};
    border: 1px solid ${props=>props.isme?"transparent":props.theme.border};

    border-radius: 14px;
    /* 말꼬리 쪽만 각을 죽여 방향이 보이게 */
    border-${props=>props.isme?"bottom-right":"bottom-left"}-radius: 4px;
    padding: 6px 10px;
    justify-content: center;
`
const Chatbottom = styled.div`
    display: flex;
    flex-direction: column-reverse;
    text-align: ${props=>props.isme?"left":"right"};
    align-items: flex-end;
    font-size:10.5px;
    color: ${(props)=>props.theme.textFaint};
    width:30px;
    flex-shrink: 0;
`

const Senddiv=styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    padding: 8px;
    border-top: 1px solid ${(props)=>props.theme.border};
    background-color: ${(props)=>props.theme.surfaceAlt};
`
const Sendinput=styled.input`
     flex: 1;
     min-width: 0;
     height: 32px;
     padding: 0 12px;
     border: 1px solid ${(props)=>props.theme.border};
     border-radius: ${(props)=>props.theme.radiusPill};
     background: ${(props)=>props.theme.surface};
     color: ${(props)=>props.theme.text};
     font-size: 13px;
     outline: none;
     transition: border-color ${(props)=>props.theme.transition},
                 box-shadow ${(props)=>props.theme.transition};

     &::placeholder{ color: ${(props)=>props.theme.textFaint}; }
     &:focus{
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
     }
`
//"여기까지읽었음" - 하드코딩 #999 라 다크모드에서 묻혔다
const Unreaddivider=styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 12px 0;
    font-size: 11px;
    font-weight: 600;
    color: ${(props)=>props.theme.accent};

    &::before,&::after{
        content: "";
        flex: 1;
        border-bottom: 1px solid ${(props)=>props.theme.accentSoft};
    }
`
const Membercount=styled.span`
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 600;
    color: ${(props)=>props.theme.textFaint};
`
//헤더의 뒤로가기/메뉴 아이콘
const Headericon=styled.div`
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    cursor: pointer;
    color: ${(props)=>props.theme.textMuted};
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
`
const SendButton=styled.button`
    flex-shrink: 0;
    height: 32px;
    padding: 0 14px;
    border: none;
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.accent};
    color: #fff;
    font-size: 13px;
    font-weight: 650;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                opacity ${(props)=>props.theme.transition};

    &:hover:not(:disabled){ background: ${(props)=>props.theme.accentHover}; }
    &:disabled{ opacity: .45; cursor: not-allowed; }
`
/* ─────────────────────────────────────────────────────────────
   로딩 / 에러 상태.
   예전엔 "방 정보로딩중", "채팅로딩중..." 이라는 맨 글자만 띄웠다.
   실패해도 그 글자 그대로라 멈춘 건지 로딩 중인지 구분이 안 됐다.
   - 로딩: 헤더/말풍선 모양을 그대로 흉내낸 스켈레톤
   - 실패: 사유와 다시시도 버튼
   ───────────────────────────────────────────────────────────── */
const shimmer=keyframes`
    0%   { background-position: -160px 0; }
    100% { background-position: 160px 0; }
`
const Skeleton=styled.div`
    border-radius: ${(props)=>props.round?"50%":props.theme.radiusSm};
    width: ${(props)=>props.w||"100%"};
    height: ${(props)=>props.h||"12px"};
    flex-shrink: 0;
    background-color: ${(props)=>props.theme.surfaceHover};
    background-image: linear-gradient(
        90deg,
        transparent 0%,
        ${(props)=>props.theme.mode==="dark"
            ? "rgba(255,255,255,0.07)"
            : "rgba(255,255,255,0.85)"} 50%,
        transparent 100%
    );
    background-size: 160px 100%;
    background-repeat: no-repeat;
    animation: ${shimmer} 1.15s ${(props)=>props.theme.ease} infinite;
`
//헤더 자리를 그대로 차지하는 스켈레톤(로딩 중에 레이아웃이 안 튄다)
const HeaderSkeleton=styled(Header)`
    gap: 8px;
`
//말풍선 스켈레톤 한 줄
const BubbleSkeletonRow=styled.div`
    display: flex;
    flex-direction: ${(props)=>props.isme?"row-reverse":"row"};
    align-items: flex-end;
    gap: 6px;
    margin-top: 10px;
`
//에러/빈 상태 공통 박스
const Statebox=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 100%;
    padding: 24px 18px;
    text-align: center;
    color: ${(props)=>props.theme.textMuted};
    font-size: 13px;
    line-height: 1.6;
    /* 서버 예외 이름이 길어도 폰 화면 밖으로 안 밀리게 */
    word-break: break-word;
    overflow-wrap: anywhere;
    user-select: text;
`
const Stateicon=styled.div`
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: ${(props)=>props.theme.accentSoft};
    color: ${(props)=>props.theme.accent};
    font-size: 16px;
`
const Statetitle=styled.div`
    color: ${(props)=>props.theme.text};
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.02em;
`
const Retrybutton=styled.button`
    margin-top: 2px;
    height: 32px;
    padding: 0 16px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    font-size: 12.5px;
    font-weight: 650;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.accentSoft};
        border-color: ${(props)=>props.theme.accent};
        color: ${(props)=>props.theme.accent};
    }
`

/* ─────────────────────────────────────────────────────────────
   ★ makeSection 과 select 는 반드시 모듈 스코프에 있어야 한다.

   예전엔 둘 다 Chatex 함수 "안"에 있었다. 그런데 select 는 캐시에 데이터가
   있으면 useQuery(...) 를 부르는 그 순간(=렌더 도중) 동기로 실행된다.
   그 시점은 아래쪽의 `const makeSection = ...` 줄이 아직 실행되기 전이라
   ReferenceError: Cannot access 'makeSection' before initialization
   이 나고, react-query 는 그걸 쿼리 에러로 잡아 "대화를 불러오지 못했어요" 가 됐다.
   방에 처음 들어갈 땐 캐시가 없어서 select 가 렌더 이후에 돌기 때문에 멀쩡했고,
   나갔다 다시 들어올 때만 터져서 재현이 들쭉날쭉했다.

   모듈 스코프로 빼면 TDZ 가 사라지고, 함수 참조도 매 렌더 동일해져서
   react-query 가 select 결과를 재사용한다.
   ───────────────────────────────────────────────────────────── */
const makeSection = (chatdata) => {
    if(!Array.isArray(chatdata)){
        console.log("[chat] makeSection: 배열이 아님", chatdata)
        return {};
    }
    const chatmonth = {}
    chatdata.forEach((chat) => {
        /* red 가 없거나 문자열이 아닌 행이 하나만 껴 있어도 여기서 터지면
           select 예외 = 쿼리 에러라서 멀쩡한 나머지 대화까지 다 날아간다.
           live 쪽(liveSection)은 "." 를 "-" 로 바꾸는데 여기는 안 바꿔서
           같은 날짜가 두 섹션으로 갈라지던 것도 같이 맞춘다. */
        const red = typeof chat?.red === "string" ? chat.red : "";
        const monthDate = red ? red.substr(0, 10).replaceAll(".", "-") : "날짜없음";

        if (Array.isArray(chatmonth[monthDate])) {
            chatmonth[monthDate].push(chat)
        } else {
            chatmonth[monthDate] = [chat]
        }
    })
    console.log("[chat] makeSection 결과: 섹션",Object.keys(chatmonth).length,"개",
        Object.entries(chatmonth).map(([d,c])=>`${d}:${c.length}건`).join(", "))
    return chatmonth;
}

const selectchat = (data) => {
    console.log("[chat] select 입력: chatdates",
        Array.isArray(data?.chatdates) ? data.chatdates.length+"건" : data?.chatdates,
        "/ lastreadchatid", data?.lastreadchatid)
    return {
        chatList: makeSection(data?.chatdates),
        lastchatid: data?.lastreadchatid
    }
}

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
    
    const scrollref = useRef();
    const menuref = useRef();

    //채팅 나누기관리
    
    const client = useRef(null);


    


    //const username=loginuser.userinfo[`nickname`]
    /* 예전엔 여기(컴포넌트 본문)에서 바로 new SockJS 를 했다.
       본문은 렌더링마다 다시 실행되므로 채팅 한 줄 올 때마다, 메뉴 열 때마다
       새 소켓이 하나씩 더 열리고 아무도 안 닫았다.
       브라우저는 한 오리진에 동시 연결 수가 정해져 있어서 이게 쌓이면
       그 뒤 axios 요청이 큐에 걸린 채 영영 안 돌아온다.
       소켓은 실제로 연결할 때(con) 한 번만 만든다. */
    const socketref = useRef(null);

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
        //이미 붙어있으면 또 만들지 않는다
        if (client.current) return;

        const door = new SockJS(`${API_BASE}/open/stomp`)//인증안하게설정해둬야할듯..방법이없다
        socketref.current = door;

        const stomp = Stomp.over(door, {


        });
        client.current = stomp;
        //콘솔이 STOMP 프레임으로 도배돼서 진짜 로그가 안 보였다
        stomp.debug = () => {};
        console.log("스톰프오버이후")

        stomp.connect({  //코넥트함수(헤더,연결후행동,에러시행동,종료시행동)헤더에서하자
            //유효성검증을위한 헤더 
            //이거 인터셉터에서 거르는 로직해야하는데 잘모르겟네 여기선안들어가고over에넣어야들어감
            Authorization: "Bearer " + loginuser.Acesstoken,
            Refreshtoken: "Bearer " + loginuser.Refreshtoken,
            roomid:roomid

        }, function () {//연결시 할행동
            console.log("연결")
            //정리(disconect)가 먼저 돌면 client.current 가 null 이라 여기서 터진다.
            //지역 변수 stomp 를 쓰고, 이미 정리된 연결이면 그냥 빠진다.
            if (client.current !== stomp) return;

            stomp.subscribe("/sub/channel/" + roomid,
                function (response) {//메세지콜백
                    console.log("응답:" , response.body)

                    const res = JSON.parse(response.body)
                    console.log("json파싱" , res) //json으로오기떄문에  자바스크립트로 변환해줘야한다!
                    //이거날자구분떄매변경
                    //const test=makeSection(res);
                   // console.log("챗데이터구조:" + JSON.stringify(chatdata))

                    //여기서다셋도하기때문에 필요없다
                    liveSection(res);              
                  // scrollcontroller();
                    //읽음처리
                    
                    stomp.send("/pub/read",{},JSON.stringify({
                        roomid:res.roomid,
                        messageid:res.chatid
                    }))
                        
                },
                { //유효성검증헤더넣을수있다네?

                })
        })

        stomp.onmessage = (event) => {
            console.log("온메세지:" + event.body)
        }

    }

    const disconect = () => {
        console.log("디스코넥트")
        if (client.current) {
            //deactivate 가 실패해도 소켓은 반드시 닫아야 연결이 안 샌다
            try { client.current.deactivate(); } catch (e) { console.log("deactivate 실패", e) }
            client.current = null;
        }
        if (socketref.current) {
            try { socketref.current.close(); } catch (e) { console.log("socket close 실패", e) }
            socketref.current = null;
        }
    }
    //방을 옮기면 구독 대상이 달라지므로 다시 연결한다
    useEffect(() => {
        if (!roomid) return;

       con()

        return () => disconect();
    }, [roomid])


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
        //연결이 끊긴 상태에서 누르면 client.current 가 null 이라 터진다
        if (!client.current) { console.log("연결이 아직 안 됐다"); return; }
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
  
    const {data : roominfo,isLoading:roominfoloading,error:roominfoerror,refetch:roominforefetch}=useQuery({
        queryKey:["roominfo",roomid],
        queryFn:async ()=>{
            console.log("룸정보가져오기시작")
             const res=await axiosinstance.get(`/chatroomdata/info/${roomid}`)
             // console.log("룸인포",res.data)
            return res.data
        },
        //roomid 가 없을 때 /chatroomdata/info/ 로 요청이 나가 계속 실패하던 걸 막는다
        enabled: !!roomid,
    })
     const {data : chatlist,isLoading:chatloading,error:chaterror,refetch:chatrefetch}=useQuery({
        queryKey:["chatlist",roomid],
        queryFn:async ()=>{
                console.log("챗팅가져오기시작")
            try{
              const res=await axiosinstance.get(`/chatroomdata/chatdata/${roomid}`)
              console.log("[chat] 응답 수신 roomid=",roomid,
                  "status=",res.status,
                  "chatdates=",Array.isArray(res.data?.chatdates)?res.data.chatdates.length+"건":res.data?.chatdates,
                  "lastreadchatid=",res.data?.lastreadchatid)
              console.log("[chat] 첫 행 샘플:",res.data?.chatdates?.[0])
              return res.data
            }catch(err){
              /* 왜 실패했는지 화면에도 남기고 콘솔에도 통째로 남긴다.
                 예전엔 그냥 던지기만 해서 "못 불러왔다" 외엔 알 방법이 없었다. */
              console.error("채팅 불러오기 실패", err?.response?.status, err?.response?.data, err)
              const d = err?.response?.data;
              err.uimessage = err?.response
                ? [`서버 응답 ${err.response.status}`,
                   d?.exception, d?.message, d?.error,
                   typeof d==="string" ? d : null]
                  .filter(Boolean).join(" · ")
                : "서버에 연결하지 못했습니다";
              throw err;
            }
        },    
         select: selectchat,
        enabled: !!roomid,
        //기본 3회 재시도라 실패가 눈에 보이기까지 한참 걸린다
        retry: 1,
    })

    //섹션으로 날짜나누기 - makeSection / selectchat 은 파일 위쪽 모듈 스코프에 있다
    //받는챗은또다르게 세팅해야할듯
    const liveSection = (chat) => {
       
        console.log("단일채팅:"+chat.red)
        let monthDate = chat.red.substr(0, 10).replaceAll(".", "-")
        //왠진몰라도.으로들어옴;
       
        console.log("수정후날짜:"+monthDate)
        setChatdata(prev=>{
            
            //아직 기존 대화를 못 받았는데 소켓 메세지가 먼저 오면 prev 가 undefined 다
            const newMessagesdate={...(prev||{})}
            //console.log("이전:"+JSON.stringify(newMessagesdate))
            if (!Array.isArray(newMessagesdate[monthDate])) {
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
        if (!menuopen) return

        //예전엔 e.target.className 만 봤다. 그래서
        //  - 클래스를 안 붙인 자식(아이콘/글자)을 누르면 메뉴가 닫히고
        //  - SVG 는 className 이 문자열이 아니라 SVGAnimatedString 이라
        //    .includes 가 없어서 아이콘을 누르는 순간 TypeError 가 났다.
        //closest 는 조상까지 훑으므로 최상위에만 클래스가 있으면 된다.
        if (!e.target.closest || !e.target.closest(".chatroommenu")) {
            setMenuopen(false)
        }
    }
  /* ★ 로딩이 안 끝나던 원인이 여기 있었다.
     예전 코드: queryclient.removeQueries( ["chatlist", roomid] )   ← 배열로 넘겼다

     react-query v5 부터 removeQueries 는 배열이 아니라 필터 "객체"를 받는다.
     배열을 넘기면 filters.queryKey 가 undefined 라서 키 비교를 건너뛰고
     캐시에 있는 모든 쿼리가 매칭된다 = 캐시 전체 삭제.
     게다가 이 이펙트는 마운트 직후에 돌기 때문에, 바로 위에서 막 시작한
     roominfo / chatlist 요청까지 같이 지워버린다.
     지워진 쿼리는 silent 로 취소돼서 상태 변경을 아예 안 알려주는데,
     옵저버(useQuery)는 그대로 pending + fetching 에 남는다.
     그래서 "방 정보로딩중" / "채팅로딩중..." 이 영원히 끝나지 않았다.

     캐시를 비우려던 원래 의도(이전 방 내용이 남는 문제)는
     방이 바뀔 때 로컬 state 를 초기화하는 걸로 충분하다. */
  //처음 한 번만 "읽은 위치로 이동" 하기 위한 플래그
  const didscrollref=useRef(false)

  //방을 옮기면 "읽은 위치로 이동"을 한 번 더 하게 한다
  useEffect(() => {
    didscrollref.current = false;
  }, [roomid]);

  /* 서버에서 받은 대화를 화면 state 로 옮긴다.
     소켓으로 들어오는 새 채팅은 liveSection 이 여기에 덧붙이므로 state 가 필요하다.

     ★ 여기를 "chatlist 를 넣는 이펙트" 와 "roomid 바뀌면 비우는 이펙트" 로
     나눠 두면 안 된다. 이미 캐시가 있는 방으로 다시 들어오면 첫 커밋에서
     넣는 쪽이 먼저 돌고 비우는 쪽이 나중에 돌아 화면이 빈 채로 남는다.
     그때 chatlist 는 structural sharing 덕에 참조가 그대로라 다시 채워지지도 않는다.
     (요청은 200 으로 잘 오는데 대화만 안 보이던 게 이것) */
  useEffect(() => {
    console.log("[chat] chatdata 세팅 roomid=",roomid,
        "섹션=",chatlist?.chatList?Object.keys(chatlist.chatList).length+"개":chatlist?.chatList,
        "lastchatid=",chatlist?.lastchatid)
    setChatdata(chatlist?.chatList);
  }, [chatlist, roomid]);

//유즈이펙트로 최근에읽은곳가기
    useEffect(()=>{
           
        const lastchatid=chatlist?.lastchatid
       
        if(!lastchatid || !chatdata || didscrollref.current) return;
     setTimeout(()=>{
     
        const target=document.getElementById(`chatmessage_${lastchatid}`);
        if(target){
       
            target.scrollIntoView({behavior:"smooth" , block:"center"})
            didscrollref.current=true; //이후실행안함
         }
        },50)
        
    },[chatdata,chatlist])

    //이건 새채팅나올시 스크롤
        useEffect(() => {
            if(!didscrollref.current) return; //false일시 안함
            scrollcontroller();
        }, [chatdata])
    
    //뒤로가기
    const backpage = () => {
        console.log("실행")
        //v5 필터는 객체다. 배열로 넘기면 이 방 하나가 아니라 캐시 전체가 날아간다.
        queryclient.removeQueries({ queryKey: ["chatlist", roomid], exact: true });
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

            {/* 로딩 중이면 헤더와 같은 모양의 스켈레톤을 깔아 자리를 잡아둔다.
                실패했으면 방 이름 자리에 사유를 적고 뒤로가기는 살려둔다. */}
            {roominfoloading ?(
                <HeaderSkeleton>
                    <Skeleton round w="28px" h="28px"/>
                    <Skeleton w="110px" h="13px" style={{margin:"0 auto"}}/>
                    <Skeleton round w="28px" h="28px"/>
                </HeaderSkeleton>
            )
            : !roominfo ?(
                <Header>
                    <Headericon onClick={backpage} style={{marginRight:"auto"}}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </Headericon>
                    <Roomnamecss style={{color:"inherit",opacity:.7}}>방 정보를 못 불러왔어요</Roomnamecss>
                    <Headericon style={{marginLeft:"auto"}} onClick={()=>roominforefetch()}>
                        <FontAwesomeIcon icon={faRotateRight}/>
                    </Headericon>
                </Header>
            )
            : 
            
                <Header >
                    
                    <Headericon onClick={backpage} style={{marginRight:"auto"}}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </Headericon>

                    <Roomnamecss>
                    {roominfo && roominfo.roomname}
                    </Roomnamecss>
                    <Membercount>{roominfo && roominfo.memberlist.length}</Membercount>

                    <Headericon style={{marginLeft:"auto"}}
                        onClick={() => {
                            setMenuopen(true)
                        }}>
                        <FontAwesomeIcon icon={faBars}/>
                    </Headericon>



                </Header>
            }
                {/*메뉴누르고난다음 */}

                {menuopen && <Chatmenumoda ref={menuref} roomdata={roominfo}
                     setmenuopen={setMenuopen}
                     onexitroom={backpage}
                     />}

                {/* 챗데이터 내용 div */}
                
                <Main >
                    {chatloading?(
                        /* 말풍선 모양 스켈레톤. 실제 대화가 들어올 자리와 같은 리듬이라
                           로드가 끝나도 화면이 튀지 않는다. */
                        <div aria-busy="true" aria-label="채팅을 불러오는 중">
                            <Datecss style={{margin:"8px 0"}}><Skeleton w="84px" h="18px" style={{borderRadius:"999px"}}/></Datecss>
                            {[
                                {me:false,w:"120px",h:"34px"},
                                {me:false,w:"78px", h:"22px"},
                                {me:true, w:"104px",h:"22px"},
                                {me:false,w:"142px",h:"46px"},
                                {me:true, w:"88px", h:"34px"},
                            ].map((row,i)=>(
                                <BubbleSkeletonRow key={i} isme={row.me}>
                                    <Skeleton round w="32px" h="32px"/>
                                    <Skeleton w={row.w} h={row.h}/>
                                </BubbleSkeletonRow>
                            ))}
                        </div>
                    )
                    : chaterror?(
                        <Statebox>
                            <Stateicon><FontAwesomeIcon icon={faRotateRight}/></Stateicon>
                            <Statetitle>대화를 불러오지 못했어요</Statetitle>
                            <div>{chaterror.uimessage||chaterror.message||"잠시 후 다시 시도해 주세요."}</div>
                            <Retrybutton onClick={()=>chatrefetch()}>다시 시도</Retrybutton>
                        </Statebox>
                    )
                    : (chatdata && Object.keys(chatdata).length===0)?(
                        <Statebox>
                            <Stateicon><FontAwesomeIcon icon={faComments}/></Stateicon>
                            <Statetitle>아직 대화가 없어요</Statetitle>
                            <div>첫 메시지를 보내 대화를 시작해 보세요.</div>
                        </Statebox>
                    )
                    :                   
                    chatdata &&
                        Object.entries(chatdata).map(([date, chats]) => {
                                //console.log("오브젝트date:",date,"오브젝트chats:",chats)

                            return (
                            
                                <Datediv key={date} >

                                    <Datecss>
                                        <Datetext>{date}</Datetext>
                                        {prevhandler("")}
                                        </Datecss>

                                    {chats.map((data,key) => {
                                            const islastRead=data.chatid===chatlist.lastchatid
                                            const isnextunread=data.chatid !== chats[chats.length - 1]?.chatid; 
                                        return (
                                            <React.Fragment key={key}>
                                              
                                            <Chatdiv  id={`chatmessage_${data.chatid}`}>
                                              
                                                
                                                {data.messagetype==="System"?<Systemchat>
                                                    
                                                    <Systemtext>{data.message}</Systemtext>
                                                    {prevhandler(data.sender.email)}

                                                </Systemchat>:
                                                <>
                                                
                                                {loginuser.userinfo["username"] === data.sender.email
                                                    ?
                                                    <Mychat>
                                                        <Profilecss>
                                                        <Profile src={profileimage(data.sender.profileurl)}
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
                                                        <Profile src={profileimage(data.sender.profileurl)} 
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
                                              {/* 여기까지읽었다 구분선 */}
                                                {islastRead && isnextunread &&<Unreaddivider>여기까지 읽었음</Unreaddivider>}
                                            </React.Fragment>
                                       
                                        )

                                    })

                                    }
                                    
                                </Datediv>

                            )

                        })
                        }

                    {//아래로 내리기위한 div태그
                    }

                    <div ref={scrollref}></div>


                    {/*내용div */}

                </Main>
                <Senddiv>
                    <Sendinput type="text" value={message||""}
                        placeholder="메시지를 입력하세요"
                        onChange={(e) => { Setmessage(e.target.value) }}
                        onKeyDown={(e)=>{
                            //엔터로도 보낸다(조합 중인 한글은 무시)
                            if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){
                                e.preventDefault();
                                if(message&&message.trim()) sendmessage();
                            }
                        }}
                    />
                    <SendButton
                        disabled={!message||!message.trim()}
                        onClick={() => { sendmessage() }}>보내기</SendButton>
                </Senddiv>



               


            </Wrapper>

        </>
    )



} export default Chatex;