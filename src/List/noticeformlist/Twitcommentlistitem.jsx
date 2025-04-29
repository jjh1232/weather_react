import React, { useEffect, useState } from "react";
import Commentform from "../../Noticepage/Commentform";
import styled from "styled-components";
import Replycomment from "../../UI/Replycomment";
import { useCookies } from "react-cookie";
import Button from "../../UI/Button";
const Wrapper=styled.div`
    display: flex;

`
const Profilediv=styled.div`
    
`
const MainDiv=styled.div`
    display: flex;
    flex-direction: column;
`
const MainHeader=styled.div`
    display: flex;
`
const Usernamediv=styled.div`
    
`
const Useremaildiv=styled.div`
    
`
const Timediv=styled.div`
    
`
const Upanddeletediv=styled.div`
    
`
const MainText=styled.div`
    
`

const Profileview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
export default function Twitcommentlistitem(props)
{
const {comment,noticeid,commentsubmit,commentupdate,commentdelete} =props;
const [isreple,setIsreple]=useState(false);
const [isupdate,setIsupdate]=useState(false);
const [isusercheck,setIsusercheck]=useState(false);
const [loginuser,setloginuser,removeLoginuser]=useCookies();
const [updatecomment,Setupdatecomment]=useState();
useEffect(()=>{
    if(loginuser.userinfo){
       if(loginuser.userinfo.username==comment.username){
        setIsusercheck(true)
       }
    }else{
        setIsusercheck(false)
    }
},[])



return (
    <>
    
    ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    <br/>
    {isupdate?<>
        <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%"}}
  
                />
                
     </Profileview>
    {comment.nickname}님  @{comment.username}

    
    <br/>
    
    <input type="text" defaultValue={comment.text} onChange={(e)=>{Setupdatecomment(e.target.value)}} /><br/>
    <br/>
    {comment.redtime}
    <br/>
   
    <Button title="수정완료" onClick={(e)=>{
                    
                    setIsupdate(commentupdate(comment.id,comment.username,updatecomment,e))
                  
                  }}
                    />
                  <Button title="취소" onClick={()=>{setIsupdate(false)}}/>
    </>
    :
    <Wrapper>
  
    <Profilediv>
        <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%"}}
  
                />
                
     </Profileview>
     </Profilediv>
     <MainDiv  onClick={()=>{
        setIsreple(!isreple)
    }}>
    <MainHeader>
    <Usernamediv>
    {comment.nickname}
    </Usernamediv>
    <Useremaildiv>
     {comment.username}
     </Useremaildiv>
     <Timediv>
     {comment.redtime}
     </Timediv>
     <Upanddeletediv>
     {isusercheck?<>
    <Button title="수정" onClick={()=>{
                    setIsupdate(true)
            }}/>
             <Button title="삭제" onClick={()=>{
              if(window.confirm("정말로삭제하시겠습니까")){
              commentdelete(comment.id);
              }
            }}/>
            </>:<>
            
            </>}
            </Upanddeletediv>
    </MainHeader>
    <MainText>
    {comment.text}
    </MainText>

    
  
   
    </MainDiv>
     </Wrapper>}
    {isreple&&<>
        <Commentform 
        noticenum={noticeid}
        depth="1"
        cnum={comment.id}
        commentsubmit={commentsubmit}
        />
       
</>
    }
    
    </>
)
}
