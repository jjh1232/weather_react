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
const Menucss=styled.div`
 //내부요소 오른쪽정렬
  margin-left: auto;
`
const Weatherdiv=styled.div`
  
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
const Weatherdata =styled.div`
    position: relative;
    right:0px;
    
    //border:1px solid yellow;
    margin-left: auto;
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
  
  padding-left: 40px;
`
const Commentnumdiv=styled.span`
position: absolute;
  top: -6px;
  right: -6px;
  background: red;
  color: white;
  border-radius: 50%;
  //min-width: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
  padding: 0 6px;
  box-sizing: border-box;
  z-index: 1;

`

const Likediv=styled.div`
 
  gap: 5px;
  display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  text-align: center;
  
 
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
 
  gap: 5px;
    display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  text-align: center;
  
`

export default function Twitformlist(props){

    const {post}=props;
    const navigate=useNavigate();
    const [isreple,setIsreple]=useState(false);
    const [ismenu,setIsmenu]=useState(false);
    const [comments,setComments]=useState();
    const axiosinstance=CreateAxios();
    const [loginuser,setloginuser,removeloginuser]=useCookies();
    const [isupdate,setIsupdate]=useState(false)
    const [islike,setIslike]=useState(post.likeusercheck);
    const [likenum,setLikenum]=useState(post.likes)
    const [isblock,setIsblock]=useState(post.isblock)
    const menuref=useRef();
     const [ishover,setIshover]=useState(false);
    const [onprepage,setOnprepage]=useState(false);
    const [expend,setExpend]=useState(false);
    const Textref=useRef();

    const [textoverflow,setTextoverflow]=useState(false);

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
    useEffect(()=>{
      const noticemenuoutside=(e)=>{
       
        if(menuref.current && !menuref.current.contains(e.target)){
          setIsmenu(false);
        }
      }
      document.addEventListener('mousedown', noticemenuoutside);
  return () => {
    document.removeEventListener('mousedown', noticemenuoutside);
  };
    },[])
    const showreply=()=>{
        console.log("쇼리플")
                               
        axios.get(`/open/comment/${post.num}`).then((res)=>{
            setComments(res.data)
            console.log(res.data)
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
 //==========================로그인좋아요 여부체크?==========================
 /*
 const islikes=(num)=>{
  
 console.log(num)
  axiosinstance.get(`/noticelikecheck/${num}`)
  .then((res)=>{
    setIslike(res.data);

  }).catch(()=>{
    
    
  })
  
}
  */
const simpleprofile =(e)=>{
  if(ishover){
    
    
  }else{
    setXY({x:e.clientX,y:e.clientY})
    setIshover(true)
    setOnprepage(true)
  }
}
//날씨=====================================================
// 1. 날씨 관련 key만 모아둔 배열
const weatherKeys = ['sky', 'rain', 'pty', 'temp', 'reh', 'wsd'];

// 2. 전체 데이터에서 날씨 데이터만 추출
const weatherData = weatherKeys.map(key=>({
  type:key,
  value:post?.[key]
}))
//==========================렌더링==============================
    return (
      
    
        <Wrapper>
        {
        //유저프로필=============================================
        }
        <Noticedata>
        <Profileview className={ishover?"profileover":"profile"}
        onMouseEnter={(e)=>simpleprofile(e)
        
         }
        onMouseOut={()=>{setIshover(false)}}
        onClick={()=>{
          navigate(`/userpage/${post.username}`);
        }}>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+post.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%",background:"white"}}
  
                />
                
     </Profileview>
        <NoticeHeader >    
        

        
     <Nameheader >
      <Nickname className={ishover?"profileover":"profile"}
        onMouseEnter={(e)=>simpleprofile(e)
        
         }
        onMouseOut={()=>{setIshover(false)}}
        onClick={()=>{
          navigate(`/userpage/${post.username}`);
        }}>
        
          {post.nickname}
          
        </Nickname>
     <Username className={ishover?"profileover":"profile"}
        onMouseEnter={(e)=>simpleprofile(e)
        
         }
        onMouseOut={()=>{setIshover(false)}}
        onClick={()=>{
          navigate(`/userpage/${post.username}`);
        }}>{post.username}</Username>
     <Timecss>
     <Datefor inputdate={post.red}/>
     </Timecss>

     <Weatherdata>
                    
                    {weatherData.map((data,key)=>(
                      <NoticeWeathericon type={data.type} value={data.value} key={key}/>
                    ))}
                      </Weatherdata>    
                 
                    <Menucss ref={menuref}>
                    <FontAwesomeIcon 
                    onClick={()=>{
                        setIsmenu(!ismenu)
                    }}
                    style={{border:"1px solid black"}} icon={faEllipsis} fontSize={"25px"}/>
                   
                    {ismenu&&     <Noticemenu deletemethod={postDelete} updatemethod={postUpdate}

                     noticeuser={post.username}
                     noticeid={post.num}
                     setisblock={setIsblock}
                     isclose={setIsmenu}
                     />}
                
                    
                    </Menucss>      
              
                 
            
     </Nameheader>

     {onprepage?<><Simpleprofile
      username={post.username} nickname={post.nickname} profileimg={post.userprofile}
      mousexy={xy} setprepage={setOnprepage}
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
            over={expend} 
            >

                
              </Textarea>}
          {textoverflow&&!expend&&<Overflowdiv onClick={()=>setExpend(!expend)}>
                더보기
                </Overflowdiv>}  
            {
        //게시글메인끝 게시글푸터 =============================================
        }

        </>}
               </NoticeMain>
            <Noticefooter>
              <Showreplediv  onClick={()=>{setIsreple(!isreple)}}>
            
            <FontAwesomeIcon icon={ comimo} size="2x"/>
            {post.commentcount >0&&
            <Commentnumdiv>
                 {post.commentcount > 99 ? '99+' :post.commentcount}
            </Commentnumdiv>
            }
            
        
           
            
            </Showreplediv>
            

            <Likediv>

           
            {islike?
            <FontAwesomeIcon onClick={()=>{onlike(post.num)}} icon={full} color="red" size="xl" fontSize={"20px"}/>
            :<FontAwesomeIcon onClick={()=>{onlike(post.num)}} icon={empty} color="red"  size="xl" fontSize={"20px"}/>
            }
            <Likeviewtextdiv>
               {Viewtrans(likenum)}
            </Likeviewtextdiv>
         
             </Likediv>
             <Viewdiv>

            
            <FontAwesomeIcon icon={view} size="xl"/>
            <Likeviewtextdiv>
             {Viewtrans(post.views)}         
            </Likeviewtextdiv>
              
              </Viewdiv>
             
      
              
            {isupdate&&<>
              <Twitformnoticeupdate noticeid={post.num} setIsupdate={setIsupdate}/>
              </>}
             
              {isreple&&<>
                <Twitcomment  noticeid={post.num}/>
                </>}

              </Noticefooter>
            
           





        </Wrapper>
       
    )
}