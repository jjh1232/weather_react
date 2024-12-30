import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Canvasdiv=styled.div`

width: 300px;
height: 300px;
border:1px solid black;

    `
const Canvasstyle=styled.canvas`


border: 1px solid blue
`
const Tools=styled.div`
    
`
const Preview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`

export default function SelfDraw(){
const canvasRef=useRef(null)
const [isDrawing,setIsDrawing]=useState(false)
const [lineColor,setLingColor]=useState("black");
const [lineWidth,setLineWidth]=useState(5);
const [mousecur,setMousecur]=useState("write");
const [mousecursor,setMousecursor]=useState("draw");
const [getCtx,setGetCtx]=useState();
const [preview,setPreview]=useState();
const ctxref=useRef();
useEffect(()=>{
    const canvas=canvasRef.current
    const ctx=canvas.getContext(`2d`)
    
    ctx.lineJoin='round';
    ctx.strokeStyle=lineColor;
    ctx.lineWidth=lineWidth;
    setGetCtx(ctx)
    ctxref.current=ctx
    
},[lineColor,lineWidth])

const onmouseDown=(e)=>{
   
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    getCtx.beginPath();
    getCtx.moveTo(mouseX,mouseY)
    //ctxref.current.beginPath();
    //ctxref.current.moveTo(mouseX,mouseY);
    setIsDrawing(true)
    console.log("클릭실행"+e)
}
const onMouseMove=(e)=>{
    if(isDrawing){
    //console.log(e)
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
      
      
       getCtx.lineTo(mouseX,mouseY);
      
       getCtx.stroke();
       
       // ctxref.current.lineTo(mouseX,mouseY)
        //ctxref.current.stroke();
    }
}
const stopDrawing=(e)=>{
    
   //getCtx.drawImage()
    const canv=getCtx;
    //const image=canv.toDateURL("image/png")
    //setPreview(image)
    //console.log("알이에프커렌트:"+canv.toDateURL("image/png"))
   // console.log("알이에프:"+URL.createObjectURL(canvasRef.current))
    //console.log("겟ctx:"+URL.createObjectURL(getCtx))
    setIsDrawing(false)
   console.log(canv)
   const image=canvasRef.current.toDataURL("image/png");
   console.log(image)
   setPreview(image)
}
const onClear=(e)=>{
    getCtx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height)
}
const Erager=()=>{
    setMousecur("erager")
    setLingColor("white")
}
const onsave=()=>{
    opener.parentCallback(preview);
        window.close();
}
    return (

        <div>
            <Canvasdiv mousecur={mousecursor}>
                <Canvasstyle
                ref={canvasRef}
                width={"300px"}
                height={"300px"}
                onMouseDown={onmouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                />
            </Canvasdiv>
            <Tools>
            <input type="color" value={lineColor} onChange={(e)=>{
                setLingColor(e.target.value)
            }} /> 
            <input type="number" value={lineWidth} onChange={(e)=>{
                setLineWidth(e.target.value)
            }}/>
            <br/>
            <button onClick={Erager}>지우개</button><br/>
            <button onClick={onClear}>전부지우기</button>
            </Tools>
            <br/>

         
            {preview &&
        <>
        미리보기<br/>
        <Preview>
        <img src={preview} style={{objectFit:"fill",width:"100%",height:"100%"}}/>
        </Preview>
        </>}
        <button onClick={onsave}>프로필이미지저장</button>
        </div>
    )        
    
}