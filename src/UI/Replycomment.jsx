import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Button from "./Button";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthCheck from "../customhook/authCheck";
import Replycommentitem from "./Replycommentitem";
import Commentlistitem from "../List/Commentlistitem";
import CreateAxios from "../customhook/CreateAxios";

function Replycomment(props){
  const{commentslist,parentid,commentupdate,commentdelete,formstyle} =props
  const[loginuser,Setloginuser,removeloginuser]=useCookies();
  const [isupdate,Setisupdate]=useState(false);
  const [updatecomment,Setupdatecomment]=useState();
  const navigate=useNavigate();
  const [islogin,Setislogin]=useState(false);
  const axiosinstance=CreateAxios();
  const url=`/commentupdate`

  

 

  return(
    <div>
      {
   commentslist.map((comment,index)=>{
   
    return(
      <React.Fragment>
          {
          parentid===comment.cnum &&
          <Replycommentitem comment={comment}
          commentupdate={commentupdate}
                  commentdelete={commentdelete}
              formstyle={formstyle}
          />
          
           
           }
            
        
        

      </React.Fragment>

    )
  }
   )
}
   </div>

  )

 



      
  


}

export default Replycomment