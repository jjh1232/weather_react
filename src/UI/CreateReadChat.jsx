import { useRef,useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs"

function CreateReadChat(){
const [chatList,setChatList]=useState([]);
const [chat,setchat]=useState('');

const {apply_id} =useParams();
const client=useRef({});//userref로 속성값이변경되도재랜더링하지않고
//랜더링하더라도 유실되지않도록 속성을 만든다

const connect=()=>{
    //연결할때
client.current=new StompJs.Client({
    brokerURL: `wss://localhost:8081/open/ws/stomp/chat`,
    onConnect: ()=>{
        console.log('연결성공')
        subscribe(); //연결성공시 구독하는로직실행
    },
}
)
client.current.activate();//클라이언트활성화
}
//메세지발행코드
const publish = (chat) =>{
    if(!client.current.connected) return;//연결되지않으면 메세지안보냄

    client.current.publish({
        destination:`/pub/chat`,
        body:JSON.stringify({
            applyId:apply_id,
            chat:chat,
        }),//형식에맞게수정해서보내야함
    })
    setchat('');
}

const subscribe = () => {
    client.current.subscribe('/sub/chat/' + apply_id, (body) => {
      const json_body = JSON.parse(body.body);
      setChatList((_chat_list) => [
        ..._chat_list, json_body
      ]);
    });
  };

const disconnect = ()=>{
    //연결이끊겼을때
    client.current.deactivate();
}

 const handleChange = (event) => { // 채팅 입력 시 state에 값 설정
    setchat(event.target.value);
  };

  const handleSubmit = (event, chat) => { // 보내기 버튼 눌렀을 때 publish
    event.preventDefault();

    publish(chat);
  };
useEffect(()=>{
    connect();
    return() =>disconnect();
},[])

return(
    <div>
        <div className={'chat-list'}>{chatList}</div>
      <form onSubmit={(event) => handleSubmit(event, chat)}>
        <div>
          <input type={'text'} name={'chatInput'} onChange={handleChange} value={chat} />
        </div>
        <input type={'submit'} value={'의견 보내기'} />
      </form>
    </div>
)
}
export default CreateReadChat