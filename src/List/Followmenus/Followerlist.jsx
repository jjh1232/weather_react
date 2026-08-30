import React, { useEffect, useState } from "react";
import { handletext } from "../../customhook/Userhandle";
import CreateAxios from "../../customhook/CreateAxios";
import  {unfollow,following}  from "../../customhook/Followtools";
import Usermodal from "../../UI/Modals/Usermodal";
import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import Profilediv from "../../UI/Modals/Profilediv";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass as search } from "@fortawesome/free-solid-svg-icons";

const Wrapper=styled.div`

display: flex;
flex-direction: column;
overflow: hidden;
`
const Searchdiv=styled.div`
    display: flex;
    position: relative;

    align-items:center;
    gap: 3px;
    padding: 8px 10px;
`
const Userlistdiv=styled.div`
    display: flex;
  
    flex-direction: column;
`
// 목록 한 줄
const Userlist=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    cursor: pointer;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    transition: background ${(props)=>props.theme.transition};

    &:last-child { border-bottom: none; }
    &:hover { background: ${(props)=>props.theme.surfaceHover}; }
`
const Userprofilediv=styled.div`
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`
// 닉네임 + 이메일
const Userdatadiv=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
`
const Usernamediv=styled.div`
    font-size: 12px;
    line-height: 1.35;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const Usernicknamediv=styled.div`
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const Followdiv=styled.div`
    margin-left: auto;
    flex-shrink: 0;
     display: flex;
     justify-content: center; /* 가로 방향 중앙 정렬 */
    align-items: center; /* 세로 방향 중앙 정렬 */
`
// follow = 솔리드(권하는 동작), unfollow = 조용한 아웃라인 + 호버 시 빨강
const FollowButton=styled.button`
    height: 28px;
    min-width: 72px;
    padding: 0 12px;
    border-radius: ${(props)=>props.theme.radiusPill};
    cursor: pointer;
    font-size: 12px;
    font-weight: 650;
    letter-spacing: -0.01em;
 display: flex;           /* Flex 컨테이너로 만듬 */
  align-items: center;     /* 세로 중앙정렬 */
  justify-content: center;

    border: 1px solid ${(props)=>props.status==="follow"
        ? "transparent"
        : props.theme.border};
    background-color: ${(props)=>props.status==="follow"
        ? props.theme.accent
        : "transparent"};
    color: ${(props)=>props.status==="follow"
        ? "#fff"
        : props.theme.textMuted};
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition};

    :hover{
        background-color:  ${(props)=>props.status==="follow"
            ? props.theme.accentHover
            : "rgba(224, 69, 69, 0.10)"};
        border-color: ${(props)=>props.status==="follow"
            ? "transparent"
            : "#e04545"};
        color: ${(props)=>props.status==="follow" ? "#fff" : "#e04545"};
    }

`

const Inputcss=styled.input`
width: 100%;
height: 32px;
border-radius: ${(props)=>props.theme.radiusPill};
padding: 0 10px 0 30px;
border: 1px solid ${(props)=>props.theme.border};
background: ${(props)=>props.theme.surfaceAlt};
color: ${(props)=>props.theme.text};
font-size: 13px;
   box-sizing: border-box; /* 패딩 포함 너비 계산 */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;          /* 기본 파란 윤곽선 제거 */
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    background: ${(props)=>props.theme.surface};
  }

  &::placeholder {
    color: ${(props)=>props.theme.textFaint};
  }
`
const Searchicon=styled(FontAwesomeIcon)`
    position: absolute;
   color: ${(props)=>props.theme.textFaint};
   font-size: 13px;
    top: 50%;
    margin-left: 11px;
      transform: translateY(-50%);
      
  
  pointer-events: none;  /* 클릭 이벤트가 input으로 가도록 함 */

`
function Followerlist(props){

   


    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();
    
    const [searchkeyword,Setsearchkeyword]=useState("");

     //회원정보 모달 - "어떤 유저의 모달인지"를 담는다. null 이면 닫힌 상태.
     //boolean 하나를 목록 전체가 공유하면, map 안의 <Usermodal> 이 사람 수만큼
     //한꺼번에 렌더되고 전부 같은 좌표에 겹쳐서 엉뚱한 사람의 메뉴가 보인다.
     const [selecteduser,setSelecteduser]=useState(null)
     const [modalcss,setModalcss]=useState(
         {
             x:0,
             y:0
         }
     );
 
 
     const [usercookie]=useCookies(["userinfo"])

     //바깥 클릭으로 닫는 처리는 Usermodal 내부의 Outdiv onClick 이 담당한다.
     //Usermodal 은 createPortal 로 #phone-ui 에 렌더되므로 목록 행의
     //ref.contains(e.target) 으로는 판별되지 않는다(항상 false -> 열자마자 닫힘).


   
     const {data:followerlist,isLoading,error}=useQuery({
        queryKey:["followerlist",usercookie.userinfo.userid],
        queryFn:async ()=>{
            const res=await axiosinstance.get("/followerlist")
            
            return res.data
        },
        
     })
  
     const onfollowmutation=useMutation({
       
        mutationFn:(username)=>{
            axiosinstance.get("/follow?friendname="+username)
        },onSuccess:(res,username)=>{
            const olddata=queryclient.getQueryData(["followerlist",usercookie.userinfo.userid])
            console.log("이전데이터"+olddata[0])
            const newdata=olddata.map((data)=>{

                return data.username===username?{...data,followcheck:true}:data
        })
            queryclient.setQueriesData(["followerlist",usercookie.userinfo.userid],newdata)
            //성공 알림 없음. 버튼 상태가 바뀌는 것으로 결과가 보인다.
        },onError:()=>{
            alert("팔로우에 실패했습니다. 잠시 후 다시 시도해주세요.")
        }
     })

    const onfollow=(username)=>{
      
        onfollowmutation.mutate(username)
        
    }

    const unfollowmutation=useMutation({
       
        //return 이 없으면 리액트쿼리가 즉시 성공으로 처리한다(서버 실패해도 onError 안 뜸).
        mutationFn:(username)=>{
            return axiosinstance.delete(`/followdelete/${username}`)
        },onSuccess:(res,username)=>{
            const olddata=queryclient.getQueryData(["followerlist",usercookie.userinfo.userid])
            const newdata=olddata.map((data)=>{

                return data.username===username?{...data,followcheck:false}:data
        })
            queryclient.setQueriesData(["followerlist",usercookie.userinfo.userid],newdata)
            //성공 알림 없음.
        },onError:()=>{
            alert("팔로우 해제에 실패했습니다. 잠시 후 다시 시도해주세요.")
        }
     })
    const unfollow =(username)=>{
       unfollowmutation.mutate(username)
    }

     //채팅방만들기 데이터전달
     const chatroomdata=(roomid)=>{

        props.setContent("chatroom");
        props.setRoomid(roomid);
    }
        
    return (
        <Wrapper>
        <Searchdiv>
                    
                <Searchicon icon={search} />
                <Inputcss onChange={(e)=>{Setsearchkeyword(e.target.value)}} 
                placeholder="닉네임이나 이메일을 입력해주세요"/> 
                </Searchdiv>
         <Userlistdiv>
        {followerlist&&followerlist.filter((list)=>{
            if(searchkeyword==""){
                return list;
            }
            else if(list.nickname.includes(searchkeyword)){
                return list;
            }
            else if(list.username.includes(searchkeyword)){
                return list;
            }
           
        })
          .map((data)=>{
            return(
                
                <Userlist onClick={(e)=>{
                    //클릭한 행의 유저를 지정한다. 모달은 map 밖에서 하나만 렌더된다.
                    setSelecteduser(data)
                    setModalcss({x:e.clientX,y:e.clientY})
               }}
               key={data.username}
                >
                    <Userprofilediv>
                         <Profilediv width="40px" height="40px" url={data.profileimg}/>
                       
                    </Userprofilediv>
                   <Userdatadiv>

                  
                    <Usernicknamediv>
                {data.nickname} 
                    </Usernicknamediv>
                    
                  
                   <Usernamediv>
                {handletext(data.profileid,data.username)}
                </Usernamediv>
                 </Userdatadiv>

                <Followdiv>
                {data.followcheck
                    ?
                       
                    <FollowButton onClick={(e)=>{
                        e.stopPropagation();
                        unfollow(data.username);
                    
                    //unfoll(data.username)
                }}
                status="unfollow"
                >unfollow</FollowButton>
                    
                :<FollowButton onClick={(e)=>{
                    //stopPropagation 이 없으면 클릭이 행(Userlist)까지 올라가서
                    //팔로우와 동시에 유저 메뉴까지 열린다.
                    e.stopPropagation();
                    onfollow(data.username);
                }}
                 status="follow"
                >follow</FollowButton>}
                </Followdiv>
                </Userlist>
                
         
            )
        })}
       </Userlistdiv>

        {/* 모달은 목록 밖에서 딱 하나만 렌더한다. 선택된 유저가 있을 때만 열린다. */}
        {selecteduser&&<Usermodal
            username={selecteduser.username}
            usernickname={selecteduser.nickname}
            ModalX={modalcss.x} ModalY={modalcss.y}
            chatroomdata={chatroomdata}
            setismodal={()=>setSelecteduser(null)}
            profileid={selecteduser.profileid}
            />}
        </Wrapper>
    )
}
export default Followerlist;