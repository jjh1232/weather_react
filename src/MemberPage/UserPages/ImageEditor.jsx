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
    border: 1px solid red;
    position: relative;
    height: 80%;
    width: 100%;
      overflow: hidden;
`
const Preimage=styled.img`
    width: 100%;
    height: 100%;
    display: block;
    border: 3px solid blue;
  object-fit: cover;
  transform: ${props => `translate(${props.offsetX}px, ${props.offsetY}px) scale(${props.zoom})`};
 transition: ${props => (props.isDragging ? 'none' : 'transform 0.3s ease')};
  cursor:grab;
`
const Focusdiv=styled.div`
    position: absolute;
     width: ${props => (props.mode === "profile" ? "550px" : "550px")};
    height: ${props => (props.mode === "profile" ? "550px" : "150px")};
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
    const {file,onupdate,mode}=props;

    const [Imagedata,setImagedata]=useState();
    const [zoom,setZoom]=useState(1)
    //꾹누르기용 
    const intervalid=useRef(null);

    //드래그 조정
    const [imgoffset,setImgoffset]=useState({x:0,y:0})
    const dragstartref=useRef({x:0,y:0});
    const isdraggingref=useRef(false);
    const bodyref=useRef(null);
    const imgref=useRef(null);

    const [previmgaesrc,setpreviewsrc]=useState(null)

    const handlemousedown=(e)=>{
        e.preventDefault();
        isdraggingref.current=true;
        dragstartref.current={x:e.clientX,y:e.clientY};
    };
   
    //드래그 이펙트 이거 tag보다 useeffect가 벗어낫을떄같은데 유동적이고좋음
    useEffect(()=>{
         const handlemousemove = (e) => {
    if (!isdraggingref.current) return;

    const bodyRect = bodyref.current.getBoundingClientRect();
    const img = imgref.current;
     const imgRect=img.getBoundingClientRect();
   
      
    const dx = e.clientX - dragstartref.current.x;
    const dy = e.clientY - dragstartref.current.y;

    dragstartref.current = { x: e.clientX, y: e.clientY };
            const focusHeight=150;
            const focusWidth=550;
    setImgoffset(prev => {
      let newX = prev.x + dx;
      let newY = prev.y + dy;

      const minlimitX = (imgRect.width - focusWidth) / 2*-1;  // 왼쪽 끝까지 이동
      const maxlimitX = (imgRect.width - focusWidth) / 2;       // 오른쪽 끝까지 이동
      let minlimitY=(imgRect.height-focusHeight)/2;//아래최대
      let maxlimitY=(imgRect.height-focusHeight)/2*-1;//위최대
      // Body 안에서만 이동 가능하도록 제한
          // Body 크기 기준 이동 제한 (transform 기반으로 직접 계산)
      
      newX = Math.min(maxlimitX,Math.max(newX, minlimitX));
      newY = Math.min(minlimitY,Math.max(newY, maxlimitY));

      return { x: newX, y: newY };
    });
  };

  const handlemouseup = () => {
    isdraggingref.current = false;
  };

  document.addEventListener("mousemove", handlemousemove);
  document.addEventListener("mouseup", handlemouseup);

  return () => {
    document.removeEventListener("mousemove", handlemousemove);
    document.removeEventListener("mouseup", handlemouseup);
  };
    },[zoom]);
   
    //줌세팅
    
    useEffect(()=>{
        const url=URL.createObjectURL(file);
        setImagedata(url);
        return ()=> URL.revokeObjectURL(url);
    },[file])
    const handleEdit=()=>{
        onupdate(file)
    }

    const gagemousedownplus=(delta)=>{
        if(intervalid.current) return; //중복방지
        
        intervalid.current=setInterval(()=>{
           
            setZoom(prev=>
            { const newzoom=prev+delta
            return Math.min(newzoom,3)
            });
        },100) //0.1초마다
        
    }
      const gagemousedownminus=(delta)=>{
        if(intervalid.current) return; //중복방지
        
        intervalid.current=setInterval(()=>{
           
            setZoom(prev=>
            { const newzoom=prev+delta
            return Math.max(newzoom,1)
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
            let newZoom=prev+(delta>0?0.2:-0.2);
            return Math.min(Math.max(newZoom,1),3);//줌제한
        })

    }
    //포커스디브저장
    const saveFocusArea=()=>{
        console.log("이미지저장")
        const canvas=document.createElement('canvas');
        const focusWidth=550;
        const focusheight=150;
        canvas.width=focusWidth;
        canvas.height=focusheight;
        const ctx=canvas.getContext('2d');
        console.log("이미지저장2")
        //임시
        const sWidth=550;
        const sHeight=150;
        //이미지객체생성
        const img= new window.Image();
        img.src=Imagedata;
        console.log("이미지저장3")
        img.onload=()=>{
            //전체이미지에서 값구해야할듯
console.log("이미지저장4")
            ctx.drawImage(img,//원본
                0,0,sWidth,sHeight,//원본이미지자를위치와크기 focus존
                0,0 //캔버스에 이미지를 위치에그림 공백쓸건아니니0,0으로
                ,focusWidth,focusheight //dx,dy위치에 지정한크기로그림
            );
            //결과저장
            //canvas.toBlob(blob=>{//blob이나 url로저장
              //          })
        const dataurl=canvas.toDataURL("image/png");
        setpreviewsrc(dataurl)
            }

    }
    return (
        <Outdiv>
           
      
        <EditorWrapper>
             <Headerdiv>
                {previmgaesrc&&<img src={previmgaesrc} alt="미리보기" />}
                <Exitdiv>
                    <ExitButton onClick={handleEdit}>
                        <Exiticon icon={exiticon}/>
                    </ExitButton>
                </Exitdiv>
                <Textdiv>
                    Edit Media
                </Textdiv>
                <Buttondiv>
                    <SaveButtoncss onClick={saveFocusArea}>Apply</SaveButtoncss>
                </Buttondiv>
            </Headerdiv>
            <Body onWheel={handleWheel}
                    ref={bodyref}
                   onMouseDown={handlemousedown}
                   isDragging={isdraggingref.current}
                    >
                 {Imagedata && <Preimage src={Imagedata} alt="preview" zoom={zoom}
                  offsetX={imgoffset.x}
                   offsetY={imgoffset.y}
                    ref={imgref}
                 />}
      
                <Focusdiv mode={mode} />
            </Body>
       
        <Bottom>
            <Minusdiv onClick={()=>setZoom(prevZoom=>Math.max(prevZoom -0.1,1))}
                  onMouseDown={()=>gagemousedownminus(-0.1)}
                onMouseLeave={gageplusmouseup}
                onMouseUp={gageplusmouseup}
                >
            <Gageicon icon= {minusicon} />
            </Minusdiv>
            <Rangegage type="range" 
            value={zoom}
             min="1"
             max="3"
             onChange={(e)=>setZoom(parseFloat(e.target.value))} 
             step="0.1"
             />
            <Plusdiv onClick={()=>setZoom(prevZoom=>Math.min(prevZoom +0.1,3))}
                onMouseDown={()=>gagemousedownplus(0.1)}
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