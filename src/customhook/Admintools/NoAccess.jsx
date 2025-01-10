import React from "react";
import { useNavigate } from "react-router-dom";


export default function NoAccess(){
    const navigate=useNavigate();

    return (
        <>
        <h3>
            회원권한이 없는 페이지입니다!
        </h3>
        <button onClick={()=>{
            navigate("/")
        }}>
           홈으로 돌아가기
        </button>
        </>
    )
}