import React from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from "../UI/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import Commentlist from "../List/Commentlist";
import Commentform from "./Commentform";
import { useState } from "react";
import SelectBox from "../UI/SelectBox";
import LoginPage from"../MemberPage/Loginpage";
import AuthCheck from "../customhook/authCheck";
import Detachlist from "../List/Detachlist";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";

const Wrapper=styled.div`
    color:"white"
padding: 50px;
position:relative;
left:28.5%;
border:1px solid;
width:43%;
height:1000px;
top:14%;
overflow: auto;

`

function NoticeDetail(props){

   const {backpagedata}=props;
  const navigate=useNavigate();
  //파람에서 가져오기 
  const detailnum=useParams();
  console.log(detailnum.num)
 /* const {
    state:{
    noti:{email,name,title,text,red},
  },
}=useLocation();라우터돔의 유스로케이션으로 navigate에state추가로 정보그냥옮겨짐 ;
 댓글작성시 리렌더링에 정보가안옮겨져서 그냥 데이터가져와야할듯?*/
 
const [loginuser,Setloginuser,removeloginuser]=useCookies()
const [noticedetail,Setnoticedetail]=useState([])
const [comments,Setcomments]=useState([])

const noticeurl=`/open/noticedetail/`+detailnum.num;
const commenturl=`/open/comment/`+detailnum.num;


/*
useEffect(()=>{
  axios.get(noticeurl  
  ).then((res)=>{
    Setnoticedetail(res.data)
  })
},[])

useEffect(()=>{
  axios.get(commenturl)
  .then((res)=>{
    setComments(res.data)
  })
},[])

//두개동시엔대 cors에러가나옴 이게되네 ㅋㅋ;
useEffect(()=>{
  axios.all([axios.get(noticeurl),axios.get(commenturl)])
  .then(axios.spread((res1,res2)=>{
    Setnoticedetail(res1.data)
    Setcomments(res2.data)
   
   
  }))
},[])
*/
//최상위에서선언..
const axiosinstance=CreateAxios()

useEffect(()=>{
  noticedetailget()
},[])

const noticedetailget=()=>{
  console.log(noticedetail)
  console.log(noticeurl)
  axios.get(noticeurl)
  .then((res)=>{
    console.log(res)
    Setnoticedetail(res.data)
    Setcomments(res.data.comments)
  })
}

const commentnull=()=>{
  if(!comments){
   return false
  }
  else{
    return true
  }
}

const emailcheck=()=>{
  
if(loginuser.userinfo){

  if(loginuser.userinfo.email===noticedetail.email){
    return true
  }
  else{
    return false
  }
}
else{
  return false
}

 
}
const backpage=()=>{

  props.setpagename("noticelist")
  props.setbackpagedata({
    currentpage:backpagedata.currentpage,
    keyword:backpagedata.keyword,
    selectoption:backpagedata.selectoption,

  })
  
}
//코멘트작성
const commentsubmit=(
  username,usernickname,comment,noticenum,depth,cnum
)=>{
  console.log("코멘트렌더링"+username+"닉"+usernickname+"코멘"+comment)
  
  
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
      noticedetailget();
    
    }).catch((error)=>{
        alert("코멘트에러!")
        console.log("코멘트에러")
    })
  
  }
  
}
//==============================코멘트업데이트========================


const updatetext=(commentid,commentusername,updatecomment)=>{
  
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
     noticedetailget()
     
     
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
          noticedetailget()
          
    }).catch((error)=>{
      alert('삭제요청실패')
    
    })
    return false;
 }

return(
  <Wrapper>
   
  <div>
    
    글번호:{noticedetail.num} <br/>
    이멜:{noticedetail.username}<br/>
    이름:{noticedetail.nickname}<br/>
    제목:{noticedetail.title}<br/>
   
    
    내용:<h4 dangerouslySetInnerHTML={{__html:noticedetail.text}}></h4><br/>
    날짜:{noticedetail.red}<br/>

    첨부파일:{noticedetail.detachfiles && <Detachlist detachlist={noticedetail.detachfiles}  />}
    
    
    
  
    <br/>
    {emailcheck()?
      <div>
        
    <Button title="수정" onClick={()=>{
      console.log("수정"+noticedetail.num)
      navigate(`/noticeupdate/${noticedetail.num}`)
      
      }}
      />
    
    
      <Button title="삭제" onClick={()=>{
        console.log(loginuser)
        axiosinstance.delete(`/noticedelete/${noticedetail.num}`
          
        )
        .then((res)=>{
          alert("삭제하였습니다")
                   
    navigate("/notice")

        })
        .catch((error)=>{
          alert("에러가..")
        })
       
    }}
        />
    
  </div>
  :""

}
----------------------------------------------------------------------------------------------
댓글
{commentnull()?

<Commentlist comments={comments} noticeid={noticedetail.num}
commentcreate={commentsubmit}
commentupdate={updatetext}
commentdelete={commentdelete}
/>
:""

}
<br/>
--------------------------------------------------------------------------------------------------
<Commentform 
  
  noticenum={noticedetail.num}
  
  depth="0"
  cnum=''
  commentsubmit={commentsubmit}
  />
<br/>




</div>
  
</Wrapper>
)}


export default NoticeDetail;
