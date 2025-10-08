import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark as exiticon } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassPlus as plusicon } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassMinus as minusicon } from "@fortawesome/free-solid-svg-icons";
const Outdiv=styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;//배경투명
    //pointer-events: none;//클릭,마우스이벤트무시
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    //display: none;
`
const EditorWrapper=styled.div`
//position: absolute;
width: 30%;
height: 60%;
    background-color: rgba(255,255,255,1);
    display: flex;
    flex-direction: column;
    border-radius: 5%;

`
const Headerdiv=styled.div`
    display: flex;
       
   // border: 1px solid red;
    height: 10%;
    justify-content: center;
`
const Exitdiv=styled.div`
 
  display: flex;
  align-items: center;
  margin-left:15px;
`
const ExitButton=styled.button`
  border: none;
  background-color: white;
  height: 70%;
  border-radius: 50%;
  cursor: pointer;
  :hover{
    background-color: rgba(179, 179, 179, 0.5);
  }
`
const Exiticon=styled(FontAwesomeIcon)`
  font-size: 28px;
`
const Textdiv=styled.div`
 //border: 1px solid green;
 color: black;
 display: flex;
 align-items: center;
 margin-left: 25px;
 font-size: 22px;
 font-weight: 800;
 
`
const Buttondiv=styled.div`
margin-left:auto;
display  : flex;
justify-content: center;
align-items: center;
margin-right: 25px;

`
const SaveButtoncss=styled.button`
    border: none;
    background-color: black;
    color: white;
    font-size: 15px;
    font-weight: 300;
    border-radius: 9999px; /* 완전 둥근 모서리 */
    padding: 7px 20px;
    cursor: pointer;

:hover{
  background-color: #2453ac;
}
`
const Body=styled.div`
    border: 1px solid blue;
    position: relative;
    height: 80%;
      overflow: hidden;
`
const Preimage=styled.img`
    width: 100%;
    height: 100%;
    display: block;
  object-fit: cover;
`
const Focusdiv=styled.div`
    position: absolute;
     height: 150px;
    width: 550px;
    border: 2px solid #2068c5;
    transform: translate(-50%, -50%);
     top: 50%;
  left: 50%;
    /* 큰 그림자(주변 어둡게) 효과 */
   box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3);
`
const Bottom=styled.div`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    gap: 15px;
    height: 8%;
`
const Minusdiv=styled.div`
    
`
const Rangegage=styled.input`
    width: 60%;
`
const Plusdiv=styled.div`
    
`
const Gageicon=styled(FontAwesomeIcon)`
    color: gray;
`
export default function ImageEditor(props){
    const {file,onupdate}=props;

    const [Imagedata,setImagedata]=useState();

    //꾹누르기용 
    const intervalid=useRef(null);
    //줌세팅
    const [zoom,setZoom]=useState(1)
    useEffect(()=>{
        const url=URL.createObjectURL(file);
        setImagedata(url);
        return ()=> URL.revokeObjectURL(url);
    },[file])
    const handleEdit=()=>{
        onupdate(file)
    }

    const gagemousedown=(delta)=>{
        if(intervalid.current) return; //중복방지
        
        intervalid.current=setInterval(()=>{
           
            setZoom(prev=>
            { const newzoom=prev+delta
            return Math.min(newzoom,100)
            });
        },100) //0.1초마다
        
    }
    const gageplusmouseup=()=>{
        if(intervalid.current){
            clearInterval(intervalid.current);
            intervalid.current=null;
        }
    }
    //핸들로
    const handleWheel=(e)=>{
        e.preventDefault();
        const delta=-e.deltaY || e.wheelDelta; //휠방향감지

        setZoom(prev=>{
            let newZoom=prev+(delta>0?1:-1);
            return Math.min(Math.max(newZoom,1),100);//줌제한
        })
    }
    return (
        <Outdiv>
           
      
        <EditorWrapper>
             <Headerdiv>
                <Exitdiv>
                    <ExitButton onClick={handleEdit}>
                        <Exiticon icon={exiticon}/>
                    </ExitButton>
                </Exitdiv>
                <Textdiv>
                    Edit Media
                </Textdiv>
                <Buttondiv>
                    <SaveButtoncss>Apply</SaveButtoncss>
                </Buttondiv>
            </Headerdiv>
            <Body onWheel={handleWheel}>
                 {Imagedata && <Preimage src={Imagedata} alt="preview" />}
      
                <Focusdiv />
            </Body>
       
        <Bottom>
            <Minusdiv onClick={()=>setZoom(prevZoom=>Math.max(prevZoom -1,1))}
                  onMouseDown={()=>gagemousedown(-1)}
                onMouseLeave={gageplusmouseup}
                onMouseUp={gageplusmouseup}
                >
            <Gageicon icon= {minusicon} />
            </Minusdiv>
            <Rangegage type="range" 
            value={zoom}
             min="1"
             max="100"
             onChange={(e)=>setZoom(parseFloat(e.target.value))} 
             step="1"
             />
            <Plusdiv onClick={()=>setZoom(prevZoom=>Math.min(prevZoom +1,100))}
                onMouseDown={()=>gagemousedown(1)}
                onMouseLeave={gageplusmouseup}
                onMouseUp={gageplusmouseup}
                >
            <Gageicon icon={plusicon} />
            </Plusdiv>
        </Bottom>
        </EditorWrapper>
          </Outdiv>
    )
}