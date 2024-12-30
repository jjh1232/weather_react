import axios from "axios";
import React from "react";

function Detachlistitem(props){

    const {detach,onClick}=props;

    const detachdown=()=>{
        console.log("첨부다운")
        axios.post("http://localhost:8081/open/getdetach",{
   
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
        const url= process.env.PUBLIC_URL+path;
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

        <a href={`http://localhost:8081/open/atagdown?path=${detach.path}`}>
            고정태그{detach.filename}
            </a>
        <button onClick={detachdown}>axios다운</button>
            </>
    )


}
export default Detachlistitem;