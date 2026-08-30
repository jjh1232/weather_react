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
    position: relative;
      display: flex;
  justify-content: center;
  align-items: center;
    height: 80%;
    width: 100%;
      overflow: hidden;
`
const Preimage=styled.img`
    position: relative;
    width: 550px;
    height: 550px;
    
    display: block;
  object-fit: cover;
  transform: ${props => `translate(${props.offsetX}px, ${props.offsetY}px) scale(${props.zoom})`};
 transition: ${props => (props.isDragging ? 'none' : 'transform 0.3s ease')};
  cursor:grab;
`
const Focusdiv=styled.div`
    position: absolute;
    /* 크기는 ImageEditor 가 계산한 focussize 를 그대로 받는다.
       예전엔 여기서 mode==="profile" 로 비교했는데 부모가 넘기는 값은
       "Background"/"Profile" 이라 항상 150px 로 떨어졌다. */
     width: ${props => props.boxw}px;
    height: ${props => props.boxh}px;
    border: 1px solid #2068c5;
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
    const {file,onupdate,mode,setback}=props;

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
    const focusdivref=useRef(null);


    //포커스존 사이즈객체형식으로해봄 
    const focus_size={
        Profile:{width:550,height:550},
        Background:{width:550,height:150},
        default:{width:550,height:150}
    }
    //형식사용
    const focussize=focus_size[mode]||focus_size.default;
    
    //화면에 그려지는 정사각 표시 상자 한 변(Preimage 의 width/height)
    const VIEW=550;
    //원본 픽셀 크기. crop 계산은 전부 여기서 출발한다.
    const [natural,setNatural]=useState({w:0,h:0})

    const handlemousedown=(e)=>{
        e.preventDefault();
        isdraggingref.current=true;
        dragstartref.current={x:e.clientX,y:e.clientY};
    };
   
    //드래그 이펙트 이거 tag보다 useeffect가 벗어낫을떄같은데 유동적이고좋음
    useEffect(()=>{
         const handlemousemove = (e) => {
    if (!isdraggingref.current) return;

    const dx = e.clientX - dragstartref.current.x;
    const dy = e.clientY - dragstartref.current.y;

    dragstartref.current = { x: e.clientX, y: e.clientY };
           
    //object-fit:cover 라 이미지는 항상 VIEW x VIEW 를 채운다.
      //줌을 걸면 VIEW*zoom 이 되고, 그 안에서 포커스 박스가 빠져나가지 않을 만큼만 움직인다.
      const limitX = Math.max(0,(VIEW*zoom - focussize.width) / 2);
      const limitY = Math.max(0,(VIEW*zoom - focussize.height) / 2);
      const minlimitX = -limitX;
      const maxlimitX =  limitX;
      let minlimitY =  limitY;
      let maxlimitY = -limitY;
    setImgoffset(prev => {
      let newX = prev.x + dx;
      let newY = prev.y + dy;

  
      // Body 안에서만 이동 가능하도록 제한
          // Body 크기 기준 이동 제한 (transform 기반으로 직접 계산)
      
      newX = Math.min(maxlimitX,Math.max(newX, minlimitX));
      newY = Math.min(minlimitY,Math.max(newY, maxlimitY));

      return { x: newX, y: newY };

       

    });
    //dx,dy저장
    
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

    //받은 파일이미지 들어올시
    const handleimageload=(e)=>{
        const img=e.currentTarget;
        const natw=img.naturalWidth;
        const nath=img.naturalHeight;

    

         

   
        setNatural({w:natw,h:nath})
        //초기화
            setImgoffset({ x: 0, y: 0 });
             setZoom(1);
    }
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
        //wheeldelta는 구버전호환 이건위로스크롤시 +,deltaY는 위로스크롤시 e.deltay는 음수 
        const delta=-e.deltaY || e.wheelDelta; //휠방향감지

        setZoom(prev=>{
            let newZoom=prev+(delta>0?0.2:-0.2);
            return Math.min(Math.max(newZoom,1),3);//줌제한
        })

    }
    /* ── 잘라내기 ─────────────────────────────────────────────
       예전 계산은 "표시된 이미지 = 원본 전체" 라고 가정했다.
       하지만 Preimage 는 550x550 에 object-fit:cover 라 원본의 가운데만 보인다.
       (가로로 긴 지도라면 좌우가 잘려 나간다)
       그래서 crop.w 에 원본 전체 너비를 넣으면, 화면에 보이지도 않는 좌우까지
       550x150 캔버스에 눌러 담게 된다. 미리보기가 파란 박스보다 넓게 나온 이유다.

       올바른 대응:
         s = max(VIEW/natw, VIEW/nath)   // cover 배율
         k = s * zoom                    // 화면 1px == 원본 1/k px
       그리고 transform: translate(T) scale(z) 는 "가운데 기준 확대 후 이동" 이므로
         원본좌표 = 원본중심 - (포커스박스절반 + 이동량) / k
       ───────────────────────────────────────────────────── */
    const saveFocusArea=()=>{
        if(!Imagedata||!natural.w||!natural.h) return;

        const img=new window.Image();
        img.src=Imagedata;

        img.onload=()=>{
            const natw=img.naturalWidth;
            const nath=img.naturalHeight;

            const cover=Math.max(VIEW/natw, VIEW/nath);
            const k=cover*zoom;

            let cropW=focussize.width/k;
            let cropH=focussize.height/k;
            let cropX=natw/2-(focussize.width/2+imgoffset.x)/k;
            let cropY=nath/2-(focussize.height/2+imgoffset.y)/k;

            //드래그 제한이 있어 보통은 안 넘지만, 반올림으로 삐져나가면 투명이 섞인다
            cropW=Math.min(cropW,natw);
            cropH=Math.min(cropH,nath);
            cropX=Math.min(Math.max(cropX,0),natw-cropW);
            cropY=Math.min(Math.max(cropY,0),nath-cropH);

            const canvas=document.createElement('canvas');
            canvas.width=focussize.width;
            canvas.height=focussize.height;
            const ctx=canvas.getContext('2d');

            ctx.drawImage(img,
                cropX,cropY,cropW,cropH,   //원본에서 잘라낼 영역
                0,0,canvas.width,canvas.height //캔버스에 채우기
            );

            /* 서버가 MultipartFile 로 받으므로 base64(dataURL)가 아니라 Blob 이 필요하다.
               미리보기용 objectURL 도 같이 넘겨서 화면에는 바로 보이게 한다. */
            canvas.toBlob((blob)=>{
                if(!blob) return;
                const previewurl=URL.createObjectURL(blob);
                onupdate({blob:blob,preview:previewurl});
            },"image/png");
        }
    }

    return (
        <Outdiv>
           
      
        <EditorWrapper>
             <Headerdiv>
               
                <Exitdiv>
                    <ExitButton onClick={()=>setback(null)}>
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
                    onLoad={handleimageload}
                 />}
              
                <Focusdiv boxw={focussize.width} boxh={focussize.height} ref={focusdivref}/>
                
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