import React from "react";
import AuthCheck from "../../../customhook/authCheck";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAxios from "../../../customhook/CreateAxios";

export default function CommentUpdatelogic(){

   

    const queryclient=useQueryClient();
    const axiosinstance=CreateAxios();

    const mutation=useMutation({
        mutationFn:({commentid,username,text})=> 
            axiosinstance.put("/commentupdate",{
                id:commentid,
                username:username,
                text:text
            })
            
        
        ,
        //첫번째데이터반환값인데없어도써야한다함
        onSuccess:(_data,variables)=>{
            alert("수정완료")
            
            queryclient.invalidateQueries(["comments",variables.noticeid,variables.page])
        },
        onError:()=>{
            alert("수정오류")
        }
    })
  

    return mutation;
    
}