import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark as exiticon } from "@fortawesome/free-solid-svg-icons";
import { faCameraRetro as photoicon } from "@fortawesome/free-solid-svg-icons";
import ImageEditor from "./ImageEditor";
import FileResizer from "react-image-file-resizer";

const Outdiv=styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(58, 184, 64, 0.5);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Indiv=styled.div`
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
const Bodydiv=styled.div`
    position: relative;
    height: 90%;
   
`
const Backgrounddiv=styled.div`
    height: 150px;
    width: 550px;
    background-color: rgba(92, 92, 92, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3px;
    margin-left: 12px;
`
const PhotoButton=styled.button`
      background-color: rgba(51, 51, 51, 0.8);
      border: none;
      border-radius:50%;
      padding: 10px 10px;
      cursor: pointer;
      :hover{
        background-color: rgba(51, 51, 51, 0.6);
      }
      
`
const Photoicon=styled(FontAwesomeIcon)`
  font-size: 20px;
  color: white;
`
const Profilediv=styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
    width: 85px;
    height: 85px;
    top: 112px;
      transform: translateX(30%);
    border: 3px solid white;
    
    background-color: rgba(46, 46, 46, 0.8);
`

const Userdatadiv=styled.div`
    display: flex;
    flex-direction: column;
   
    margin-top: 60px;
`
const Nicknamediv=styled.div`
    height: 70px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
      /* label 왼쪽 정렬 */
  & > label {
    align-self: flex-start;
    margin-left: 5%;
  }
    
`
const Nickname=styled.input`
    width: 90%;
    height: 65%;
`
const Introdiv=styled.div`
height: 150px;
position: relative;
   display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    margin-top: 20px;
  /* label 왼쪽 정렬 */
  & > label {
    align-self: flex-start;
    
    margin-left: 5%;
    
  }
`
const Introinput=styled.input`
     width: 90%;
     height: 85%;

`
const Label=styled.label`
position: absolute;
    font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
`
export default function UserProfileEditmodal(props) {
    console.log("에딧모달실행")
    const Backgroundref=useRef(null) ;
    const Profileref=useRef(null);  
  
    const [Profile,setProfile]=useState();
    const [Backgroundfile,setBackgroundfile]=useState();
    const inputRef=useRef(null)


    const HandleBackClick=()=>{
      Backgroundref.current.click();
    }
    const HandleProfileclick=()=>{
      Profileref.current.click()
    }
    const resizefile= (file) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,          // 리사이징할 원본 파일(Blob)
      450,           // 최대 너비
      150,           // 최대 높이
      "JPEG",        // 이미지 포맷
      100,           // 품질 (0 ~ 100)
      0,             // 회전 (0~360)
      (uri) => {
        resolve(uri); // 리사이즈된 결과(base64) 반환
      },
      "file"       // 출력 타입(base64, blob, file 중 선택)
    );
  });
    const handleBackground=async (e)=>{
      const file=e.target.files[0];
      if(file){
        //Promise써야함
        const resizeimage=await resizefile(file);
        setBackgroundfile(resizeimage)
      }
      //같은파일시에도 값을 초기화해줘야함
      //e.target.value = '';
        // input ref로 직접 초기화 ,리액트문제라는데 ref로직접초기화
  if (Backgroundref.current) {
    Backgroundref.current.value = null;
  }
    }
        const handleProfile=(e)=>{
      const file=e.target.files[0];
      if(file){
        setProfile(file)
      }
    }
    //업데이트용
    const handleBackchange=(updatefile)=>{
      setBackgroundfile(updatefile)
    }
    const handleProfilechange=(updatefile)=>{
      setProfile(updatefile)
     
    }
    
    //힐막기 
    const handleWheel=(e)=>e.preventDefault(); 
    const outdivRef=useRef(null)
    useEffect(()=>{
    const node = outdivRef.current;
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: false });//passive설정을 직접하는게중요
      //passive는 기본동작을 true일시 호출하지 않을거라고 미리말해 렌더링최적화시키기떄뭉네 false로 설저앻줘야함
    }
      //종료후 다시실행
    return () => {
      if (node) {
        node.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

    //내부 에 모두포함되서 클릭과 현재 디브가같을시만종료
  return (
    <Outdiv onClick={(e)=>
    {if(e.target===e.currentTarget){
    props.setisedit(false);
    }
    }} 
    ref={outdivRef}
    >
      <Indiv>
        <Headerdiv>
            <Exitdiv>
              <ExitButton onClick={()=>props.setisedit(false)}>
                <Exiticon icon={exiticon}/>
              </ExitButton>
            </Exitdiv>
            <Textdiv>
              Edit Profile
            </Textdiv>
            <Buttondiv>
              <SaveButtoncss>
                Save
              </SaveButtoncss>
            </Buttondiv>
        </Headerdiv>
        <Bodydiv>
            <Backgrounddiv>
              <PhotoButton onClick={HandleBackClick}>
                    <Photoicon icon={photoicon}/>
              </PhotoButton>
              <input type="file" ref={Backgroundref} style={{display:"none"}} 
              accept="image/*" onChange={handleBackground}/>
              {Backgroundfile&&<ImageEditor file={Backgroundfile} onupdate={handleBackchange} mode="Background" setback={setBackgroundfile}/>}
            </Backgrounddiv>
            <Profilediv>
                 <PhotoButton onClick={HandleProfileclick}>
                    <Photoicon icon={photoicon}/>
                </PhotoButton>
                <input type="file" ref={Profileref} style={{display:"none"}} 
              accept="image/*" onChange={handleProfile}/>
              {Profile&&<ImageEditor file={Profile} onupdate={handleProfilechange}/>}
            </Profilediv>
            <Userdatadiv>
              <Nicknamediv>
                <Label htmlFor="nickinput">Nickname</Label>
                 <Nickname id="nickinput" type="text" />
              </Nicknamediv>
              <Introdiv>
                <Label htmlFor="Introinput">Bio</Label>
                <Introinput id="Introinput" />
              </Introdiv>
               
                
            </Userdatadiv>
        </Bodydiv>

      </Indiv>
    </Outdiv>
    
  );
}