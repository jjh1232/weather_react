import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Commentform from "../Noticepage/Commentform";

import styled from "styled-components";

import Replycomment from "../UI/Replycomment";
import Commentupdateitem from "./noticeformlist/Commentupdateitem";
import Commentview from "./noticeformlist/Commentview";

const Wrapper=styled.div`
  display: flex;
border-bottom:1px solid gray;
gap: 5px;
padding-top: 5px;
padding-bottom: 8px;

`

function Commentlistitem(props){

  const {data,noticeid, page}=props
  const [replyclick,Setreplyclick]=useState(false);
  
  const [isupdate,Setisupdate]=useState(false) 
  
  
  
  

 

  return (
    <React.Fragment>
      {isupdate?<Wrapper className="isupdate">
        <Commentupdateitem data={data} Setisupdate={Setisupdate} noticeid={noticeid} page={page}/>
        </Wrapper>
      :<Wrapper  onClick={()=>{
        Setreplyclick(!replyclick)
    }}>
    <Commentview data={data} Setisupdate={Setisupdate} noticeid={noticeid} page={page} />
      
</Wrapper>
}
    {replyclick?
          <Commentform 
           
           noticenum={noticeid}
           
           depth="1"
           cnum={data.id}
           page={page}
             />
             :""}

          {data.childs&&data.childs.map((coment,key)=>{
           
            return (
    <Replycomment parentid={coment.id} 
                     noticeid={noticeid}
                   page={page}
                comment={coment}
                 key={key}
                 />
            )
          }

          )
     
          }
    </React.Fragment>


  )
}
export default Commentlistitem;