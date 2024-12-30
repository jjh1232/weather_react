import React from "react";
import { useNavigate } from "react-router-dom";
import * as useChatroomexit from "../customhook/useChatroomservice";
import CreateAxios from "../customhook/CreateAxios";

function Chatroomlistitem(props){

    const {chatroomdata,onclick,inroom}=props;

    const navigate=useNavigate();


    const axiosinstance=CreateAxios();

    
    const movechatroom=(chatroomdata)=>{
        //navigate("/chatex?roomid="+chatroomdata.roomid)
        inroom(chatroomdata)
        
    }

    /*
    const exit=(roomid)=>{
    axiosinstance.post("/chatroomexit",{

        roomid:roomid

    }).then((res)=>{
        console.log("성공적")
        
    })
    .catch((err)=>{
        console.log("에러")
    })
    }
*/
    return (
        <div>
        <div onClick={()=>{movechatroom(chatroomdata)}}>
        이름:{chatroomdata.roomname} 
        <br/>
        유저목록:{chatroomdata.namelist.map((data,key)=>{
            
            return(
                <>
                {chatroomdata.namelist.length-1===key
                ?<>{data.membernickname} </>
                :<>{data.membernickname},</>}     
                
                </>
            )
        })}
       
        <br/>
       
        {chatroomdata.latelychat}

        
        </div>
        시간:{chatroomdata.time} 
        <button onClick={()=>{
            onclick(chatroomdata.roomid)
        }}>나가기</button>
        <br/>
        </div>
    )
}
export default Chatroomlistitem;