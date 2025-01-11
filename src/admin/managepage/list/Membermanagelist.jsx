import React, { useState } from "react";
import AdminUpdateform from "../../../customhook/Admintools/AdminUpdateform";


export default function Membermanagelist(props){
    const {data,key,deletemember}=props

    const [isupdate,setIsupdate]=useState(false);



    return(<>
        {isupdate?<AdminUpdateform 
        setIsupdate={setIsupdate} currentdata={data}/>:""}
        <tbody key={key}>
            <tr >
                
                <td>{data.id} </td>
                <td>{data.username} </td>
                <td>{data.nickname} </td>
                
                <td>{data.provider}</td>
                <td>{data.role}</td>
                <td>{data.homeaddress.juso}</td>
                <td>{data.usernotice}</td>
                <td>{data.usercomments}</td>
                <td>{data.userchatroom}</td>
                <td>{data.red} </td>
               
                <td>
                <button onClick={()=>{setIsupdate(true)}}>회원정보수정</button> &nbsp;
                <button onClick={()=>{deletemember(data.id)}}>회원삭제</button>
                </td>
                </tr>
              
                </tbody>
            
                </>
    )
}