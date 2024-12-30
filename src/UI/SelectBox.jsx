import React, { useState } from "react";
import axios from "axios";
function SelectBox(props){
  const {options,onClick}=props
  const [text,Settext]=useState();
  const [selectoption,Setselectoption]=useState(options[0].value);
  const [page,Setpage]=useState(1)

  const url=`https://localhost:8081/noticesearch`

  const submit=()=>{

    axios.get(url,{
      params:{
        page:page,
      option:selectoption,
      keyword:text
      }
    }).then((res)=>{

    })
  }

    return (
      <form>
      <select onChange={(e)=>{Setselectoption(e.target.value)}}>
        
          {options.map((option)=>{
            return(
            <option key={option.value}
            value={option.value}
            defaultValue={option.defaultValue}
            
            >
              
              {option.name}
            </option>
            )
          })}

      </select>
      <input type="text" value={text} onChange={(e)=>{
        Settext(e.target.value)
        
      }}/>
      
      <button onClick={onClick}>검색</button>
      </form>
    )



}
export default SelectBox;