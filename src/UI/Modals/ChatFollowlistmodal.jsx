import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";

const Modal=styled.div`
 position:absolute;
height:100%;
width:100%;
background:green;


`

const ChatFollowlistmodal=(props)=>{
    const {close,roomid,roomusers,invite,isinvitelist}=props;
    const axiosinstance=CreateAxios();
    const [followlist,setFollowlist]=useState();
    const [checklist,setChecklist]=useState([])
    const [selectlist,setSelectlist]=useState([]);
    const [ischeck,setIscheck]=useState(false)
    const [search,setSearch]=useState(" ");


    useEffect(()=>{
        followlistget();

    },[])

    const followlistget=()=>{
        axiosinstance.get("/followlist")
        .then((res)=>{
            console.log(res.data)
            setFollowlist(res.data)
        }).catch((err)=>{
            console.log("에러")
        })
    }


    const clossmodal=()=>{
        console.log("클릭")
       
        close();
    }

    //체크박스 데이터
    const checkhandler=(check,value)=>{
        console.log("체크핸들러시작")
        if(check){
            setChecklist((prev)=>[...prev,value])
           
            return
        }
        if(!check && checklist.includes(value)){
            setChecklist(checklist.filter((data)=>data !== value))
            
            return
        }

      
        return
    }

    /*
    const userinvite=()=>{
        axiosinstance.post("/chatroominvite",{
            roomid: roomid,
            userlist:checklist
        }).then((res)=>{
            
        })
        
    }
        */
    //채팅창 유저비교 

    const existinguser=(usernickname)=>{
        
        let value=false;
       

            //roomusers.forEach((data)=>{})} 포이치문브레이크안되서효율이안조흐..return도continue고..
            for(var i =0;i<roomusers.length;i++){
                console.log("유저데이터:"+roomusers[i].membernickname)
                if(usernickname===roomusers[i].membernickname){
                    console.log("채팅창유저비교"+usernickname)
                    console.log("같은유저"+roomusers[i].membernickname)
                 
                    value=true;
                    return value;
                }
              
            }
            console.log("끝")
            return value;   
            
                
    }



    return (
        <Modal>
            <div style={{display:"flex"}}>
                <button onClick={clossmodal}>닫기</button>

                <button style={{marginLeft:"auto"} } onClick={()=>
                    {invite(roomid,checklist)
                        isinvitelist();
                    }} >
                    
                    초대하기</button>
                
            </div>
            {/*여기에 초대누른목록 추가 */}
            {/*검색 */}
            <br/>
            <div>
                <input type="text" style={{position:"relative", width:"80%"}}
                    onChange={(e)=>{

                        setSearch(e.target.value);
                    }}
                /> 
                
            </div>
            <br/>
            <div>
                {/*친구목록 */}
                {followlist&&followlist.filter((filter)=>{
                    //하나씩 조건통과하면 리턴 아니면 리턴안함 ㅇ
                    if(search===" "){
                        return filter
                    }

                    else if(filter.nickname.includes(search)){
                        return filter;
                    }
                    else if(filter.username.includes(search)){
                        return filter;
                    }
                })
                
                .map((data)=>{
                    //이프로검사
                    if(existinguser(data.nickname)){
                        console.log("기존에있는경우!")
                        return(
                            <div>
                        {data.nickname}기존있음
                        <br/>
                        @{data.username} 
                        
                        </div>
                        )    
                }   
                    else{                 
                        console.log("기존에없는경우!")
                    return(
                        
                        <label for={data.username} >
                            <div>
                            {data.nickname}
                        <input id={data.username} type="checkbox" 
                        //checked={checked}
                        onChange={(e)=>{
                            console.log("온채인지")
                            checkhandler(e.target.checked,e.target.id)
                        }}
                        style={{ float:"right",borderRadius:"10px"}} />
                        <br/>
                        @{data.username}
                        
                        <br/>
                        </div>
                        </label>
                       
                        
                        
                        
                    )
                }
                    
                })}
            </div>
        </Modal>


    )


}
export default ChatFollowlistmodal