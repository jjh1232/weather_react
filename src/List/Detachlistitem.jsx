import axios from "axios";
import React from "react";
import { API_BASE } from "../config/api";
import { detachimage } from "../UI/profileimage";

function Detachlistitem(props){

    const {detach,onClick}=props;

    const detachdown=()=>{
        console.log("첨부다운")
        axios.post(`${API_BASE}/open/getdetach`,{
   
        uri:detach.path,
        filename:detach.filename
    },
    {responseType:`blob`}
    ).then((res)=>{
        
        console.log("오호이"+res.headers["content-disposition"].replace("attachment; filename=",""))
        
        const url=window.URL.createObjectURL(new Blob([res.data]));
        
        const link=document.createElement("a")
        link.href=url;
       
        
        document.body.appendChild(link);
        link.download=detach.filename
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
             
       
    }).catch((error)=>{
        console.log("에러")
    })
    
    }
    //리액트에서 만 다운
    const downloadfiles=async(path,filename)=>{
        //업로드된 첨부파일은 프론트 정적 자산이 아니라 백엔드가 내보내는 파일이다.
        //PUBLIC_URL 을 쓰면 배포했을 때 프론트 도메인을 가리켜 404 가 난다.
        //첨부 경로는 이미 절대주소로 저장돼 있다. API_BASE 를 또 붙이면 주소가 깨진다.
        const url= detachimage(path);
        const download=document.createElement(`a`);

        download.href=url;
        download.setAttribute('download', filename);
        download.setAttribute('type', 'application/json');
        download.click();
    }
    return(
        <>
        <a onClick={()=>{downloadfiles(detach.path,detach.filename)}} >
        {detach.filename}
        </a>

        <a href={`${API_BASE}/open/atagdown?path=${detach.path}`}>
            고정태그{detach.filename}
            </a>
        <button onClick={detachdown}>axios다운</button>
            </>
    )


}
export default Detachlistitem;