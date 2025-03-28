import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function AdminSearchtools(props){

    const {searchdata,url,options}=props;
    const navigate=useNavigate();
    
      //셀렉트검색
      


  //데이터받을거
  const [searchdatas,setSearchdatas]=useState({
    option:searchdata?.option || options[0].value,
    keyword:searchdata?.keyword || ""
  });

  const search=()=>{
    console.log("검색시작"+searchdatas.option)
    console.log("검색시작키워드:"+searchdatas.keyword)
    navigate(url+`?page=1&option=${searchdatas.option}&keyword=${searchdatas.keyword}`)
   
  }
    
  return (
    <>
            
            <select 
            onChange={(e)=>{
        setSearchdatas((prev)=>({...prev,option:e.target.value}))
    }}>
        {options.map((option)=>{
            return (
                <option key={option.value}
                 value={option.value}
                >
                    {option.name}
                </option>
            )
        })}

    </select>
    <input type="text" value={searchdatas.keyword} onChange={(e)=>{
         setSearchdatas((prev)=>({...prev,keyword:e.target.value}))
    }}/>
    <button onClick={search}>검색</button>
    
   
    </>
  )

}

