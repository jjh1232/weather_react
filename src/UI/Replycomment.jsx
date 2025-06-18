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
  const{commentslist,parentid,commentupdate,commentdelete,formstyle,noticeid,page,comment} =props
  const[loginuser,Setloginuser,removeloginuser]=useCookies();
  const [isupdate,Setisupdate]=useState(false);
  const [updatecomment,Setupdatecomment]=useState();
  const navigate=useNavigate();
  const [islogin,Setislogin]=useState(false);
  const axiosinstance=CreateAxios();
  const url=`/commentupdate`

  

 

  return(
   
    
      <React.Fragment >
          
           
          <Replycommentitem comment={comment}
          noticeid={noticeid}
          page={page}
          //commentupdate={commentupdate}
               //   commentdelete={commentdelete}
             // formstyle={formstyle}
          />
          
           
           
            
        
        

      </React.Fragment>

    
  
   )
}
 export default Replycomment

  

 



      
  




