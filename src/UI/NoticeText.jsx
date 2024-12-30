import React from "react";
import { useNavigate } from "react-router-dom";

function NoticeText(props){
const {title,onClick}=props


  return(
    <React.Fragment>
      <h2 onClick={onClick}   
    >{title}</h2>

    </React.Fragment>
  )
}
export default NoticeText;