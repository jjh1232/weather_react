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

const Wrapper=styled.div`
    border:1px solid yellow;
    
`

const Noticedata=styled.div`
  display: flex;
  width: 100%;
`
const NoticeHeader=styled.div`
  border: 1px solid red;
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
 border: 1px solid blue;
 display: flex;
 height: 40px;
  width: 100%;
`
const Nickname=styled.div`
 
  
  
  
  border: 1px solid green;
`
const Username=styled.div`
 position: relative;
  color: gray;
  
  border: 1px solid yellow;
`

const Timecss=styled.div`
   position: relative;
   border: 1px solid black;
`
const Menucss=styled.div`
 //내부요소 오른쪽정렬
  margin-left: auto;
`
const TitleCss=styled.div`
  display: flex;
`
const Title=styled.div`
  float: left;
  border: 1px solid blue;
`
const Weatherdata =styled.div`
    position: relative;
    right:0px;
    border:1px solid yellow;
`
const Textarea=styled.div`
border: 1px solid blue;
  height:500px;
  text-overflow: ellipsis;
  overflow: hidden;
`
const Noticefooter=styled.div`
  
`
export default function Twitformlist(props){

    const {key,post}=props;
    const navigate=useNavigate();
    const [isreple,setIsreple]=useState(false);
    const [ismenu,setIsmenu]=useState(false);
    const [comments,setComments]=useState();
    const axiosinstance=CreateAxios();
    const [loginuser,setloginuser,removeloginuser]=useCookies();
    const [isupdate,setIsupdate]=useState(false)
    const [islike,setIslike]=useState(post.likeusercheck);
    const [likenum,setLikenum]=useState(post.likes)
    const menuref=useRef();
     const [ishover,setIshover]=useState(false);
    const [onprepage,setOnprepage]=useState(false);

    useEffect(()=>{
        if(isreple){
            console.log("트루")
            showreply();
        }else{
            console.log("폴스")

        }

    },[isreple])

    useEffect(()=>{
      if(loginuser.userinfo){
       // islikes(post.num);
      }
    },[])
    useEffect(()=>{
      const noticemenuoutside=(e)=>{
        console.log("마우스다운이벤트")
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
    
   

    }
    //=============================코멘트작성=============================
    const commentsubmit=(
      username,usernickname,comment,noticenum,depth,cnum
    )=>{
      console.log("시작왜리렌더링")
      
      
      if(comment===''){
        alert("글을작성해주십시오")
      }
      else{
        
        axiosinstance.post("/commentcreate",{
          noticeid:noticenum,
          depth:depth,
          cnum:cnum,
          username:username,
          nickname:usernickname,
          text:comment,
          

        }).then((res)=>{
                      
          alert("작성완료")
          showreply()
        
        }).catch((error)=>{
            alert("코멘트에러!")
            console.log("코멘트에러")
        })
      
      }
      
    }

  //==============================코멘트업데이트========================


const commentupdate=(commentid,commentusername,updatecomment)=>{
  
  if(updatecomment===undefined){
   alert("바뀐내용을입력해주세요")
  }
  else if(updatecomment===''){
   alert("빈칸은입력할수없습니다")
  }
  else{
   axiosinstance.put(`/commentupdate`,{
     id:commentid,
     username:commentusername,
     text:updatecomment

   }).then((res)=>{
     alert("성공적으로변경하였습니다")
     showreply()
     
     
   }).catch((err)=>{
    alert("수정못햇음")

   })
   
 }
 return false;
}


//============================코멘트삭제==============================
const commentdelete=(id)=>{
  console.log("해당댓글삭제!"+id)
    axiosinstance.delete(`/commentdelete/${id}`).then((res)=>{
          alert("성공적으로삭제하였습니다")
          showreply()
          
    }).catch((error)=>{
      alert('삭제요청실패')
    
    })
    return false;
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
   style={{objectFit:"fill",width:"100%",height:"100%"}}
  
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
     </Timecss> {post.isblock?"true":"false"}
                    
                    <Menucss ref={menuref}>
                    <FontAwesomeIcon 
                    onClick={()=>{
                        setIsmenu(!ismenu)
                    }}
                    style={{border:"1px solid black"}} icon={faEllipsis} fontSize={"25px"}/>
                   
                    {ismenu&&     <Noticemenu deletemethod={postDelete} updatemethod={postUpdate}
                     isowner={loginuser.userinfo?post.username===loginuser.userinfo["username"]?true:false:false}
                     username={loginuser.userinfo?loginuser.userinfo["username"]:""}
                     nickname={loginuser.userinfo?loginuser.userinfo["nickname"]:""}
                     noticeuser={post.username}
                     noticeid={post.num}
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
            
            <Weatherdata>{post.temp }{post.pty}{post.sky}{post.rain}</Weatherdata>
            </TitleCss>
            
            
            </NoticeHeader>
            </Noticedata>
            {
        //게시글 헤더끝 메인시작=============================================
        }
            {<Textarea dangerouslySetInnerHTML={{__html:post.text}}></Textarea>}

            {
        //게시글메인끝 게시글푸터 =============================================
        }
            <Noticefooter>
            <button onClick={()=>{
                setIsreple(!isreple)
            }
            }>
            showreply
            </button>
            {islike?
            <FontAwesomeIcon onClick={()=>{onlike(post.num)}} icon={full} color="red" fontSize={"20px"}/>
            :<FontAwesomeIcon onClick={()=>{onlike(post.num)}} icon={empty} color="red" fontSize={"20px"}/>
            }
            {likenum}
            
          
            
            
            {isreple&&<>
                <Twitcomment comments={comments} noticeid={post.num} 
                commentcreate={commentsubmit}
                commentupdate={commentupdate}
                commentdelete={commentdelete}
                />
                </>}
            
              
            {isupdate&&<>
              <Twitformnoticeupdate noticeid={post.num} setIsupdate={setIsupdate}/>
              </>}
             
              </Noticefooter>
            
           
<br/>




        </Wrapper>
       
    )
}