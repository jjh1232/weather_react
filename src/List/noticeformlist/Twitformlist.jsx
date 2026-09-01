import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Commentform from "../../Noticepage/Commentform";
import { useCookies } from "react-cookie";
import Twitformnoticeupdate from "./Twitformnoticeupdate";
import AuthCheck from "../../customhook/authCheck";
import { useNavigate } from "react-router-dom";
import Simpleprofile from "../../MemberPage/Memberupdata/Simpleprofile";
import Datefor from "./DateCom/Datefor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as full } from "@fortawesome/free-solid-svg-icons";
import { faHeart as empty}  from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Noticemenu from "./DateCom/Noticemenu";
import NoticeWeathericon from "../../UI/Noticetools/NoticeWeathericon";
import { faChartSimple as view } from "@fortawesome/free-solid-svg-icons";
import Viewtrans from "./DateCom/Viewtrans";
import { handletext, handleparam } from "../../customhook/Userhandle";
import { faComment as comimo } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useConfirm } from "../../UI/Feedback/FeedbackProvider";
import profileimage from "../../UI/profileimage";
import { API_BASE } from "../../config/api";



const Wrapper=styled.div`
    padding: 14px 18px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    color: ${(props)=>props.theme.text};
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.13s;  //부드럽게
&:hover{
  background: ${(props)=>props.theme.surfaceHover}; //호버시색변경
}
`
const Noticedata=styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`
const NoticeHeader=styled.div`
  //border: 1px solid red;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
`
const Profileview=styled.div`
    flex-shrink: 0;
    width:45px;
    height:45px;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
    transition: box-shadow ${(props)=>props.theme.transition};

    &:hover {
      box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
const Nameheader=styled.div`
// border: 1px solid blue;
 display: flex;
 align-items: center;
 gap: 8px;
 height: 30px;
  width: 100%;
`
const Nickname=styled.div`
  font-weight: 650;
  /* 한 줄에서 제일 먼저 읽혀야 하는 정보라 아이디·시간보다 확실히 키운다. */
  font-size: 16px;
  letter-spacing: -0.02em;
  white-space: nowrap;
`
const Username=styled.div`
 position: relative;
  /* 옆의 "· 4분전"(Timecss)과 같은 textFaint 를 쓴다.
     닉네임(진하고 큼) / 아이디·시간(흐리고 작음) 으로 위계를 나눈다.
     예전엔 textMuted 라 닉네임과 명도 차이가 크지 않아 둘이 비슷하게 보였다. */
  color: ${(props)=>props.theme.textFaint};
  font-size: 13px;
  margin-left: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
 // border: 1px solid yellow;
`
const Timecss=styled.div`
   position: relative;
   /* 이메일이 길어도 줄바꿈되지 않고 바로 옆에 붙게 한다.
      (flex-shrink 를 안 막으면 눌려서 "·" 와 시간이 두 줄로 쪼개진다) */
   flex-shrink: 0;
   display: flex;
   align-items: baseline;
   gap: 6px;
   color: ${(props)=>props.theme.textFaint};
   font-size: 13px;
   white-space: nowrap;

   /* 이메일/시간 사이 가운뎃점 구분자 */
   &::before {
     content: "·";
   }
`
const Weatherdiv=styled.div`
  
`
const UsernameandEmaildiv=styled.div`
  display: flex;
  align-items: baseline;
  /* 길어지면 시간을 밀어내는 대신 이메일 쪽이 말줄임 처리된다 */
  min-width: 0;
  overflow: hidden;
`
const TitleCss=styled.div`
  display: flex;
`
const Title=styled.div`
  float: left;
  font-size:15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-top: 2px;
 // border: 1px solid blue;
`
const HeaderTools=styled.div`
  display: flex;
   margin-left: auto;
   gap: 12px;
 
  justify-content: center;  /* 가로(주축) 중앙 정렬 */
  align-items: center;      /* 세로(교차축) 중앙 정렬 */
`
const Weatherdata =styled.div`
    position: relative;
  
    
    //border:1px solid yellow;
    display: flex;
  justify-content: center;  /* 가로(주축) 중앙 정렬 */
  align-items: center;      /* 세로(교차축) 중앙 정렬 */
    
    gap: 10px;
    color: ${(props)=>props.theme.textMuted};
`
const Menucss=styled.div`
 //내부요소 오른쪽정렬
 // margin-left: auto;
   /* 드롭다운 메뉴(Noticemenu)의 위치 기준점 */
   position: relative;
   display: flex;
  justify-content: center;  /* 가로(주축) 중앙 정렬 */
  align-items: center;      /* 세로(교차축) 중앙 정렬 */
  width: 30px;
  height: 30px;
  color: ${(props)=>props.theme.textFaint};
border-radius: 50%; 
     transition: background 0.15s, color 0.15s;  //부드럽게
&:hover{
  background: ${(props)=>props.theme.accentSoft}; //호버시색변경
  color: ${(props)=>props.theme.accent};
}
`
const NoticeMain=styled.div`
  position: relative;
  padding-left: 57px;   /* 프로필(45px) + gap(12px) 만큼 본문 들여쓰기 */
`
/* 본문과 "더보기"의 기준 상자.

   Overflowdiv 는 position:absolute; width:100% 인데, 기준이 NoticeMain 이었다.
   NoticeMain 에는 padding-left:57px(프로필 자리) 이 있고 absolute 요소의
   기준은 "패딩 박스"라서, 100% 가 그 57px 까지 포함한 폭이 된다.
   거기에 left 가 없어 흐름상 위치(=패딩 안쪽)에서 시작하니 오른쪽으로
   딱 57px 만큼 삐져나왔다.
   본문과 같은 폭을 갖는 상자를 하나 두고 그 안에서 기준을 잡는다. */
const Textbox=styled.div`
  position: relative;
`
const Textarea=styled.div`
  padding: 6px 0 2px;
  font-size: 14.5px;
  line-height: 1.65;
  color: ${(props)=>props.theme.text};
  word-break: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 150px;
  /* 이미지 한 장이 잘리지 않는 높이. 더 길면 "더보기"로 펼친다. */
  max-height: ${(props)=>props.over?"none":"520px"};

  img {
    max-width: 100%;
    /* 세로로 긴 이미지도 카드 한 장 안에 들어오게 */
    max-height: 480px;
    height: auto;
    object-fit: contain;
    border-radius: ${(props)=>props.theme.radius};
  }
`
/* 차단한 글 자리.
   예전엔 500px 짜리 안내 이미지를 통째로 깔아서, 안 보기로 한 글이
   오히려 화면을 제일 많이 차지했다. 자리만 알려주고 접어둔다. */
const Blockcss=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 30px 20px;
  text-align: center;
  border: 1px dashed ${(props)=>props.theme.borderStrong};
  border-radius: ${(props)=>props.theme.radius};
  background: ${(props)=>props.theme.surfaceAlt};
  color: ${(props)=>props.theme.textMuted};
`
const Blockicon=styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 15px;
  background: ${(props)=>props.theme.surfaceHover};
  color: ${(props)=>props.theme.textFaint};
`
const Blocktitle=styled.div`
  font-size: 14px;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: ${(props)=>props.theme.text};
`
const Blocksub=styled.div`
  font-size: 12.5px;
  color: ${(props)=>props.theme.textFaint};
`
const Blockreveal=styled.button`
  margin-top: 4px;
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radiusPill};
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props)=>props.theme.textMuted};
  background: ${(props)=>props.theme.surface};
  cursor: pointer;
  transition: background ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition};

  &:hover{
    background: ${(props)=>props.theme.surfaceHover};
    color: ${(props)=>props.theme.text};
  }
`
const Overflowdiv=styled.div`
  position: absolute;
  z-index: 5;
  width: 100%;
  bottom: 0px;
  height: 70px;

  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 6px;

  font-size: 13px;
  font-weight: 600;
  color: ${(props)=>props.theme.accent};

  /* 아래로 갈수록 불투명해지는 페이드 */
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${(props)=>props.theme.surfaceGlass} 60%,
    ${(props)=>props.theme.surface} 100%
  );
  cursor: pointer;

  &:hover {
    color: ${(props)=>props.theme.accentHover};
  }
`
const Noticefooter=styled.div`
  display  :  flex;
 gap: 150px;
 margin-top: 10px;
 padding: 10px 0 4px 57px;
 /* 본문과 액션 메뉴를 선으로 구분 */
 border-top: 1px solid ${(props)=>props.theme.border};
 color: ${(props)=>props.theme.textMuted};
`
// 댓글 작성 영역 - 게시글 본문/푸터와 선으로 구분한다.
// 피드에서는 "쓰는 것"까지만 한다. 목록은 상세 페이지에서 본다.
const Replyarea=styled.div`
  margin-top: 8px;
  padding: 12px 12px 12px 57px;
  border-top: 1px solid ${(props)=>props.theme.border};
  background: ${(props)=>props.theme.surfaceAlt};
  border-radius: ${(props)=>props.theme.radiusSm};
`
// 목록 전체는 상세 페이지로 넘긴다
const Showallcomment=styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 4px 2px;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${(props)=>props.theme.accent};
  cursor: pointer;
  transition: color ${(props)=>props.theme.transition};

  &::after { content: "92"; }   /* → */

  &:hover { color: ${(props)=>props.theme.accentHover}; }
`
const Showreplediv=styled.div`
  position: relative;
  display: flex;
  align-items: center;

  border-radius: ${(props)=>props.theme.radiusPill};
       transition: color 0.15s;  //부드럽게
&:hover{
  color: ${(props)=>props.theme.accent}; //호버시색변경
}
  
`
const Commentnumdiv=styled.span`

  padding-left: 7px;
  font-size: 14px;
     display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  text-align: center;
   
`
const Likediv=styled.div`
 position: relative;

  
  gap: 5px;
  display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  text-align: center;

          transition: color 0.15s;  //부드럽게
&:hover{
  color: ${(props)=>props.theme.like}; //호버시색변경
}
`
const Likeviewtextdiv=styled.div`
  font-size: 14px;
     display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  text-align: center;


 
`
const Viewdiv=styled.div`
 position: relative;
  gap: 5px;
    display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  text-align: center;

  
        transition: color 0.15s;  //부드럽게
&:hover{
  color: #3bb89b; //호버시색변경
}
`
//아이콘색깔 div를 따로하긴해야겠다
// 아이콘 뒤 후광(::after)은 반드시 이 박스를 기준으로 잡혀야 한다.
// position:relative 가 없으면 바깥 Showreplediv/Likediv/Viewdiv 기준이 되어
// 후광이 숫자 쪽으로 밀려서 그려진다.
const Iconback = `
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  transition: color 0.17s;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.17s;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 0.18;
  }
`

const Commenticon=styled(FontAwesomeIcon)`
  position: relative;
  z-index: 1;
`
const CommentBack=styled.div`
  ${Iconback}

  &::after {
    background: ${(props)=>props.theme.accent};
  }
  &:hover {
    color: ${(props)=>props.theme.accent};
  }
`
const Hearticon=styled(FontAwesomeIcon)`
  position: relative;
  z-index: 1;
`
const Heartback=styled.div`
  ${Iconback}

  &::after {
    background: ${(props)=>props.theme.like};
  }
  &:hover {
    color: ${(props)=>props.theme.like};
  }
`
const Viewicon=styled(FontAwesomeIcon)`
  position: relative;
  z-index: 1;
`
const Viewback=styled.div`
  ${Iconback}

  &::after {
    background: #32c256;
  }
  &:hover {
    color: #32c256;
  }
`

export default function Twitformlist(props){

    const {post}=props;
    const navigate=useNavigate();
    const [isreple,setIsreple]=useState(false);
    const [comments,setComments]=useState();
    const axiosinstance=CreateAxios();
    const confirm=useConfirm();
    const [loginuser,setloginuser,removeloginuser]=useCookies();
    const [isupdate,setIsupdate]=useState(false)
    const [islike,setIslike]=useState(post.likely);
    const [likenum,setLikenum]=useState(post.likes)
    //TwitformnoticeDto 의 필드명은 blockcheck 다. post.isblock 은 없는 값이라
    //항상 undefined -> 차단한 글이 새로고침하면 그대로 보였다.
    const [isblock,setIsblock]=useState(post.blockcheck)
    //피드에서 댓글을 쓰면 그 자리에서 숫자가 올라가야 한다.
    //post 는 목록 쿼리 결과라 다시 받아오기 전엔 안 바뀐다.
    const [commentcount,setCommentcount]=useState(post.commentcount ?? 0)
    //차단은 유지하되 이번 한 번만 열어보고 싶을 때가 있다
    const [showblocked,setShowblocked]=useState(false)
     
    const [isSimpleprofile,setIsSimpleprofile]=useState(false);
    const [expend,setExpend]=useState(false);
    const Textref=useRef();

    const [textoverflow,setTextoverflow]=useState(false);

    const isDragging=useRef(false);

    
    //클릭시 내용크게
    //본문 이미지는 렌더 직후엔 크기가 0이라 그때 한 번만 재면 "더보기"가 안 뜬다.
    //이미지 로드/크기변화를 계속 지켜보면서 다시 잰다.
    useEffect(()=>{
      const el=Textref.current;
      if(!el) return;

      const check=()=>setTextoverflow(el.scrollHeight>el.clientHeight+1);
      check();

      const observer=new ResizeObserver(check);
      observer.observe(el);

      const images=Array.from(el.querySelectorAll("img"));
      images.forEach((img)=>{
        if(!img.complete){
          img.addEventListener("load",check);
          img.addEventListener("error",check);
        }
      })

      return ()=>{
        observer.disconnect();
        images.forEach((img)=>{
          img.removeEventListener("load",check);
          img.removeEventListener("error",check);
        })
      }
    },[post.text,expend])

    useEffect(()=>{
      if(loginuser.userinfo){
       // islikes(post.num);
      }
    },[])

 

    const showreply=()=>{
        console.log("쇼리플")
                               
        axios.get(`${API_BASE}/open/comment/${post.num}`).then((res)=>{
            setComments(res.data)
           

        }).catch((err)=>{
            console.log(err)

        })
    
        useEffect(()=>{
          if(isreple){
            
            showreply();
        }else{
           
  
        }
        },[isreple])
     
   

    }
    
 const postUpdate=()=>{
    setIsupdate(true)

 }

 const postDelete=async()=>{
    const ok=await confirm({
      title:"이 글을 삭제할까요?",
      description:"글에 달린 댓글도 함께 사라집니다. 되돌릴 수 없습니다.",
      confirmText:"삭제",
      danger:true,
    })
    if(ok){
      //post.num 은 DTO 에 없다. 그동안 /noticedelete/undefined 로 나가고 있었다.
      axiosinstance.delete(`/noticedelete/${post.id}`)
      .then((res)=>{
        alert("정상적으로삭제되었습니다")
        window.location.reload();

      }).catch((err)=>{
        alert("에러가났어요")
      })
    }else{
     // alert("삭제취소")
    }
 }

 
 //좋아요기능==========================================
 const logincheck=AuthCheck();

 const onlike=(id)=>{
  if(!logincheck){
    alert("로그인후 이용하실수있습니다")
    return
  }

  //백엔드에는 @PostMapping("/noticelike/{noticeid}") 하나뿐이다.
  //GET 으로 부르고 있어서 405 가 떨어졌고, 그게 아래 catch 의 "오류" 였다.
  //상세페이지(Noticedetailre)는 처음부터 post 로 부르고 있어서 거기선 잘 됐다.
  axiosinstance.post(`/noticelike/${id}`).then((res)=>{
    //서버가 내려주는 값이 "지금 좋아요 상태"다. 눈대중으로 토글하지 말고 그대로 쓴다.
    const liked=res.data;
    console.log("좋아요기능"+liked)
    setIslike(liked)
    setLikenum((prev)=>prev+(liked?1:-1))

  }).catch(()=>{
    
    alert("오류")
  })
 }
//마우스위치
 const [xy,setXY]=useState({x:-1000,y:-1000})
 const hidetimer=useRef(null);

const ProfileMouseEnter =(e)=>{
    clearTimeout(hidetimer.current)
    setXY({x:e.clientX,y:e.clientY})
    setIsSimpleprofile(true);
}
//바로 닫으면 프로필에서 팝업으로 마우스를 옮기는 도중에 사라진다.
//짧은 유예를 두고, 그 사이 팝업에 마우스가 들어오면 취소한다.
const ProfileMouseLeave=()=>{
  clearTimeout(hidetimer.current)
  hidetimer.current=setTimeout(()=>setIsSimpleprofile(false),180)
}
const ProfileKeepOpen=()=>{
  clearTimeout(hidetimer.current)
}
//날씨=====================================================
// 1. 날씨 관련 key만 모아둔 배열
const weatherKeys = ['sky', 'rain', 'pty', 'temp', 'reh', 'wsd'];

// 2. 전체 데이터에서 날씨 데이터만 추출
const weatherData = weatherKeys.map(key=>({
  type:key,
  value:post?.[key]
}))

// =======이미지만 클릭시 핸들스탑하기 ====
const Textimageclick=(e)=>{
  const el=e.target;
  //이미지클릭시
  //이미지는 IMG로 알아서되네신기
 
  if(el.tagName==='IMG'){
    e.stopPropagation();
    return
  }
}
//드래그시 클릭멈추기
const HandleMouseDown=()=>{
  isDragging.current=false;
}
const HandleMouseMove=()=>{
  isDragging.current=true;

}
const HandleMouseup=(e,postid)=>{

  if(!isDragging.current){
    //드래그가 아니면 이동
    navigate(`/notice/detail/${postid}`)
  }
  //드래그였으면 아무동작안함
}
//메뉴클릭시 페이지이동막기위해 다핸들러로 
const Userpagenavigate=(e)=>{

 navigate(`/userpage/${handleparam(post.profileid,post.username)}`);
}
const Detailpagenavigate=(e)=>{

}


const [ismenu,setismenu]=useState(false);
//필요하면 mouseup으로 다시false로
//==========================렌더링==============================
    return (
      
    
        <Wrapper onMouseDown={HandleMouseDown} onMouseMove={HandleMouseMove}
         onMouseUp={(e)=>HandleMouseup(e,post.id)}
         > 
    
        {
          
        //유저프로필=============================================
        }
        <Noticedata>
        
        <Profileview onClick={Userpagenavigate}>
       
    <img   src={profileimage(post.userprofile)}
   style={{objectFit:"fill",width:"100%",height:"100%",background:"white"}}
          onMouseEnter={(e)=>ProfileMouseEnter(e)}
          onMouseLeave={ProfileMouseLeave}
          onMouseUp={(e)=>{e.stopPropagation();}} 
          />
                
     </Profileview>
        <NoticeHeader >    
        

        
     <Nameheader >
      <UsernameandEmaildiv 
           onMouseEnter={(e)=>ProfileMouseEnter(e)}
          onMouseLeave={ProfileMouseLeave}
         
          onMouseUp={(e)=>{e.stopPropagation();}} 
      >

    
      <Nickname>
        
          {post.nickname}
          
        </Nickname>
     <Username >
      {handletext(post.profileid,post.username)}
      </Username>
        </UsernameandEmaildiv>
     <Timecss>
     <Datefor inputdate={post.red}/>
     </Timecss>
      <HeaderTools>

     
     <Weatherdata>
                    
                    {weatherData.map((data,key)=>(
                      
                      <NoticeWeathericon type={data.type} value={data.value} key={key}/>
                      
                    ))}

                      </Weatherdata>    
                 
                    <Menucss onMouseUp={(e)=>e.stopPropagation()}>
                    <FontAwesomeIcon 
                     onClick={(e)=>{
                      e.stopPropagation();
                      setismenu(!ismenu)}}  
                      onMouseUp={(e)=>{
                        e.stopPropagation();
                      }}
                    icon={faEllipsis} fontSize={"25px"}/>
                   
                    {ismenu&& 
            <Noticemenu deletemethod={postDelete} updatemethod={postUpdate}
                     noticeuser={post.username}
                     noticeid={post.id}
                     setisblock={setIsblock}
                     closeisMenu={setismenu}
                     />

                    
                    }
                
                    
                    </Menucss>      
               </HeaderTools>
                 
            
     </Nameheader>

     {isSimpleprofile?<><Simpleprofile
      username={post.username} nickname={post.nickname} profileimg={post.userprofile}
      profileid={post.profileid}
      mousexy={xy} onmouseEnter={ProfileKeepOpen} onmouseLeave={ProfileMouseLeave}
      /></>:""}
    
     
     {
     //===============================유저프로필종료================
     }
   
         
            <TitleCss>
            <Title>{post.title}</Title> 
            
            </TitleCss>
            
            
            </NoticeHeader>
            </Noticedata>
            {
        //게시글 헤더끝 메인시작=============================================
        }
        <NoticeMain>

 
         {isblock&&!showblocked?
            <Blockcss onMouseUp={(e)=>e.stopPropagation()}>
              <Blockicon><FontAwesomeIcon icon={faEyeSlash}/></Blockicon>
              <Blocktitle>차단한 게시글입니다</Blocktitle>
              <Blocksub>⋯ 메뉴에서 차단을 해제할 수 있어요</Blocksub>
              <Blockreveal type="button" onClick={(e)=>{
                e.stopPropagation();
                setShowblocked(true)
              }}>이번만 보기</Blockreveal>
            </Blockcss>
          
          
            :<>
            <Textbox>
            {<Textarea ref={Textref} dangerouslySetInnerHTML={{__html:post.text}}
            over={expend} onClick={(e)=>Textimageclick(e)}
            >

                
              </Textarea>}
          {textoverflow&&!expend&&
          <Overflowdiv onClick={(e)=>{
            e.stopPropagation()
            setExpend(!expend)}}>
                더보기
                </Overflowdiv>}
            </Textbox>
            {
        //게시글메인끝 게시글푸터 =============================================
        }

        </>}
               </NoticeMain>
            <Noticefooter>
              <Showreplediv
              onMouseUp={(e)=>e.stopPropagation()}
              onClick={(e)=>{e.stopPropagation();setIsreple(!isreple)}}>
            
            <CommentBack>

           

            <Commenticon icon={ comimo} size="xl"/>
             </CommentBack>
            {commentcount >0&&
            <Commentnumdiv>
                 {Viewtrans(commentcount)}
            </Commentnumdiv>
            }
            
        
           
            
            </Showreplediv>
            

            <Likediv onMouseUp={(e)=>e.stopPropagation()}>

           <Heartback>

         
            {islike?
            <Hearticon onClick={()=>{onlike(post.id)}} icon={full} color="red" size="xl" fontSize={"20px"}/>
            :<Hearticon onClick={()=>{onlike(post.id)}} icon={empty} color="red"  size="xl" fontSize={"20px"}/>
            }
              </Heartback>
            <Likeviewtextdiv>
               {Viewtrans(likenum)}
            </Likeviewtextdiv>
         
             </Likediv>
             <Viewdiv>

            <Viewback>

           
            <Viewicon icon={view} size="xl"/>
             </Viewback>
            <Likeviewtextdiv>
             {Viewtrans(post.views)}         
            </Likeviewtextdiv>
              
              </Viewdiv>
             
      
              
            {isupdate&&<>
              <Twitformnoticeupdate noticeid={post.id} setIsupdate={setIsupdate}/>
              </>}
             

           

              </Noticefooter>
            
           
                {isreple&&
                <Replyarea onMouseUp={(e)=>e.stopPropagation()}>
                <Commentform
                  noticenum={post.id}
                  depth="0"
                  cnum=""
                  page={1}
                  onCreated={()=>setCommentcount((prev)=>prev+1)}
                />
                {commentcount>0&&
                <Showallcomment onClick={(e)=>{
                  e.stopPropagation();
                  navigate(`/notice/detail/${post.id}`)
                }}>
                  댓글 {Viewtrans(commentcount)}개 모두 보기
                </Showallcomment>}
                </Replyarea>}




        </Wrapper>
       
    )
}