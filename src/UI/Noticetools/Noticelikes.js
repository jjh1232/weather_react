import React from "react";
import CreateAxios from "../../customhook/CreateAxios";


export default function Noticelikes(noticeid){

    const axiosinstance=CreateAxios();

    console.log("좋아요실행"+noticeid)
    
    axiosinstance.get(`/noticelike/${noticeid}`).then((res)=>{
     console.log("좋아요기능"+res.data)
       
       }).catch(()=>{
          
          alert("오류")
        })
    

}