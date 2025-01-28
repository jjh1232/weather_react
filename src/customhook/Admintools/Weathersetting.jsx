import { useState } from "react";

export const Sky=(props)=>{

    const {setskyvalue,devalue}=props;
    const options = [
        {value:"1",name:"맑음"}, 
        {value:"3",name:"구름맑음"},
        {value:"4",name:"흐림"} 
        
      ]
      let defaultvalue=``
   switch(devalue){
        case "맑음":
            defaultvalue= "1"
            break;
        case "구름맑음":
            defaultvalue= "3"
            break;
        case "흐림":
            console.log("흐림임!")
            defaultvalue= "4"
            break;
    }
    console.log("디폴트:"+defaultvalue)
     // const value=useState()
      const onHandler=(e)=>{
        setskyvalue(e.currentTarget.value)
      }
    return (
        <select onChange={onHandler} value={defaultvalue}>
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
    )
}

export const Pty=(props)=>{
    const {setptyvalue,devalue}=props;
    const options = [
        {value:"0",name:"맑음"}, 
        {value:"1",name:"비"},
        {value:"2",name:"비/눈"},
        {value:"3",name:"눈"}, 
        {value:"5",name:"빗방울"},
        {value:"6",name:"빗방울/눈날림"} ,
        {value:"7",name:"눈날림"} 
        
      ]
      let defaultvalue=``

      switch(devalue){
        case "맑음":
            defaultvalue="0"
            break;
        case "비":
            defaultvalue="1"
            break;
        case "비/눈":
            defaultvalue="2"
            break;
        case "눈":
            defaultvalue="3"
            break;
        case "빗방울":
            defaultvalue="5"
            break;
        case "빗방울/눈날림":
            defaultvalue="6"
            break;
        case "눈날림":
            defaultvalue="7"
            break;
      }


      const onHandler=(e)=>{
        setptyvalue(e.currentTarget.value)
      }
    return (
        <select onChange={onHandler} value={defaultvalue}>
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
    )
}