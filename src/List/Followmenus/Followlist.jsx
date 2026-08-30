import React, { useState } from "react";
import { handletext } from "../../customhook/Userhandle";
import CreateAxios from "../../customhook/CreateAxios";
import { useEffect } from "react";
import Usermodal from "../../UI/Modals/Usermodal";
import { useRef } from "react";
import { defaultProps } from "react-quill";
import AuthCheck from "../../customhook/authCheck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as favorite} from "@fortawesome/free-solid-svg-icons";
import { faStar as unfavorite } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass as search } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Profilediv from "../../UI/Modals/Profilediv";
import { useCookies } from "react-cookie";

const Wrapper=styled.div`
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
    flex-direction:column;
    
`

// 목록 한 줄. 고정 높이 50px + overflow:hidden 때문에 이메일이 잘렸었다.
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
// 닉네임 + 이메일 (남는 폭을 다 쓰고, 넘치면 말줄임)
const Userprofilediv=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
`
const Userprofileimage=styled.div`
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Usernickdiv=styled.div`
    display: flex;
    align-items: center;
    min-width: 0;
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
const Usernamediv=styled.div`
    font-size: 12px;
    line-height: 1.35;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
// 언팔로우 버튼 - 평소엔 조용한 아웃라인, 올리면 빨갛게
const FollowButton=styled.button`
    flex-shrink: 0;
    height: 28px;
    padding: 0 12px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background-color: transparent;
    color: ${(props)=>props.theme.textMuted};
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition};

    :hover{
        background-color: rgba(224, 69, 69, 0.10);
        border-color: #e04545;
        color: #e04545;
    }
`
// 오른쪽 액션 묶음 (언팔로우 버튼 + 즐겨찾기 별)
const Favoritediv=styled.div`
    margin-left: auto;
    flex-shrink: 0;
    display: flex;
    justify-content: center; /* 가로 방향 중앙 정렬 */
    align-items: center; /* 세로 방향 중앙 정렬 */
    gap: 8px;
`
// 별 아이콘. 기존엔 흰색이라 흰 배경에서 안 보였다.
const Staricon=styled(FontAwesomeIcon)`
    font-size: 15px;
    cursor: pointer;
    color: ${(props)=>props.active==="true"
        ? "#f5a623"
        : props.theme.textFaint};
    transition: color ${(props)=>props.theme.transition},
                transform ${(props)=>props.theme.transition};

    &:hover {
        color: #f5a623;
        transform: scale(1.15);
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
function Followlist(props){

    const axiosinstance=CreateAxios();

  //  const [followlist,setFollowlist]=useState([]);
    
    //로그인안할시 요청안보내게
    const islogin=AuthCheck();
    const [searchkeyword,Setsearchkeyword]=useState("");

    const queryclient=useQueryClient();
     //회원정보 모달 - "어떤 유저의 모달인지"를 담는다. null 이면 닫힌 상태.
     //이전에는 boolean 하나를 목록 전체가 공유했다. 그래서 한 명을 클릭하면
     //map 안의 <Usermodal> 이 팔로우한 사람 수만큼 한꺼번에 렌더되고,
     //전부 같은 좌표에 겹쳐서 맨 마지막 사람의 메뉴만 보였다.
     //(클릭한 사람이 아닌 엉뚱한 사람이 팔로우 해제되던 원인)
     const [selecteduser,setSelecteduser]=useState(null)
     const [modalcss,setModalcss]=useState(
         {
             x:0,
             y:0
         }
     );
     const [usercookie]=useCookies(["userinfo"])

     //바깥 클릭으로 닫는 처리는 Usermodal 내부의 Outdiv onClick 이 담당한다.
     //Usermodal 은 createPortal 로 #phone-ui 에 렌더되므로, 여기서 목록 행의
     //ref.contains(e.target) 으로는 절대 판별되지 않는다(항상 false -> 즉시 닫힘).




       const {data:followlist,isLoading,error}=useQuery({
        queryKey:["followlistdata",usercookie.userinfo?.userid],
        queryFn: async()=>{
            const res= await axiosinstance.get("/followlist")
            return res.data
        },
        
        enabled:islogin
        
        
       })

       
       
       const favoritemutation=useMutation({
        mutationFn:(friendname)=>{
           return axiosinstance.get(`/favoritefollow/${friendname}`)
        },onSuccess:(data,friendname)=>{
            
           //이건비효율 queryclient.invalidateQueries("followlistdata")

           const olddata=queryclient.getQueryData(["followlistdata",usercookie.userinfo.userid])
            
             if (olddata) {
            const newdata = olddata.map((data) =>
            data.username === friendname ? { ...data, favorite: true } : data
             );
              queryclient.setQueryData(["followlistdata", usercookie.userinfo.userid], newdata);
            }
           //성공 알림 없음. 별표 아이콘이 즉시 채워지는 것으로 결과가 보인다.
        }
       })
    const favoritefollow=(friendname)=>{
       favoritemutation.mutate(friendname)

    }
    const unfavoriteunfollow=useMutation({
        mutationFn:(friendname)=>{
           return  axiosinstance.get(`/favoriteunfollow/${friendname}`)
        },onSuccess:(data,friendname)=>{
          const olddata= queryclient.getQueryData(["followlistdata",usercookie.userinfo.userid])
           
          
                if (olddata) {
            const newdata = olddata.map((data) =>
            data.username === friendname ? { ...data, favorite: false } : data
             );
              queryclient.setQueryData(["followlistdata", usercookie.userinfo.userid], newdata);
            }
            //성공 알림 없음. 별표 아이콘이 즉시 비워지는 것으로 결과가 보인다.
        }
    })
    const favoriteunfollow=(friendname)=>{
       unfavoriteunfollow.mutate(friendname)
    }

    //언팔로우뮤테이션
    const unfollowmutation=useMutation({
        //return 이 없으면 리액트쿼리가 즉시 성공으로 처리한다.
        //서버가 실패해도 onSuccess 가 돌아서 목록에서 사라지고, onError 는 영원히 안 뜬다.
        mutationFn:(username)=>{
            return axiosinstance.delete(`/followdelete/${username}`)
        },
        onSuccess:(data,friendname)=>{
            //즐겨찾기 mutation 과 동일하게 단수형(getQueryData/setQueryData)을 쓴다.
            const olddata=queryclient.getQueryData(["followlistdata",usercookie.userinfo.userid])

            if(olddata){
                //삭제라 필터
                const newdata= olddata.filter((data)=> data.username!==friendname)
                queryclient.setQueryData(["followlistdata",usercookie.userinfo.userid],newdata)
            }
            //성공 알림 없음. 목록에서 즉시 사라지는 것으로 충분하다.

        },onError:()=>{
            alert("잠시후실행해주세요")
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
        {followlist&&followlist.filter((val,index)=>{
            //필터로 키워드에 알맞은값을 리턴한다 여러개값일때테스트필요한듯
            if(searchkeyword==""){
                return val
            }
            else if(val.nickname.includes(searchkeyword)){
                return val
            }else if(val.username.includes(searchkeyword)){
                return val
            }
        }) .map((data,key)=>{          
          
            return(
                
                <Userlist  onClick={(e)=>{
                    //클릭한 행의 유저를 지정한다. 모달은 map 밖에서 하나만 렌더된다.
                    setSelecteduser(data)
                    setModalcss({x:e.clientX,y:e.clientY})
               }}
               key={data.username}
               >
                
                    <Userprofileimage>
                    <Profilediv width="40px" height="40px" url={data.profileimg}/>
                    </Userprofileimage>
                    <Userprofilediv>
                <Usernickdiv>

               
                    <Usernicknamediv>
                 {data.nickname}
                    </Usernicknamediv>
                </Usernickdiv>
            
                    <Usernamediv>
                     {handletext(data.profileid,data.username)}
                    </Usernamediv>
                   
                    </Userprofilediv>

                {/* 언팔로우 버튼과 즐겨찾기 별은 오른쪽에 함께 모은다.
                    (닉네임 옆에 버튼이 붙어 있어 이메일과 뒤엉켜 보였다) */}
                <Favoritediv>
                    <FollowButton onClick={(e)=>{
                        e.stopPropagation()
                        unfollow(data.username)}}>unfollow</FollowButton>

                 {data.favorite?<Staricon icon={favorite} active="true" onClick={(e)=>{
                    e.stopPropagation()
                    favoriteunfollow(data.username)}}
                    />
                    
                
                :<Staricon icon={unfavorite} active="false" onClick={(e)=>{
                    e.stopPropagation()
                    favoritefollow(data.username)}}
                />
                }
                </Favoritediv>

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
export default  Followlist;