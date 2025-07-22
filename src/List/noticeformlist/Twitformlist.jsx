import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { useState } from "react";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Twitcomment from "./Twitcomment";
import { useCookies } from "react-cookie";
import Twitformnoticeupdate from "./Twitformnoticeupdate";
import Noticelikes from "../../UI/Noticetools/Noticelikes";
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
import { faComment as comimo } from "@fortawesome/free-regular-svg-icons";



const Wrapper=styled.div`
    border:3px solid black;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.13s;  //부드럽게
&:hover{
  background: rgba(137, 200, 224, 0.15); //호버시색변경
 
  
}
`

const Noticedata=styled.div`
  display: flex;
  width: 100%;
`
const NoticeHeader=styled.div`
  //border: 1px solid red;
  display: flex;
  flex-direction: column;
  width: 100%;
  ;
`
const Profileview=styled.div`
    border: 1px solid black;

    width:45px;
    height:45px;
`
const Nameheader=styled.div`
// border: 1px solid blue;
 display: flex;
 height: 30px;
  width: 100%;
  border-bottom: 1px solid black;
`
const Nickname=styled.div`
 
  
  
 
`
const Username=styled.div`
 position: relative;
  color: gray;
  margin-left: 10px;
  
 
 // border: 1px solid yellow;
`

const Timecss=styled.div`
   position: relative;
   margin-left: 10px;
 
`

const Weatherdiv=styled.div`
  
`
const UsernameandEmaildiv=styled.div`
  display: flex;
`
const TitleCss=styled.div`
  display: flex;
`
const Title=styled.div`
  float: left;
  font-size:16px;
  margin-left:7px;
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
     display: flex;
  justify-content: center;  /* 가로(주축) 중앙 정렬 */
  align-items: center;      /* 세로(교차축) 중앙 정렬 */
    
    gap: 10px;
`
const Menucss=styled.div`
 //내부요소 오른쪽정렬
 // margin-left: auto;
   display: flex;
  justify-content: center;  /* 가로(주축) 중앙 정렬 */
  align-items: center;      /* 세로(교차축) 중앙 정렬 */
border-radius: 50%; 
  padding: 5px;
     transition: background 0.15s, box-shadow 0.13s;  //부드럽게
&:hover{
  background: rgba(54, 93, 221, 0.7); //호버시색변경
 
  
}
`

const NoticeMain=styled.div`
  position: relative;
`
const Textarea=styled.div`
border: 1px solid black;
  //height:500px;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 150px;
  max-height: ${(props)=>props.over?"none":"300px"};
`
const Blockcss=styled.div`
  border: 1px solid black;
  height:500px;
 
  overflow: hidden;
`
const Overflowdiv=styled.div`
  position: absolute;
 background-color: rgba(243, 240, 240, 0.2);
 z-index: 100px;
  width: 100%;
  bottom: 0px;
  height: 50px;
  
  text-align: center;
  vertical-align: middle;
  
  
`
//하단부
const Noticefooter=styled.div`
  display  :  flex;
 gap: 150px;
 border: 1px solid blue;
`
//
const Showreplediv=styled.div`
  position: relative;
  display: flex;
  
  padding-left: 40px;

  border-radius: 50%; 
       transition: background 0.15s, box-shadow 0.13s;  //부드럽게
&:hover{
  color: rgba(61, 105, 228, 0.7); //호버시색변경
 
  
}
  
`
const Commentnumdiv=styled.span`

  padding-left: 7px;
  font-size: 20px;
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

          transition: background 0.15s, box-shadow 0.13s;  //부드럽게
&:hover{
  color: rgb(255, 196, 255); //호버시색변경
 
  
}
  
  
 
`
const Likeviewtextdiv=styled.div`
  font-size: 20px;
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

  
        transition: background 0.15s, box-shadow 0.13s;  //부드럽게
&:hover{
  color: rgba(68, 199, 166, 0.7); //호버시색변경
 
  
}

  

  
  
`
//아이콘색깔 div를 따로하긴해야겠다
const Commenticon=styled(FontAwesomeIcon)`
  
` 
const CommentBack=styled.div`
  border-radius: 50%;

  /* 후광 배경용 ::after */
  &::after {
    content: "";
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-35%, -50%);
    width: 50%;       /* 기본 배경 원의 크기 (아이콘보다 큼) */
    height: 120%;
    border-radius: 50%;
    background: #1976d2;
    opacity: 0;
    transition: opacity 0.17s;
   // z-index: -1;       /* 아이콘 아래로! */
    pointer-events: none;
  }

  &:hover::after {
    opacity: 0.4;    /* 밝은 후광 추천, 0.15~0.25 사이에서 조정 */
  }
    &:hover {
    color: #fff;
  }
`
const Hearticon=styled(FontAwesomeIcon)`
 
`
const Heartback=styled.div`
    border-radius: 30%;

  /* 후광 배경용 ::after */
  &::after {
    content: "";
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-68%, -50%);
    width: 100%;       /* 기본 배경 원의 크기 (아이콘보다 큼) */
    height: 100%;
    border-radius: 50%;
    background: #e08c7d;
    opacity: 0;
    transition: opacity 0.17s;
   // z-index: -1;       /* 아이콘 아래로! */
    pointer-events: none;
  }

  &:hover::after {
    opacity: 0.4;    /* 밝은 후광 추천, 0.15~0.25 사이에서 조정 */
  }
    &:hover {
    color: #fff;
  }
`
const Viewicon=styled(FontAwesomeIcon)`

`
const Viewback=styled.div`
   border-radius: 30%;

  /* 후광 배경용 ::after */
  &::after {
    content: "";
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-100%, -50%);
    width: 60%;       /* 기본 배경 원의 크기 (아이콘보다 큼) */
    height: 100%;
    border-radius: 50%;
    background: #32c256;
    opacity: 0;
    transition: opacity 0.17s;
   // z-index: -1;       /* 아이콘 아래로! */
    pointer-events: none;
  }

  &:hover::after {
    opacity: 0.4;    /* 밝은 후광 추천, 0.15~0.25 사이에서 조정 */
  }
    &:hover {
    color: #fff;
  }
`

export default function Twitformlist(props){

    const {post}=props;
    const navigate=useNavigate();
    const [isreple,setIsreple]=useState(false);
    const [comments,setComments]=useState();
    const axiosinstance=CreateAxios();
    const [loginuser,setloginuser,removeloginuser]=useCookies();
    const [isupdate,setIsupdate]=useState(false)
    const [islike,setIslike]=useState(post.likeusercheck);
    const [likenum,setLikenum]=useState(post.likes)
    const [isblock,setIsblock]=useState(post.isblock)
     
    const [isSimpleprofile,setIsSimpleprofile]=useState(false);
    const [expend,setExpend]=useState(false);
    const Textref=useRef();

    const [textoverflow,setTextoverflow]=useState(false);

    const isDragging=useRef(false);

    
    //클릭시 내용크게
    useEffect(()=>{
      if(Textref.current){
        setTextoverflow(Textref.current.scrollHeight>Textref.current.clientHeight)
      }
    },[textoverflow])

    useEffect(()=>{
      if(loginuser.userinfo){
       // islikes(post.num);
      }
    },[])

 

    const showreply=()=>{
        console.log("쇼리플")
                               
        axios.get(`/open/comment/${post.num}`).then((res)=>{
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

 const postDelete=()=>{
    if(window.confirm("정말로삭제하시겠습니까?")){
      axiosinstance.delete(`/noticedelete/${post.num}`)
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
 const onlike=(id)=>{
  
  axiosinstance.get(`/noticelike/${id}`).then((res)=>{
   
    console.log("좋아요기능"+res.data)
    if(islike){
        setIslike(!islike)
        setLikenum(likenum-1)
    }
    else{
      setIslike(!islike)
      setLikenum(likenum+1)
    }
    
  }).catch(()=>{
    
    alert("오류")
  })
 }
//마우스위치
 const [xy,setXY]=useState({x:-1000,y:-1000})

const ProfileMouseEnter =(e)=>{

    setXY({x:e.clientX,y:e.clientY})
    
    setIsSimpleprofile(true);
  
}
const ProfileMouseLeave=()=>{
  setIsSimpleprofile(false)
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

 navigate(`/userpage/${post.username}`);
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
       
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+post.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%",background:"white"}}
          onMouseEnter={(e)=>ProfileMouseEnter(e)}
          onMouseLeave={(e)=>ProfileMouseLeave}
          onMouseUp={(e)=>{e.stopPropagation();}} 
          />
                
     </Profileview>
        <NoticeHeader >    
        

        
     <Nameheader >
      <UsernameandEmaildiv 
           onMouseEnter={(e)=>ProfileMouseEnter(e)}
          onMouseLeave={(e)=>ProfileMouseLeave}
         
          onMouseUp={(e)=>{e.stopPropagation();}} 
      >

    
      <Nickname>
        
          {post.nickname}
          
        </Nickname>
     <Username >
      {post.username}
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
      mousexy={xy} onmouseEnter={ProfileMouseEnter} onmouseLeave={ProfileMouseLeave}
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

 
         {isblock?
            <Blockcss>
            <img src={process.env.PUBLIC_URL+"/front/Subimages/noticeblock.png"}
              style={{objectFit:"cover", width:"100%",height:"100%"}}
            ></img>
            </Blockcss>
          
          
            :<>
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
            {
        //게시글메인끝 게시글푸터 =============================================
        }

        </>}
               </NoticeMain>
            <Noticefooter>
              <Showreplediv  onClick={()=>{setIsreple(!isreple)}}>
            
            <CommentBack>

           

            <Commenticon icon={ comimo} size="xl"/>
             </CommentBack>
            {post.commentcount >0&&
            <Commentnumdiv>
                 {Viewtrans(post.commentcount)}
            </Commentnumdiv>
            }
            
        
           
            
            </Showreplediv>
            

            <Likediv>

           <Heartback>

         
            {islike?
            <Hearticon onClick={()=>{onlike(post.num)}} icon={full} color="red" size="xl" fontSize={"20px"}/>
            :<Hearticon onClick={()=>{onlike(post.num)}} icon={empty} color="red"  size="xl" fontSize={"20px"}/>
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
            
           
                {isreple&&<>
               
                <Twitcomment  noticeid={post.id}/>
                </>}




        </Wrapper>
       
    )
}