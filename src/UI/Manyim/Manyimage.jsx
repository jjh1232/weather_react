import React, { useEffect, useState } from "react";
import styled from "styled-components";


const Size=styled.div`
    width:1280px;
    height:720px;
    
`
function Manyimage(){
const [showimages,setShowimages]=useState([]);

//이미지상대경로 저장
const handler=(e)=>{
    console.log("핸들러실행")
    const imagelist=e.target.files;

    let imageUrllist=[...showimages,{filename:"",value:""}]
    
    for(let i=0;i<imagelist.length;i++){
        console.log("이미지저장실행"+imagelist[i].name)
        const reader=new FileReader();
        reader.readAsDataURL(imagelist[i])
            reader.onload=()=>{
                imageUrllist.push({filename:i,
                    value:reader.result});
             
            }
       // const currentimageurl=URL.createObjectURL(imagelist[i]);
        //imageUrllist.push(currentimageurl);
    }
    
    const solt=imageUrllist.sort((a,b)=>{
        return a.filename-b.filename;
    });
    setShowimages(solt);
}

useEffect(()=>{

},[showimages])
    return (
        <>
        
        <input type="file" multiple onChange={handler}/>
        <br/>
        
        {showimages.map((img,id)=>{
            return(
            <>
            {img.filename}
            <br/>
             
                
               <img src={img.value} />
            
            <br/>

            </>)
        })}
        </>
    )
}
export default Manyimage