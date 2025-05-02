import React, { useEffect, useState } from "react";
import Commentform from "../../Noticepage/Commentform";
import styled from "styled-components";
import Replycomment from "../../UI/Replycomment";
import { useCookies } from "react-cookie";
import Button from "../../UI/Button";
import Datefor from "./DateCom/Datefor";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown as downbutton } from "@fortawesome/free-solid-svg-icons";
import { faCaretUp as upbutton } from "@fortawesome/free-solid-svg-icons";

const Wrapper=styled.div`
    display: flex;
    border: 1px solid red;
    max-height: ${(props)=>props.over?"none":"120px"};
    overflow: hidden;
    transition: max-height 0.3s;
`
const Profilediv=styled.div`
    border: 1px solid blue;
    width: 50px;
`
const MainDiv=styled.div`
    display: flex;
    flex-direction: column;
    border:1px solid black;
    flex:1;
    position: relative;
`
const MainHeader=styled.div`
    display: flex;
    border: 1px solid blue;
    gap: 5px;
`
const Usernamediv=styled.div`
    font-size: 17px;
    color: black;
`
const Useremaildiv=styled.div`
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#353535f4;
`
const Timediv=styled.div`
   
`
const Replediv=styled.div`
    margin-left: auto;
    border: 1px solid red;
`
const Upanddeletediv=styled.div`
    
    border: 1px solid red;
`
const MainText=styled.div`
    border: 1px solid green;
    
   // overflow: hidden;
`
const Overflowdiv=styled.div`
    
    border: 1px solid blue;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    //pointer-events: none ;//클릭방해;
    color: white;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 16%;
    background: linear-gradient(
    
    rgba(0, 0, 0, 0.7) 100%
  );
`
const Overlayblow=styled.div`
        width: 100%;
    //pointer-events: none ;//클릭방해;
    color: white;
    
    z-index: 1;
    display: flex;
    //flex:1;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 12%;
    margin-top: auto;
    background: linear-gradient(
    
    rgba(0, 0, 0, 0.7) 100%
    )
`

const Profileview=styled.div`
    border:1px solid;
  
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

//접기늘리기버튼
const commentref=useRef(null);
const [isoverflow,setIsoverflow]=useState(false);
const [expanded,setExpanded]=useState(false);

useEffect(()=>{
if(commentref.current){
    //비교
    setIsoverflow(commentref.current.scrollHeight>commentref.current.clientHeight);

}


},[isoverflow,expanded])

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
    <Wrapper ref={commentref} over={expanded}>
  
    <Profilediv>
        <Profileview>
    <img   src={process.env.PUBLIC_URL+"/userprofileimg"+comment.userprofile}
   style={{objectFit:"fill",width:"100%",height:"100%",backgroundColor:"white"}}
  
                />
                
     </Profileview>
     </Profilediv>
     <MainDiv  >
    <MainHeader>
    <Usernamediv>
    {comment.nickname}
    </Usernamediv>
    <Useremaildiv>
     {comment.username}
     </Useremaildiv>
     <Timediv>
     
     <Datefor inputdate={comment.redtime} colors={"black"}/>
     </Timediv>
     <Replediv onClick={()=>{
        setIsreple(!isreple)
    }}>
     답글달기
     </Replediv>
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

    {isoverflow&&!expanded &&<Overflowdiv onClick={()=>setExpanded(true)}>
    <FontAwesomeIcon icon={downbutton} size="2x"/>
    </Overflowdiv>}
    {expanded &&<Overlayblow onClick={()=>setExpanded(false)}>
    <FontAwesomeIcon icon={upbutton} size="2x"/>
    </Overlayblow>}
   
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
