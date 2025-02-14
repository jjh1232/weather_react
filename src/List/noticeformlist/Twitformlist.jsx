import React, { useEffect } from "react";
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

const Wrapper=styled.div`
    border:1px solid yellow;

`
const Weatherdata =styled.div`
    text-align: right;
`
const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
const Userdata=styled.div`
  border: 1px solid red;
`
const NoticeHeader=styled.div`
  
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

    const [comments,setComments]=useState();
    const axiosinstance=CreateAxios();
    const [loginuser,setloginuser,removeloginuser]=useCookies();
    const [isupdate,setIsupdate]=useState(false)
    const [islike,setIslike]=useState(post.likeusercheck);
    const [likenum,setLikenum]=useState(post.likes)

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
      <div>
    
        <Wrapper>
        {
        //유저프로필=============================================
        }
        <Userdata className={ishover?"profileover":"profile"}
        onMouseEnter={(e)=>simpleprofile(e)
        
         }
        onMouseOut={()=>{setIshover(false)}}
        onClick={()=>{
          navigate(`/userpage/${post.username}`);
        }}
       
        > {onprepage?"트루":"false"}

        <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+post.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%"}}
  
                />
                
     </Profileview>
     {post.nickname}@{post.username}

     {onprepage?<><Simpleprofile
      username={post.username} nickname={post.nickname} profileimg={post.userprofile}
      mousexy={xy} setprepage={setOnprepage}
      /></>:""}
     </Userdata>
     
     {
     //===============================유저프로필종료================
     }
      <NoticeHeader>
          <Weatherdata>{post.temp }{post.pty}{post.sky}{post.rain}</Weatherdata>
          
            
            {post.title}
            
            <Datefor inputdate={post.red}/>
            
            
            </NoticeHeader>
            {<Textarea dangerouslySetInnerHTML={{__html:post.text}}></Textarea>}

            
            <Noticefooter>
            <button onClick={()=>{
                setIsreple(!isreple)
            }
            }>
            showreply
            </button>

            <button onClick={()=>{onlike(post.num)}}>좋아요</button>
            {likenum}
            
            {islike?"true":"false"}
            
            
            {isreple&&<>
                <Twitcomment comments={comments} noticeid={post.num} 
                commentcreate={commentsubmit}
                commentupdate={commentupdate}
                commentdelete={commentdelete}
                />
                </>}
            
                {loginuser.userinfo&&                        
                  post.username===loginuser.userinfo["username"]&&                    
                    <>
                    <button onClick={postUpdate}>수정하기</button>
                    <button onClick={postDelete}>삭제하기</button>
                    </>      
              
                    
            }
            {isupdate&&<>
              <Twitformnoticeupdate noticeid={post.num} setIsupdate={setIsupdate}/>
              </>}
             
              </Noticefooter>
            
           
<br/>




        </Wrapper>
        </div>
    )
}