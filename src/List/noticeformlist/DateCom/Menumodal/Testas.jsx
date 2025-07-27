
import React from "react";


export default function Testas(props){
const {menuclose,ismenu,setismenu}=props;

return (
    <>
    <button onClick={menuclose}>
        메뉴닫기
    </button>
     <button onClick={()=>setismenu(!ismenu)}>
        클릭질 {ismenu?"true":"false"}
    </button>
    </>
)

}

